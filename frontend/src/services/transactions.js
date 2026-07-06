import { api } from './api';

export const transactionService = {
  getAll: () => api.get('/transactions').then(res => res.data),
  getById: (id) => api.get(`/transactions/${id}`).then(res => res.data),
  create: (items) => api.post('/transactions', { items }).then(res => res.data),
};
