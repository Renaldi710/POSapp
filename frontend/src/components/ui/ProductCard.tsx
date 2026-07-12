import { View, Text, TouchableOpacity } from 'react-native'
import { formatRupiah } from '../../utils/currency'
import Badge from './Badge'
import type { Product } from '../../api/types'

interface ProductCardProps {
  product: Product
  onAdd: (product: Product) => void
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <View className="bg-white rounded-xl p-3 border border-gray-100">
      <Text className="text-base font-semibold text-gray-900" numberOfLines={1}>
        {product.name}
      </Text>
      <Text className="text-lg font-bold text-blue-600 mt-1">{formatRupiah(product.price)}</Text>
      <View className="flex-row items-center justify-between mt-2">
        <Badge label={`Stok: ${product.stock}`} variant={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'danger'} />
        <TouchableOpacity className="bg-blue-600 px-3 py-1.5 rounded-lg" onPress={() => onAdd(product)}>
          <Text className="text-white text-sm font-medium">+</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
