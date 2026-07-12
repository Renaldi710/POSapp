// ponytail: react-native-thermal-receipt-printer requires EAS Build for actual
// Bluetooth pairing. In Expo Go this logs to console. Replace native call when
// building with EAS.
import { formatRupiah } from '../utils/currency'
import type { Transaction } from '../api/types'
import type { CartItem } from '../features/cart/types'

interface PrintData {
  transaction: Transaction
  items: CartItem[]
  metode: string
}

export async function printReceipt(data: PrintData) {
  const receipt = formatReceipt(data)
  console.log('[PRINT]', receipt)
}

function formatReceipt({ transaction, items, metode }: PrintData): string {
  const lines = [
    '================================',
    '       TOKO POS',
    '================================',
    '',
    `Tanggal: ${new Date().toLocaleString('id-ID')}`,
    `No.    : #${transaction.id}`,
    '',
    '--------------------------------',
  ]
  items.forEach((item) => {
    lines.push(`${item.name} x${item.quantity}`)
    lines.push(`         ${formatRupiah(item.subtotal)}`)
  })
  lines.push('--------------------------------')
  lines.push(`Total    : ${formatRupiah(items.reduce((s, i) => s + i.subtotal, 0))}`)
  lines.push(`Metode   : ${metode}`)
  lines.push('')
  lines.push('================================')
  lines.push('   Terima kasih telah berbelanja')
  lines.push('================================')
  return lines.join('\n')
}
