<template>
    <ion-page>
      <ion-header :translucent="true">
        <ion-toolbar class="custom-toolbar">
          <ion-title class="toolbar-title">🌥️ Prakiraan Cuaca Jakarta</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content :fullscreen="true">
        <div id="container">
          <div class="hero-card">
            <p class="subtitle">📅 Suhu per jam, 7 hari ke depan</p>
            <p class="location">📍 Jakarta, Indonesia</p>
            <p class="btn-wrap">
              <ion-button @click="ambilData" :disabled="loading" class="fetch-btn" expand="block">
                <span v-if="loading" class="loading-text">⌛ Memuat....</span>
                <span v-else>🔃 Ambil Data Cuaca</span>
              </ion-button>
            </p>
          </div>

          <p v-if="errorMsg" class="error">⚠️ {{ errorMsg }}</p>

          <div v-if="dataCuaca.length" class="table-wrap">
            <p class="data-count">Menampilkan {{ dataCuaca.length }} data</p>
            <table class="center">
              <thead>
                <tr>
                  <th>🕑 Waktu</th>
                  <th>🌡️ Suhu</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in dataCuaca" :key="item.time" class="data-row">
                  <td>{{ formatWaktu(item.time) }}</td>
                  <td><span class="temp-badge">{{ item.temperature }} {{ satuan }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ion-content>
    </ion-page>
  </template>


<script lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/vue';
import { defineComponent } from 'vue';
import EndPointAccess from '@/services/EndPointAccess';

interface CuacaPerJam {
  time: string;
  temperature: number;
}

const API_URL = 'https://api.open-meteo.com/v1/forecast?latitude=-6.2&longitude=106.8&hourly=temperature_2m'

export default defineComponent({
  name: 'Home',
  data() {
    return {
      dataCuaca: [] as CuacaPerJam[],
      satuan: '°C',
      loading: false,
      errorMsg: ''
    };
  },
  methods: {
    async ambilData() {
      this.loading = true;
      this.errorMsg = '';
      try {
        const api = new EndPointAccess(API_URL);
        const response = await api.getRes()
        const hourly = response.data.hourly;

        this.dataCuaca = hourly.time.map((t: string, i: number) => ({
          time: t,
          temperature: hourly.temperature_2m[i]
        }));
        this.satuan = response.data.hourly_units?.temperature_2m ?? '°C';
      } catch (error) {
        this.errorMsg = 'Data cuaca gagal diambil. Periksa koneksi internet, lalu coba lagi.';
      } finally {
        this.loading = false;
      }
    },
    formatWaktu(time: string) {
      // "2026-11-2T06:00" -> "2026-11-2 06:00"
      return time.replace('T', ' ');
    }
  },
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton
  }
})
</script>

<style scoped>
#container {
  text-align: center;
  padding: 20px 16px;
  max-width: 600px;
  margin: 0 auto;
}

.custom-toolbar {
  --background: linear-gradient(135deg, #1a73e8, #0d47a1);
  --color: #ffffff;
}
.toolbar-title {
  font-weight: 700;
  letter-spacing: 0.5px;
}


.hero-card {
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  border-radius: 16px;
  padding: 24px 20px 16px;
  margin-bottom: 20px;
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.15);
}

.subtitle {
  font-size: 17px;
  font-weight: 600;
  color: #1565c0;
  margin: 0 0 4px;
}

.location {
  font-size: 13px;
  color: #5c7fa8;
  margin: 0 0 16px;
}

.btn-wrap {
  margin: 0;
}

.fetch-btn {
  --background: linear-gradient(135deg, #1976d2, #1565c0);
  --border-radius: 12px;
  --box-shadow: 0 4px 12px rgba(21, 101, 192, 0.35);
  font-weight: 600;
  letter-spacing: 0.3px;
}

.loading-text {
  opacity: 0.8;
}

/* ── Error ── */
.error {
  color: var(--ion-color-danger);
  background: #fff0f0;
  border: 1px solid #ffcdd2;
  border-radius: 10px;
  padding: 10px 14px;
  margin: 0 0 16px;
  font-size: 14px;
}

/* ── Tabel ── */
.table-wrap {
  max-width: 500px;
  margin: 0 auto;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
}

.data-count {
  font-size: 12px;
  color: #888;
  margin: 0 0 8px;
  text-align: right;
  padding-right: 4px;
}

.center {
  width: 100%;
  border-collapse: collapse;
}

th {
  position: sticky;
  top: 0;
  background: linear-gradient(135deg, #1976d2, #1565c0);
  color: #ffffff;
  font-weight: 600;
  padding: 12px 16px;
  text-align: left;
  font-size: 13px;
  letter-spacing: 0.4px;
}

th:last-child {
  text-align: right;
}

td {
  padding: 10px 16px;
  border-bottom: 1px solid #e8f0fe;
  font-size: 14px;
  color: #333;
  text-align: left;
}

td:last-child {
  text-align: right;
}

.data-row:nth-child(even) {
  background: #f5f9ff;
}

.data-row:hover {
  background: #e3f2fd;
  transition: background 0.2s ease;
}

/* ── Badge suhu ── */
.temp-badge {
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  color: #1565c0;
  border-radius: 20px;
  padding: 3px 10px;
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
}
</style>
