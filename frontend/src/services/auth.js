import { api } from './api';

export const authService = {
  login: (email, password) =>
    api.post('/tokens/create', { email, password, device_name: 'pos-frontend' }).then((res) => res.data),
  getUser: () => api.get('/user').then((res) => res.data),
};
