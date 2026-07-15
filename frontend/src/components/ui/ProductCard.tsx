import { View, Text, Image, TouchableOpacity } from 'react-native'
import { Package } from 'lucide-react-native'
import { formatRupiah } from '../../utils/currency'
import type { Product } from '../../api/types'

interface ProductCardProps {
  product: Product
  onAdd: (product: Product) => void
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <View className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
      <View className="h-24 bg-bg-search items-center justify-center overflow-hidden">
        {product.image_url ? (
          <Image source={{ uri: product.image_url }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <Package size={32} color="#737686" />
        )}
      </View>
      <View className="p-3">
        <Text className="text-sm font-semibold text-text-dark" numberOfLines={1}>{product.name}</Text>
        <Text className="text-base font-bold text-primary mt-0.5">{formatRupiah(product.price)}</Text>
        <TouchableOpacity className="bg-primary px-3 py-1.5 rounded-lg items-center mt-2" onPress={() => onAdd(product)}>
          <Text className="text-white text-xs font-semibold">Tambah</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
