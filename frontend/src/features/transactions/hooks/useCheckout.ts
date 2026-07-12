import { useMutation, useQueryClient } from '@tanstack/react-query'
import client from '../../../api/client'
import { ENDPOINTS } from '../../../api/endpoints'
import { useCartStore } from '../../cart/store/useCartStore'
import { printReceipt } from '../../../lib/printer'
import type { Transaction, CreateTransactionPayload } from '../../../api/types'

export function useCheckout() {
  const clearCart = useCartStore((s) => s.clearCart)
  const items = useCartStore((s) => s.items)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { metode: string; uangDiterima: number; cetakStruk: boolean }) => {
      const payload: CreateTransactionPayload = {
        items: items.map((i) => ({ product_id: i.productId, quantity: i.quantity })),
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
}
