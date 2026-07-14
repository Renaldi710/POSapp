import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import { formatRupiah } from '../utils/currency'
import type { Transaction } from '../api/types'
import type { CartItem } from '../features/cart/types'

interface InvoiceData {
  transaction: Transaction
  items: CartItem[]
  metode: string
  uangDiterima: number
  kembalian: number
}

export async function generateInvoicePdf(data: InvoiceData) {
  const html = buildHtml(data)
  const { uri } = await Print.printToFileAsync({ html })
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, { mimeType: 'application/pdf' })
  }
}

function buildHtml({ transaction, items, metode, uangDiterima, kembalian }: InvoiceData): string {
  const date = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  const rows = items.map((i) => `
    <tr>
      <td style="padding:6px 0;border-bottom:1px solid #e0e0e0;font-size:13px">${i.name} x${i.quantity}</td>
      <td style="padding:6px 0;border-bottom:1px solid #e0e0e0;font-size:13px;text-align:right">${formatRupiah(i.subtotal)}</td>
    </tr>
  `).join('')

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #191C1E; padding: 32px; }
    .header { text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #004AC6; }
    .header h1 { font-size: 22px; color: #004AC6; margin-bottom: 4px; }
    .header p { font-size: 12px; color: #737686; margin: 2px 0; }
    .info { display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 12px; color: #434655; }
    .info div { flex: 1; }
    .info .right { text-align: right; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    th { text-align: left; font-size: 11px; text-transform: uppercase; color: #737686; padding: 8px 0; border-bottom: 1px solid #C3C6D7; }
    th:last-child { text-align: right; }
    .summary { margin-bottom: 16px; }
    .summary-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; }
    .summary-row.total { font-size: 16px; font-weight: 700; color: #004AC6; border-top: 2px solid #004AC6; padding-top: 8px; margin-top: 4px; }
    .payment { background: #F7F9FB; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; font-size: 12px; color: #434655; }
    .payment div { display: flex; justify-content: space-between; padding: 2px 0; }
    .footer { text-align: center; font-size: 12px; color: #737686; border-top: 1px solid #C3C6D7; padding-top: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Kasir POS</h1>
    <p>Jl. Contoh No. 123, Kota</p>
    <p>Telp: 0812-3456-7890</p>
  </div>

  <div class="info">
    <div>
      <div><strong>Invoice #${transaction.id}</strong></div>
      <div>${date}</div>
    </div>
    <div class="right">
      <div>${time}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr><th>Item</th><th style="text-align:right">Subtotal</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="summary">
    <div class="summary-row"><span>Subtotal</span><span>${formatRupiah(items.reduce((s, i) => s + i.subtotal, 0))}</span></div>
    <div class="summary-row total"><span>Total</span><span>${formatRupiah(transaction.total_amount)}</span></div>
  </div>

  <div class="payment">
    <div><span>Metode Pembayaran</span><span>${metode}</span></div>
    ${metode === 'tunai' ? `<div><span>Uang Diterima</span><span>${formatRupiah(uangDiterima)}</span></div>
    <div><span>Kembalian</span><span>${formatRupiah(kembalian)}</span></div>` : ''}
  </div>

  <div class="footer">
    <p>Terima kasih telah berbelanja</p>
    <p style="margin-top:4px">Barang yang sudah dibeli tidak dapat dikembalikan</p>
  </div>
</body>
</html>`
}
