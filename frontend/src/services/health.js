import { api } from './api';

export const healthService = {
  check: () => api.get('/health').then(res => res.data),
};
