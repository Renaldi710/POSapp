import { useState } from 'react'
import { Modal, View, Text, TextInput, TouchableOpacity, Switch, ScrollView } from 'react-native'
import { X, Wallet, QrCode, CreditCard } from 'lucide-react-native'
import { formatRupiah } from '../../../utils/currency'

interface PaymentDialogProps {
  visible: boolean
  totalAmount: number
  onConfirm: (data: { metode: string; uangDiterima: number; cetakStruk: boolean; cetakInvoice: boolean }) => void
  onCancel: () => void
  loading?: boolean
  errorMessage?: string | null
}

const METODE = [
  { key: 'tunai', label: 'Tunai', icon: Wallet },
  { key: 'qris', label: 'QRIS', icon: QrCode },
  { key: 'debit_kredit', label: 'Kartu', icon: CreditCard },
] as const

const QUICK_AMOUNTS = [5000, 10000, 20000, 50000, 100000]

export default function PaymentDialog({ visible, totalAmount, onConfirm, onCancel, loading, errorMessage }: PaymentDialogProps) {
  const [metode, setMetode] = useState('tunai')
  const [uangDiterima, setUangDiterima] = useState('')
  const [cetakStruk, setCetakStruk] = useState(true)
  const [cetakInvoice, setCetakInvoice] = useState(true)

  const diterima = Number(uangDiterima) || 0
  const kembalian = diterima - totalAmount

  const canConfirm = metode !== 'tunai' || (diterima >= totalAmount && diterima > 0)

  const handleConfirm = () => {
    if (!canConfirm) return
    onConfirm({ metode, uangDiterima: metode === 'tunai' ? diterima : totalAmount, cetakStruk, cetakInvoice })
  }

  const handleClose = () => {
    setMetode('tunai')
    setUangDiterima('')
    setCetakStruk(true)
    setCetakInvoice(true)
    onCancel()
  }

  const totalTax = Math.round(totalAmount * 0.11)
  const subtotal = totalAmount - totalTax

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View className="flex-1 bg-black/50 justify-center px-4">
        <View className="bg-white rounded-3xl max-h-[90%] overflow-hidden">
          <ScrollView className="px-6 pt-5">
            <View className="flex-row items-center justify-between mb-5">
              <Text className="text-lg font-bold text-text-dark">Pembayaran</Text>
              <TouchableOpacity onPress={handleClose}>
                <X size={22} color="#434655" />
              </TouchableOpacity>
            </View>

            <View className="items-center mb-6">
              <Text className="text-xs text-text-light mb-1">Total Tagihan</Text>
              <Text className="text-3xl font-bold text-primary">{formatRupiah(totalAmount)}</Text>
              <View className="flex-row gap-4 mt-2">
                <Text className="text-xs text-text-light">Subtotal: {formatRupiah(subtotal)}</Text>
                <Text className="text-xs text-text-light">Pajak: {formatRupiah(totalTax)}</Text>
              </View>
            </View>

            <Text className="text-sm font-medium text-text-dark mb-3">Metode Pembayaran</Text>
            <View className="flex-row gap-3 mb-6">
              {METODE.map((m) => {
                const selected = metode === m.key
                const Icon = m.icon
                return (
                  <TouchableOpacity
                    key={m.key}
                    className={`flex-1 py-4 rounded-xl items-center border ${selected ? 'border-primary bg-blue-50' : 'border-border bg-white'}`}
                    onPress={() => setMetode(m.key)}
                  >
                    <View className={`w-10 h-10 rounded-full items-center justify-center mb-2 ${selected ? 'bg-primary' : 'bg-bg-search'}`}>
                      <Icon size={20} color={selected ? 'white' : '#737686'} />
                    </View>
                    <Text className={`text-sm font-medium ${selected ? 'text-primary' : 'text-text-medium'}`}>{m.label}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>

            {metode === 'tunai' && (
              <View className="mb-6">
                <Text className="text-sm font-medium text-text-dark mb-1.5">Uang Diterima</Text>
                <TextInput
                  className="border border-border rounded-xl px-4 py-3.5 text-lg text-right bg-bg-input text-text-dark"
                  placeholder="0"
                  placeholderTextColor="#737686"
                  keyboardType="numeric"
                  value={uangDiterima}
                  onChangeText={setUangDiterima}
                />

                <View className="flex-row flex-wrap gap-2 mt-3">
                  {QUICK_AMOUNTS.map((amount) => (
                    <TouchableOpacity
                      key={amount}
                      className="bg-bg-search px-4 py-2 rounded-full border border-border"
                      onPress={() => setUangDiterima(String(amount))}
                    >
                      <Text className="text-sm font-medium text-text-medium">{formatRupiah(amount)}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {diterima > 0 && (
                  <View className={`mt-3 p-3 rounded-xl ${kembalian >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                    <Text className={`text-right text-lg font-semibold ${kembalian >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                      {kembalian >= 0 ? 'Kembalian: ' : 'Kekurangan: '}
                      {formatRupiah(Math.abs(kembalian))}
                    </Text>
                  </View>
                )}
              </View>
            )}

            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-sm font-medium text-text-dark">Cetak Struk</Text>
              <Switch
                value={cetakStruk}
                onValueChange={setCetakStruk}
                trackColor={{ false: '#C3C6D7', true: '#2563EB' }}
                thumbColor="white"
              />
            </View>

            <View className="flex-row items-center justify-between mb-6">
              <View>
                <Text className="text-sm font-medium text-text-dark">Cetak Invoice</Text>
                <Text className="text-xs text-text-light">Format PDF</Text>
              </View>
              <Switch
                value={cetakInvoice}
                onValueChange={setCetakInvoice}
                trackColor={{ false: '#C3C6D7', true: '#2563EB' }}
                thumbColor="white"
              />
            </View>

            {errorMessage && (
              <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
                <Text className="text-red-700 text-sm text-center">{errorMessage}</Text>
              </View>
            )}
          </ScrollView>

          <View className="px-6 pb-5 pt-2 border-t border-border">
            <View className="flex-row gap-3">
              <TouchableOpacity className="flex-1 py-3.5 rounded-xl border border-border items-center" onPress={handleClose} disabled={loading}>
                <Text className="text-text-medium font-medium">Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-3.5 rounded-xl items-center ${canConfirm ? 'bg-primary' : 'bg-gray-300'}`}
                onPress={handleConfirm}
                disabled={!canConfirm || loading}
              >
                <Text className="text-white font-semibold">{loading ? 'Memproses...' : 'Konfirmasi Pembayaran'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}
