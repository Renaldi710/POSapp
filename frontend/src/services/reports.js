import { api } from './api';

export const reportsService = {
  getDailyReport: (date) => {
    const params = date ? { date } : {};
    return api.get('/reports/daily', { params }).then(res => res.data);
  },
};
