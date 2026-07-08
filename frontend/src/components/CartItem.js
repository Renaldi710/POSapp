import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { usePOS } from '../context/POSContext'
import { COLORS, RADIUS, SPACING, FONT_SIZES } from '../constants/theme'

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = usePOS()

  return (
    <View style={styles.row}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.product.name}</Text>
        <Text style={styles.price}>Rp{Number(item.product.price).toLocaleString('id-ID')}</Text>
      </View>
      <View style={styles.qtyControl}>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
        >
          <MaterialCommunityIcons name="minus" size={16} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.qty}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
        >
          <MaterialCommunityIcons name="plus" size={16} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
      <Text style={styles.subtotal}>
        Rp{(item.product.price * item.quantity).toLocaleString('id-ID')}
      </Text>
      <TouchableOpacity onPress={() => removeFromCart(item.product.id)} style={styles.deleteBtn}>
        <MaterialCommunityIcons name="trash-can-outline" size={16} color={COLORS.danger} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  price: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: {
    width: 28,
    textAlign: 'center',
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  subtotal: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    minWidth: 80,
    textAlign: 'right',
    marginRight: SPACING.sm,
  },
  deleteBtn: {
    padding: 4,
  },
})

export default CartItem
