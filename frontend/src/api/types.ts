export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ValidationError {
  message: string
  errors: Record<string, string[]>
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user_id: number
  name: string
}

export interface User {
  id: number
  name: string
  email: string
  role: string
  created_at: string
}

export interface Category {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: number
  category_id: number
  category: { id: number; name: string } | null
  sku?: string
  name: string
  price: number
  stock: number
  image_url?: string | null
  created_at?: string
  updated_at?: string
}

export interface TransactionItem {
  id: number
  product_id: number
  quantity: number
  price: number
  subtotal: number
  product: { id: number; name: string }
}

export interface Transaction {
  id: number
  user_id: number
  total_amount: number
  payment_method?: string
  status: string
  created_at: string
  items?: TransactionItem[]
}

export interface TransactionListItem {
  id: number
  user_id: number
  total_amount: number
  payment_method?: string
  status: string
  created_at: string
}

export interface TransactionListResponse {
  data: TransactionListItem[]
  total: number
  page: number
  per_page: number
}

export interface CreateTransactionPayload {
  items: { product_id: number; quantity: number }[]
  payment_method: string
  uang_diterima: number
}

export interface DailyReport {
  date: string
  total_transactions: number
  total_revenue: number
  top_products: {
    product_id: number
    product_name: string
    total_quantity: number
    total_subtotal: number
  }[]
}
