import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Switch, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { COLORS, RADIUS, SPACING, FONT_SIZES, SHADOWS } from '../../constants/theme'

const denominations = [5000, 10000, 20000, 50000, 100000]

const PaymentModal = ({ visible, onClose, total, orderId, itemCount, onConfirm }) => {
  const [method, setMethod] = useState('tunai')
  const [cashAmount, setCashAmount] = useState('')
  const [printReceipt, setPrintReceipt] = useState(true)

  const cash = parseInt(cashAmount.replace(/\D/g, '')) || 0
  const change = cash - total

  const handleDenom = (amount) => {
    const current = parseInt(cashAmount.replace(/\D/g, '')) || 0
    setCashAmount((current + amount).toString())
  }

  const handleConfirm = () => {
    onConfirm({
      method,
      cashAmount: method === 'tunai' ? cash : total,
      change: method === 'tunai' ? Math.max(0, change) : 0,
      printReceipt,
    })
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Metode Pembayaran</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <View style={styles.billInfo}>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Total Tagihan</Text>
                <Text style={styles.billValue}>Rp{total.toLocaleString('id-ID')}</Text>
              </View>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Order</Text>
                <Text style={styles.billSub}>{orderId}</Text>
              </View>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Jumlah Item</Text>
                <Text style={styles.billSub}>{itemCount} item</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Pilih Metode</Text>
            <View style={styles.methodRow}>
              {[
                { key: 'tunai', icon: 'cash', label: 'Tunai' },
                { key: 'qris', icon: 'qrcode', label: 'QRIS' },
                { key: 'kartu', icon: 'credit-card', label: 'Kartu' },
              ].map((m) => (
                <TouchableOpacity
                  key={m.key}
                  style={[styles.methodCard, method === m.key && styles.methodCardActive]}
                  onPress={() => setMethod(m.key)}
                >
                  <MaterialCommunityIcons
                    name={m.icon}
                    size={28}
                    color={method === m.key ? COLORS.primary : COLORS.textSecondary}
                  />
                  <Text style={[styles.methodLabel, method === m.key && styles.methodLabelActive]}>
                    {m.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {method === 'tunai' && (
              <>
                <Text style={styles.sectionTitle}>Uang Tunai</Text>
                <View style={styles.denomGrid}>
                  {denominations.map((d) => (
                    <TouchableOpacity key={d} style={styles.denomBtn} onPress={() => handleDenom(d)}>
                      <Text style={styles.denomText}>Rp{d.toLocaleString('id-ID')}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TextInput
                  style={styles.cashInput}
                  placeholder="Masukkan jumlah uang"
                  placeholderTextColor={COLORS.textMuted}
                  value={cashAmount}
                  onChangeText={setCashAmount}
                  keyboardType="numeric"
                />
                {cash >= total && (
                  <View style={styles.changeBox}>
                    <MaterialCommunityIcons name="swap-horizontal-bold" size={20} color={COLORS.success} />
                    <Text style={styles.changeLabel}>Kembalian</Text>
                    <Text style={styles.changeValue}>Rp{change.toLocaleString('id-ID')}</Text>
                  </View>
                )}
              </>
            )}

            {method === 'qris' && (
              <View style={styles.qrisPlaceholder}>
                <MaterialCommunityIcons name="qrcode" size={80} color={COLORS.textPrimary} />
                <Text style={styles.qrisText}>Scan QRIS untuk membayar</Text>
              </View>
            )}

            {method === 'kartu' && (
              <View style={styles.cardPlaceholder}>
                <MaterialCommunityIcons name="credit-card" size={80} color={COLORS.textPrimary} />
                <Text style={styles.qrisText}>Siapkan kartu untuk pembayaran</Text>
              </View>
            )}

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Cetak Struk Fisik</Text>
              <Switch
                value={printReceipt}
                onValueChange={setPrintReceipt}
                trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
                thumbColor={printReceipt ? COLORS.primary : COLORS.textMuted}
              />
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[styles.confirmBtn, method === 'tunai' && cash < total && styles.confirmBtnDisabled]}
            disabled={method === 'tunai' && cash < total}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmText}>Konfirmasi Pembayaran</Text>
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
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: COLORS.cardBg,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: '90%',
    padding: SPACING.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  billInfo: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  billLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  billValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  billSub: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  methodRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  methodCard: {
    flex: 1,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  methodCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  methodLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  methodLabelActive: {
    color: COLORS.primary,
  },
  denomGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  denomBtn: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  denomText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  cashInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.lg,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  changeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.successLight,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  changeLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.success,
  },
  changeValue: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.success,
  },
  qrisPlaceholder: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
    marginBottom: SPACING.xl,
  },
  qrisText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  cardPlaceholder: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
    marginBottom: SPACING.xl,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    marginBottom: SPACING.lg,
  },
  toggleLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  confirmBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  confirmBtnDisabled: {
    backgroundColor: COLORS.textMuted,
  },
  confirmText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
})

export default PaymentModal
