import { cacheDirectory, writeAsStringAsync, EncodingType } from 'expo-file-system/legacy'
import * as Sharing from 'expo-sharing'
import client from '../api/client'
import { ENDPOINTS } from '../api/endpoints'

interface ExportParams {
  date_from?: string
  date_to?: string
}

export async function downloadTransactionsCSV(params?: ExportParams) {
  const response = await client.get(ENDPOINTS.TRANSACTIONS.LIST, {
    params: { ...params, per_page: 10000 },
    responseType: 'text',
  })

  const transactions = response.data.data || []
  if (!transactions.length) return

  const headers = ['ID', 'Tanggal', 'Total', 'Metode', 'Status']
  const rows = transactions.map((t: any) => [
    t.id,
    t.created_at,
    t.total_amount,
    t.payment_method || '-',
    t.status,
  ])
  const csv = [headers.join(','), ...rows.map((r: any) => r.join(','))].join('\n')

  const uri = `${cacheDirectory}transactions_${Date.now()}.csv`
  await writeAsStringAsync(uri, csv, {
    encoding: EncodingType.UTF8,
  })

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, { mimeType: 'text/csv' })
  }
}
