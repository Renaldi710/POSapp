import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { usePOS } from '../context/POSContext'
import { COLORS, RADIUS, SPACING, FONT_SIZES, SHADOWS } from '../constants/theme'

const ProductCard = ({ product }) => {
  const { addToCart } = usePOS()

  return (
    <View style={[styles.card, SHADOWS.card]}>
      <View style={styles.imagePlaceholder}>
        <MaterialCommunityIcons name="package-variant-closed" size={32} color={COLORS.textMuted} />
      </View>
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.category}>{product.category?.name || 'Umum'}</Text>
      <Text style={styles.price}>Rp{Number(product.price).toLocaleString('id-ID')}</Text>
      <TouchableOpacity
        style={[styles.button, product.stock <= 0 && styles.buttonDisabled]}
        onPress={() => addToCart(product)}
        disabled={product.stock <= 0}
      >
        <Text style={styles.buttonText}>{product.stock <= 0 ? 'Habis' : '+ Tambah'}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    margin: 6,
    flex: 1,
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  name: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  category: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  price: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.primary,
    marginVertical: SPACING.sm,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  buttonDisabled: {
    backgroundColor: COLORS.textMuted,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
})

export default ProductCard
