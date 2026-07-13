import { useState, useCallback } from 'react'
import { View, FlatList, TextInput, TouchableOpacity, Text, useWindowDimensions } from 'react-native'
import { Search, Scan, ShoppingCart } from 'lucide-react-native'
import { router } from 'expo-router'
import { useProducts } from '../../src/features/products/hooks/useProducts'
import { useCategories } from '../../src/features/categories/hooks/useCategories'
import { useCartStore } from '../../src/features/cart/store/useCartStore'
import ProductCard from '../../src/components/ui/ProductCard'
import CartPanel from '../../src/features/cart/components/CartPanel'
import PaymentDialog from '../../src/features/transactions/components/PaymentDialog'
import { useCheckout } from '../../src/features/transactions/hooks/useCheckout'
import ScreenLayout from '../../src/components/layout/ScreenLayout'
import type { Product } from '../../src/api/types'

const ALL_CATEGORY = { id: 0, name: 'Semua', products_count: 0 }

export default function KasirScreen() {
  const { width } = useWindowDimensions()
  const isTablet = width >= 768

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [showPayment, setShowPayment] = useState(false)
  const [showCartOverlay, setShowCartOverlay] = useState(false)

  const { data: products, isLoading } = useProducts(search)
  const { data: categories } = useCategories()
  const addItem = useCartStore((s) => s.addItem)
  const itemCount = useCartStore((s) => s.itemCount)
  const checkout = useCheckout()

  const allCategories = [ALL_CATEGORY, ...(categories || [])]
  const filteredProducts = selectedCategory === 0
    ? products
    : products?.filter((p) => p.category_id === selectedCategory)

  const handleAdd = useCallback(
    (product: Product) => addItem(product.id, product.name, product.price),
    [addItem],
  )

  const handleCheckout = useCallback(() => {
    if (isTablet) {
      setShowPayment(true)
    } else {
      setShowCartOverlay(false)
      setTimeout(() => setShowPayment(true), 300)
    }
  }, [isTablet])

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

  const productGrid = (
    <View className="flex-1">
      <View className="bg-white px-4 pt-3 pb-2 border-b border-border">
        <View className="flex-row items-center gap-2">
          <View className="flex-1 flex-row items-center bg-bg-search rounded-full px-4">
            <Search size={18} color="#737686" />
            <TextInput
              className="flex-1 ml-2 py-2.5 text-base text-text-dark"
              placeholder="Cari produk..."
              placeholderTextColor="#737686"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity
            className="bg-primary px-4 py-2.5 rounded-xl flex-row items-center gap-1.5"
            onPress={() => router.push('/scan')}
          >
            <Scan size={18} color="white" />
            <Text className="text-white font-medium text-sm">Scan</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-2.5 pb-1"
          data={allCategories}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TouchableOpacity
              className={`mr-2 px-4 py-1.5 rounded-full border ${selectedCategory === item.id ? 'bg-primary border-primary' : 'bg-white border-border'}`}
              onPress={() => setSelectedCategory(item.id)}
            >
              <Text className={`text-sm font-medium ${selectedCategory === item.id ? 'text-white' : 'text-text-medium'}`}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        className="flex-1 px-3"
        data={filteredProducts || []}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperClassName="gap-3"
        contentContainerClassName="py-3 gap-3"
        renderItem={({ item }) => (
          <View className="flex-1">
            <ProductCard product={item} onAdd={handleAdd} />
          </View>
        )}
        ListEmptyComponent={
          isLoading ? null : (
            <View className="flex-1 items-center justify-center pt-20">
              <Text className="text-text-light text-base">{search ? 'Produk tidak ditemukan' : 'Memuat produk...'}</Text>
            </View>
          )
        }
      />
    </View>
  )

  return (
    <ScreenLayout title="POS Kasir">
      <View className="flex-1 flex-row">
        {productGrid}
        {isTablet ? (
          <CartPanel isTablet onCheckout={handleCheckout} showOverlay={false} onCloseOverlay={() => {}} />
        ) : (
          <TouchableOpacity
            className="absolute bottom-6 right-4 bg-primary w-14 h-14 rounded-full items-center justify-center z-10 shadow-lg"
            onPress={() => setShowCartOverlay(true)}
          >
            <ShoppingCart size={24} color="white" />
            {itemCount() > 0 && (
              <View className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 items-center justify-center">
                <Text className="text-white text-xs font-bold">{itemCount()}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        {!isTablet && (
          <CartPanel
            isTablet={false}
            showOverlay={showCartOverlay}
            onCloseOverlay={() => setShowCartOverlay(false)}
            onCheckout={handleCheckout}
          />
        )}
      </View>

      <PaymentDialog
        visible={showPayment}
        totalAmount={useCartStore.getState().totalAmount()}
        onConfirm={handlePaymentConfirm}
        onCancel={handlePaymentCancel}
        loading={checkout.isPending}
        errorMessage={checkout.errorMessage}
      />
    </ScreenLayout>
  )
}
