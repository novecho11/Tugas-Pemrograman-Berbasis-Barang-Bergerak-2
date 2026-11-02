import axios, { type AxiosResponse } from 'axios';

class EndPointAccess {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  async getRes(): Promise<AxiosResponse> {
    return await axios.get(this.url);
  }
}

export default EndPointAccess;

