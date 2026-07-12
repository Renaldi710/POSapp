import { useQuery, keepPreviousData } from '@tanstack/react-query'
import client from '../../../api/client'
import { ENDPOINTS } from '../../../api/endpoints'
import type { Transaction, TransactionListResponse } from '../../../api/types'

export function useTransactionList(params?: { date_from?: string; date_to?: string; page?: number; per_page?: number }) {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => client.get<TransactionListResponse>(ENDPOINTS.TRANSACTIONS.LIST, { params }).then((r) => r.data),
    placeholderData: keepPreviousData,
  })
}

export function useTransaction(id: number) {
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: () => client.get<Transaction>(ENDPOINTS.TRANSACTIONS.DETAIL(id)).then((r) => r.data),
  })
}
