import { create } from 'zustand'
import type { CartItem } from '../types'

interface CartState {
  items: CartItem[]
  addItem: (productId: number, name: string, price: number, qty?: number) => void
  updateQuantity: (productId: number, qty: number) => void
  removeItem: (productId: number) => void
  clearCart: () => void
  totalAmount: () => number
  itemCount: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (productId, name, price, qty = 1) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === productId)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: i.quantity + qty, subtotal: (i.quantity + qty) * price }
              : i,
          ),
        }
      }
      return { items: [...state.items, { productId, name, price, quantity: qty, subtotal: price * qty }] }
    }),
  updateQuantity: (productId, qty) =>
    set((state) => ({
      items:
        qty <= 0
          ? state.items.filter((i) => i.productId !== productId)
          : state.items.map((i) => (i.productId === productId ? { ...i, quantity: qty, subtotal: i.price * qty } : i)),
    })),
  removeItem: (productId) => set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
  clearCart: () => set({ items: [] }),
  totalAmount: () => get().items.reduce((sum, i) => sum + i.subtotal, 0),
  itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}))
