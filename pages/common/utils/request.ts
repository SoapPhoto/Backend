import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3001',
  validateStatus (status: number) {
    return status < 500 && status !== 404;
  },
});

instance.interceptors.response.use(
  (response: any) => {
    if (response.status >= 400) {
      return Promise.reject(response);
    }
    return Promise.resolve(response);

  },
  (error: any) =>
    Promise.reject(error),
);

export const request = instance;
