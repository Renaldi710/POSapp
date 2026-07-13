import { View, Text, TouchableOpacity } from 'react-native'
import { Minus, Plus, Package } from 'lucide-react-native'
import { formatRupiah } from '../../utils/currency'

interface CartItemRowProps {
  name: string
  price: number
  quantity: number
  subtotal: number
  onIncrease: () => void
  onDecrease: () => void
}

export default function CartItemRow({ name, price, quantity, subtotal, onIncrease, onDecrease }: CartItemRowProps) {
  return (
    <View className="flex-row items-center py-3 border-b border-border">
      <View className="w-10 h-10 rounded-lg bg-bg-search items-center justify-center mr-3">
        <Package size={18} color="#737686" />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-medium text-text-dark" numberOfLines={1}>{name}</Text>
        <Text className="text-xs text-text-light">{formatRupiah(price)}</Text>
      </View>
      <View className="flex-row items-center gap-1.5">
        <TouchableOpacity className="w-7 h-7 rounded-full bg-gray-100 items-center justify-center" onPress={onDecrease}>
          <Minus size={14} color="#434655" />
        </TouchableOpacity>
        <Text className="text-sm font-semibold text-text-dark w-6 text-center">{quantity}</Text>
        <TouchableOpacity className="w-7 h-7 rounded-full bg-primary items-center justify-center" onPress={onIncrease}>
          <Plus size={14} color="white" />
        </TouchableOpacity>
      </View>
      <Text className="text-sm font-semibold text-text-dark w-20 text-right ml-2">{formatRupiah(subtotal)}</Text>
    </View>
  )
}
