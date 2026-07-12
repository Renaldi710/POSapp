import { View, Text, TouchableOpacity } from 'react-native'
import { useCartStore } from '../store/useCartStore'
import { formatRupiah } from '../../../utils/currency'

interface CartBarProps {
  onCheckout: () => void
}

export default function CartBar({ onCheckout }: CartBarProps) {
  const { items, totalAmount, itemCount } = useCartStore()
  if (items.length === 0) return null

  return (
    <View className="flex-row items-center justify-between bg-blue-600 px-4 py-3 rounded-t-xl">
      <View>
        <Text className="text-white text-sm">{itemCount()} item{itemCount() > 1 ? 's' : ''}</Text>
        <Text className="text-white text-lg font-bold">{formatRupiah(totalAmount())}</Text>
      </View>
      <TouchableOpacity className="bg-white px-6 py-2 rounded-lg" onPress={onCheckout}>
        <Text className="text-blue-600 font-semibold">Bayar Sekarang</Text>
      </TouchableOpacity>
    </View>
  )
}
