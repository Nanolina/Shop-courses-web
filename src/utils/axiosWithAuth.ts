import axios from 'axios';

export function createAxiosWithAuth(initDataRaw: string) {
  return axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    headers: {
      Authorization: initDataRaw,
    },
  });
}
