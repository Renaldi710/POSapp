export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/tokens/create', },
  USER: {
    ME: '/api/user',
  },
  CATEGORIES: {
    LIST: '/api/categories',
    CREATE: '/api/categories',
  },
  PRODUCTS: {
    LIST: '/api/products',
    DETAIL: (id: number) => `/api/products/${id}`,
    CREATE: '/api/products',
    UPDATE: (id: number) => `/api/products/${id}`,
    DELETE: (id: number) => `/api/products/${id}`,
  },
  TRANSACTIONS: {
    LIST: '/api/transactions',
    DETAIL: (id: number) => `/api/transactions/${id}`,
    CREATE: '/api/transactions',
    RECEIPT: (id: number) => `/api/transactions/${id}/receipt`,
  },
  REPORTS: {
    DAILY: '/api/reports/daily',
  },
} as const
