import React from 'react'
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { COLORS, RADIUS, SPACING, FONT_SIZES, SHADOWS } from '../../constants/theme'

const CartPanel = ({ cart, total, onUpdateQty, onRemove, onClear, onCheckout }) => {
  const subtotal = total
  const tax = total * 0.11
  const grandTotal = subtotal + tax

  return (
    <View style={[styles.container, SHADOWS.card]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Pesanan</Text>
          {cart.length > 0 && (
            <Text style={styles.orderId}>Order #ID-{88290 + Math.floor(Math.random() * 1000)}</Text>
          )}
        </View>
        {cart.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={onClear}>
            <MaterialCommunityIcons name="delete-sweep" size={18} color={COLORS.danger} />
            <Text style={styles.clearText}>Kosongkan</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.product.id.toString()}
        style={styles.list}
        contentContainerStyle={cart.length === 0 && styles.listEmpty}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>{item.product.name}</Text>
              <Text style={styles.itemPrice}>Rp{Number(item.product.price).toLocaleString('id-ID')}</Text>
            </View>
            <View style={styles.qtyControl}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => onUpdateQty(item.product.id, item.quantity - 1)}
              >
                <MaterialCommunityIcons name="minus" size={16} color={COLORS.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => onUpdateQty(item.product.id, item.quantity + 1)}
              >
                <MaterialCommunityIcons name="plus" size={16} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.itemSubtotal}>
              Rp{(item.product.price * item.quantity).toLocaleString('id-ID')}
            </Text>
            <TouchableOpacity onPress={() => onRemove(item.product.id)} style={styles.removeBtn}>
              <MaterialCommunityIcons name="trash-can-outline" size={16} color={COLORS.danger} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="cart-outline" size={36} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>Keranjang kosong</Text>
            <Text style={styles.emptySub}>Tambahkan produk dari katalog</Text>
          </View>
        }
      />

      {cart.length > 0 && (
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>Rp{subtotal.toLocaleString('id-ID')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Pajak (11%)</Text>
            <Text style={styles.summaryValue}>Rp{tax.toLocaleString('id-ID')}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>Rp{grandTotal.toLocaleString('id-ID')}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutBtn} onPress={onCheckout}>
            <Text style={styles.checkoutText}>Bayar Sekarang →</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 320,
    backgroundColor: COLORS.cardBg,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  orderId: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.danger,
    fontWeight: '500',
  },
  list: {
    flex: 1,
  },
  listEmpty: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemInfo: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  itemName: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  itemPrice: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    width: 28,
    textAlign: 'center',
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  itemSubtotal: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    minWidth: 80,
    textAlign: 'right',
    marginRight: SPACING.sm,
  },
  removeBtn: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  emptySub: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  summary: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  totalLabel: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  totalValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.primary,
  },
  checkoutBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  checkoutText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
})

export default CartPanel
