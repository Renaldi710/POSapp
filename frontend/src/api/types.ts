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
  device_name: string
}

export interface LoginResponse {
  token: string
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
  products_count: number
}

export interface Product {
  id: number
  category_id: number
  name: string
  price: string
  stock: number
  category: Category
}

export interface TransactionItem {
  id: number
  product_id: number
  quantity: number
  price: string
  subtotal: string
  product: { id: number; name: string }
}

export interface Transaction {
  id: number
  user_id: number
  total_amount: string
  status: string
  created_at: string
  items?: TransactionItem[]
}

export interface CreateTransactionPayload {
  items: { product_id: number; quantity: number }[]
}

export interface DailyReport {
  date: string
  total_transactions: number
  total_revenue: number
  total_items_sold: number
  top_products: {
    product_id: number
    total_qty: number
    total: string
    product: { id: number; name: string }
  }[]
}
