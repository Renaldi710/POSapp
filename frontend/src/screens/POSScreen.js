import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { COLORS } from '../constants/theme'
import DashboardHeader from '../components/layout/DashboardHeader'
import ProductGrid from '../components/pos/ProductGrid'
import CartPanel from '../components/pos/CartPanel'
import PaymentModal from '../components/pos/PaymentModal'
import { usePOS } from '../context/POSContext'
import { productService } from '../services/products'

const POSScreen = () => {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [showPayment, setShowPayment] = useState(false)
  const { cart, total, addToCart, updateQuantity, removeFromCart, clearCart, checkout } = usePOS()

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await productService.getAll()
        setProducts(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory = !categoryFilter || p.category?.name === categoryFilter
    return matchSearch && matchCategory
  })

  const handleCheckout = () => {
    if (cart.length === 0) return
    setShowPayment(true)
  }

  const handlePaymentConfirm = async (paymentInfo) => {
    try {
      await checkout()
      setShowPayment(false)
    } catch (e) {}
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <DashboardHeader title="POS" searchValue={search} onSearchChange={setSearch} userName="Admin Varca" />
      <View style={styles.body}>
        <ProductGrid
          products={filteredProducts}
          search={search}
          onSearchChange={setSearch}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          onAddToCart={addToCart}
        />
        <CartPanel
          cart={cart}
          total={total}
          onUpdateQty={updateQuantity}
          onRemove={removeFromCart}
          onClear={clearCart}
          onCheckout={handleCheckout}
        />
      </View>
      <PaymentModal
        visible={showPayment}
        onClose={() => setShowPayment(false)}
        total={total * 1.11}
        orderId={`ID-${88290 + Math.floor(Math.random() * 1000)}`}
        itemCount={cart.length}
        onConfirm={handlePaymentConfirm}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
  },
})

export default POSScreen
