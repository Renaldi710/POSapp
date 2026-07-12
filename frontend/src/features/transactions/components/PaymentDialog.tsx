import { useState } from 'react'
import { Modal, View, Text, TextInput, TouchableOpacity, Switch } from 'react-native'
import { formatRupiah } from '../../../utils/currency'

interface PaymentDialogProps {
  visible: boolean
  totalAmount: number
  onConfirm: (data: { metode: string; uangDiterima: number; cetakStruk: boolean }) => void
  onCancel: () => void
  loading?: boolean
}

const METODE = [
  { key: 'tunai', label: 'Tunai' },
  { key: 'qris', label: 'QRIS' },
  { key: 'kartu', label: 'Kartu' },
] as const

export default function PaymentDialog({ visible, totalAmount, onConfirm, onCancel, loading }: PaymentDialogProps) {
  const [metode, setMetode] = useState('tunai')
  const [uangDiterima, setUangDiterima] = useState('')
  const [cetakStruk, setCetakStruk] = useState(true)

  const diterima = Number(uangDiterima) || 0
  const kembalian = diterima - totalAmount

  const canConfirm = metode !== 'tunai' || (diterima >= totalAmount && diterima > 0)

  const handleConfirm = () => {
    if (!canConfirm) return
    onConfirm({ metode, uangDiterima: metode === 'tunai' ? diterima : totalAmount, cetakStruk })
  }

  const handleClose = () => {
    setMetode('tunai')
    setUangDiterima('')
    setCetakStruk(true)
    onCancel()
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-2xl p-6">
          <Text className="text-lg font-bold text-center mb-1">Pembayaran</Text>
          <Text className="text-3xl font-bold text-center text-blue-600 mb-6">{formatRupiah(totalAmount)}</Text>

          <Text className="text-sm font-medium text-gray-700 mb-3">Metode Pembayaran</Text>
          <View className="flex-row gap-3 mb-6">
            {METODE.map((m) => (
              <TouchableOpacity
                key={m.key}
                className={`flex-1 py-3 rounded-lg border ${metode === m.key ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}
                onPress={() => setMetode(m.key)}
              >
                <Text className={`text-center font-medium ${metode === m.key ? 'text-white' : 'text-gray-700'}`}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {metode === 'tunai' && (
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-1">Uang Diterima</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-lg text-right"
                placeholder="0"
                keyboardType="numeric"
                value={uangDiterima}
                onChangeText={setUangDiterima}
              />
              {diterima > 0 && (
                <Text className={`text-right text-lg font-semibold mt-2 ${kembalian >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  Kembalian: {formatRupiah(Math.max(kembalian, 0))}
                </Text>
              )}
              {diterima > 0 && kembalian < 0 && (
                <Text className="text-red-500 text-sm text-right mt-1">Uang belum mencukupi</Text>
              )}
            </View>
          )}

          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-sm font-medium text-gray-700">Cetak Struk</Text>
            <Switch value={cetakStruk} onValueChange={setCetakStruk} />
          </View>

          <View className="flex-row gap-3">
            <TouchableOpacity className="flex-1 py-3 rounded-lg border border-gray-300" onPress={handleClose} disabled={loading}>
              <Text className="text-center text-gray-700 font-medium">Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 rounded-lg ${canConfirm ? 'bg-blue-600' : 'bg-gray-300'}`}
              onPress={handleConfirm}
              disabled={!canConfirm || loading}
            >
              <Text className="text-center text-white font-medium">{loading ? 'Memproses...' : 'Konfirmasi Pembayaran'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
