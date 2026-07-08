import React from 'react'
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { COLORS, RADIUS, SPACING, FONT_SIZES, SHADOWS } from '../constants/theme'

const ReceiptModal = ({ transaction, visible, onClose }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.modal, SHADOWS.card]}>
          <View style={styles.header}>
            <Text style={styles.title}>Struk Pembayaran</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.body}>
            <View style={styles.storeInfo}>
              <Text style={styles.storeName}>VarcaTech</Text>
              <Text style={styles.storeSub}>Kasir POS UMKM</Text>
            </View>
            <View style={styles.details}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>ID Transaksi</Text>
                <Text style={styles.detailValue}>#{transaction.id}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tanggal</Text>
                <Text style={styles.detailValue}>{new Date(transaction.created_at).toLocaleString('id-ID')}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Kasir</Text>
                <Text style={styles.detailValue}>{transaction.user?.name || '-'}</Text>
              </View>
            </View>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.th, { flex: 2 }]}>Item</Text>
                <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}>Qty</Text>
                <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Harga</Text>
                <Text style={[styles.th, { flex: 1.5, textAlign: 'right' }]}>Subtotal</Text>
              </View>
              {(transaction.items || []).map((item) => (
                <View key={item.id} style={styles.tableRow}>
                  <Text style={[styles.td, { flex: 2 }]}>{item.product?.name || 'Item'}</Text>
                  <Text style={[styles.td, { flex: 1, textAlign: 'center' }]}>{item.quantity}</Text>
                  <Text style={[styles.td, { flex: 1, textAlign: 'right' }]}>Rp{Number(item.price).toLocaleString('id-ID')}</Text>
                  <Text style={[styles.td, { flex: 1.5, textAlign: 'right', fontWeight: '600' }]}>Rp{Number(item.subtotal).toLocaleString('id-ID')}</Text>
                </View>
              ))}
            </View>
            <View style={styles.totalSection}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>Rp{Number(transaction.total_amount).toLocaleString('id-ID')}</Text>
              </View>
            </View>
          </ScrollView>
          <TouchableOpacity style={styles.printBtn}>
            <MaterialCommunityIcons name="printer" size={18} color={COLORS.white} />
            <Text style={styles.printBtnText}>Cetak Struk</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.xl,
    width: '90%',
    maxWidth: 480,
    maxHeight: '85%',
    padding: SPACING.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  body: {
    flexGrow: 0,
  },
  storeInfo: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.border,
    borderStyle: 'dashed',
  },
  storeName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  storeSub: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  details: {
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  table: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  th: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border + '80',
  },
  td: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
  },
  totalSection: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 2,
    borderTopColor: COLORS.textPrimary,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  totalValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  printBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  printBtnText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
})

export default ReceiptModal
