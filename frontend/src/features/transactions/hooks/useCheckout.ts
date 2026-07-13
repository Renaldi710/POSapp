import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import client from '../../../api/client'
import { ENDPOINTS } from '../../../api/endpoints'
import { useCartStore } from '../../cart/store/useCartStore'
import { printReceipt } from '../../../lib/printer'
import type { Transaction, CreateTransactionPayload } from '../../../api/types'

function getCheckoutError(err: unknown): string | null {
  if (!isAxiosError(err)) return null
  const message = (err.response?.data as { message?: string })?.message
  if (err.response?.status === 422) return message || 'Stok tidak mencukupi atau produk tidak valid'
  return message || 'Gagal memproses pembayaran'
}

export function useCheckout() {
  const clearCart = useCartStore((s) => s.clearCart)
  const items = useCartStore((s) => s.items)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: { metode: string; uangDiterima: number; cetakStruk: boolean }) => {
      const payload: CreateTransactionPayload = {
        items: items.map((i) => ({ product_id: i.productId, quantity: i.quantity })),
        payment_method: data.metode,
      }
      return client.post<Transaction>(ENDPOINTS.TRANSACTIONS.CREATE, payload).then((r) => r.data)
    },
    onSuccess: async (transaction, { cetakStruk, metode }) => {
      // ponytail: print gagal → cart tetap utuh, user bisa retry
      if (cetakStruk) {
        try {
          await printReceipt({ transaction, items, metode })
        } catch {
          return
        }
      }
      clearCart()
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  return { ...mutation, errorMessage: getCheckoutError(mutation.error) }
}
