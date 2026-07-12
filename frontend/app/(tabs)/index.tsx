import { useState, useCallback } from 'react'
import { View, FlatList, TextInput, TouchableOpacity, Text } from 'react-native'
import { router } from 'expo-router'
import { useProducts } from '../../src/features/products/hooks/useProducts'
import { useCartStore } from '../../src/features/cart/store/useCartStore'
import ProductCard from '../../src/components/ui/ProductCard'
import CartBar from '../../src/features/cart/components/CartBar'
import PaymentDialog from '../../src/features/transactions/components/PaymentDialog'
import { useCheckout } from '../../src/features/transactions/hooks/useCheckout'
import type { Product } from '../../src/api/types'

export default function KasirScreen() {
  const [search, setSearch] = useState('')
  const [showPayment, setShowPayment] = useState(false)
  const { data: products, isLoading } = useProducts(search)
  const addItem = useCartStore((s) => s.addItem)
  const checkout = useCheckout()

  const handleAdd = useCallback(
    (product: Product) => addItem(product.id, product.name, product.price),
    [addItem],
  )

  const handleCheckout = useCallback(() => {
    setShowPayment(true)
  }, [])

  const handlePaymentConfirm = useCallback(
    (data: { metode: string; uangDiterima: number; cetakStruk: boolean }) => {
      checkout.mutate(data, {
        onSuccess: () => setShowPayment(false),
      })
    },
    [checkout],
  )

  const handlePaymentCancel = useCallback(() => {
    setShowPayment(false)
  }, [])

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row items-center px-4 pt-4 pb-2 gap-2">
        <View className="flex-1">
          <TextInput
            className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-base"
            placeholder="Cari produk..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity
          className="bg-blue-600 px-4 py-2.5 rounded-lg flex-row items-center"
          onPress={() => router.push('/scan')}
        >
          <Text className="text-white font-medium text-sm">Scan</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        className="flex-1 px-4"
        data={products || []}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperClassName="gap-3"
        contentContainerClassName="pb-4 gap-3"
        renderItem={({ item }) => (
          <View className="flex-1">
            <ProductCard product={item} onAdd={handleAdd} />
          </View>
        )}
        ListEmptyComponent={
          isLoading ? null : (
            <View className="flex-1 items-center justify-center pt-20">
              <Text className="text-gray-400 text-base">{search ? 'Produk tidak ditemukan' : 'Memuat produk...'}</Text>
            </View>
          )
        }
      />

      <CartBar onCheckout={handleCheckout} />

      <PaymentDialog
        visible={showPayment}
        totalAmount={useCartStore.getState().totalAmount()}
        onConfirm={handlePaymentConfirm}
        onCancel={handlePaymentCancel}
        loading={checkout.isPending}
        errorMessage={checkout.errorMessage}
      />
    </View>
  )
}
