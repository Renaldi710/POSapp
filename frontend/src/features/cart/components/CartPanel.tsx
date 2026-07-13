import { useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Modal, Animated, Dimensions } from 'react-native'
import { X, ShoppingCart } from 'lucide-react-native'
import { useCartStore } from '../store/useCartStore'
import CartItemRow from '../../../components/ui/CartItemRow'
import { formatRupiah } from '../../../utils/currency'

interface CartPanelProps {
  isTablet: boolean
  showOverlay: boolean
  onCloseOverlay: () => void
  onCheckout: () => void
}

export default function CartPanel({ isTablet, showOverlay, onCloseOverlay, onCheckout }: CartPanelProps) {
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const addItem = useCartStore((s) => s.addItem)
  const totalAmount = useCartStore((s) => s.totalAmount)
  const itemCount = useCartStore((s) => s.itemCount)

  const slideAnim = useRef(new Animated.Value(380)).current

  useEffect(() => {
    if (showOverlay) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start()
    }
  }, [showOverlay, slideAnim])

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: 380,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onCloseOverlay())
  }

  const subtotal = totalAmount()
  const tax = Math.round(subtotal * 0.11)
  const total = subtotal + tax

  const cartContent = (
    <View className="flex-1">
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-border">
        <View>
          <Text className="text-base font-semibold text-text-dark">Pesanan Baru</Text>
          <Text className="text-xs text-text-light">#{Math.random().toString(36).slice(2, 8).toUpperCase()}</Text>
        </View>
        {!isTablet && (
          <TouchableOpacity onPress={handleClose}>
            <X size={20} color="#434655" />
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <View className="flex-1 items-center justify-center px-4">
          <ShoppingCart size={40} color="#C3C6D7" />
          <Text className="text-sm text-text-light mt-3">Belum ada item</Text>
          <Text className="text-xs text-text-light mt-1">Tambahkan produk dari daftar</Text>
        </View>
      ) : (
        <>
          <ScrollView className="flex-1 px-4">
            {items.map((item) => (
              <CartItemRow
                key={item.productId}
                name={item.name}
                price={item.price}
                quantity={item.quantity}
                subtotal={item.subtotal}
                onIncrease={() => addItem(item.productId, item.name, item.price, 1)}
                onDecrease={() => {
                  if (item.quantity <= 1) removeItem(item.productId)
                  else updateQuantity(item.productId, item.quantity - 1)
                }}
              />
            ))}
          </ScrollView>

          <View className="border-t border-border px-4 py-3">
            <View className="flex-row justify-between mb-1.5">
              <Text className="text-sm text-text-medium">Subtotal</Text>
              <Text className="text-sm text-text-medium">{formatRupiah(subtotal)}</Text>
            </View>
            <View className="flex-row justify-between mb-1.5">
              <Text className="text-sm text-text-medium">Pajak (11%)</Text>
              <Text className="text-sm text-text-medium">{formatRupiah(tax)}</Text>
            </View>
            <View className="flex-row justify-between mb-3 pt-1.5 border-t border-border">
              <Text className="text-base font-bold text-text-dark">Total</Text>
              <Text className="text-base font-bold text-primary">{formatRupiah(total)}</Text>
            </View>

            <TouchableOpacity
              className={`py-3 rounded-xl items-center ${items.length > 0 ? 'bg-primary' : 'bg-gray-300'}`}
              onPress={onCheckout}
              disabled={items.length === 0}
            >
              <Text className="text-white font-semibold text-base">
                Bayar Sekarang ({itemCount()} item{itemCount() !== 1 ? 's' : ''})
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  )

  if (isTablet) {
    return (
      <View className="w-[380px] bg-white border-l border-border">
        {cartContent}
      </View>
    )
  }

  return (
    <Modal visible={showOverlay} transparent animationType="none" onRequestClose={handleClose}>
      <View className="flex-1 flex-row">
        <TouchableOpacity className="flex-1 bg-black/40" onPress={handleClose} activeOpacity={1} />
        <Animated.View
          style={[{ transform: [{ translateX: slideAnim }], width: 340 }]}
          className="bg-white"
        >
          {cartContent}
        </Animated.View>
      </View>
    </Modal>
  )
}
