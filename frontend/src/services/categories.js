import { api } from './api';

export const categoryService = {
  getAll: () => api.get('/categories').then(res => res.data),
  getById: (id) => api.get(`/categories/${id}`).then(res => res.data),
  create: (data) => api.post('/categories', data).then(res => res.data),
  update: (id, data) => api.put(`/categories/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/categories/${id}`).then(res => res.data),
};
