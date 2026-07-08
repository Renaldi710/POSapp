import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { COLORS, RADIUS, SPACING, FONT_SIZES, SHADOWS } from '../constants/theme'
import DashboardHeader from '../components/layout/DashboardHeader'
import DataTable from '../components/ui/DataTable'
import Badge from '../components/ui/Badge'
import SearchBar from '../components/ui/SearchBar'
import { productService } from '../services/products'
import { categoryService } from '../services/categories'

const InventoryScreen = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', category_id: '', price: '', cost: '', stock: '' })
  const [page, setPage] = useState(1)
  const perPage = 10

  const fetch = async () => {
    setLoading(true)
    try {
      const [p, c] = await Promise.all([productService.getAll(), categoryService.getAll()])
      setProducts(p)
      setCategories(c)
    } catch (e) {
      Alert.alert('Error', 'Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.barcode || '').includes(search)
  )
  const totalPages = Math.ceil(filtered.length / perPage)
  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.stock) {
      Alert.alert('Validasi', 'Lengkapi semua field')
      return
    }
    setLoading(true)
    try {
      const payload = {
        name: form.name,
        category_id: form.category_id ? Number(form.category_id) : null,
        price: Number(form.price),
        stock: Number(form.stock),
      }
      if (editing) {
        await productService.update(editing, payload)
      } else {
        await productService.create(payload)
      }
      setShowForm(false)
      setEditing(null)
      setForm({ name: '', category_id: '', price: '', cost: '', stock: '' })
      await fetch()
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Gagal menyimpan')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id) => {
    Alert.alert('Konfirmasi', 'Hapus barang ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus', style: 'destructive', onPress: async () => {
          try {
            await productService.delete(id)
            await fetch()
          } catch (e) {
            Alert.alert('Error', 'Gagal menghapus')
          }
        },
      },
    ])
  }

  const getStockBadge = (stock) => {
    if (stock <= 0) return <Badge type="habis" />
    if (stock <= 5) return <Badge type="menipis" />
    return <Badge type="aman" />
  }

  const stats = {
    total: products.length,
    habis: products.filter(p => p.stock <= 0).length,
    menipis: products.filter(p => p.stock > 0 && p.stock <= 5).length,
    terjual: products.reduce((s, p) => s + (p.sold_count || 0), 0),
  }

  const columns = [
    { label: 'SKU/Barcode', width: 130 },
    { label: 'Nama Barang', width: 180 },
    { label: 'Kategori', width: 120 },
    { label: 'Level Stok', width: 120 },
    { label: 'Harga Beli', width: 120, align: 'right' },
    { label: 'Harga Jual', width: 120, align: 'right' },
    { label: 'Aksi', width: 100, align: 'center' },
  ]

  return (
    <View style={styles.container}>
      <DashboardHeader title="Inventaris Stok" searchValue={search} onSearchChange={setSearch} userName="Admin Varca" />
      <View style={styles.content}>
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: COLORS.primaryLight }]}>
            <Text style={[styles.statNum, { color: COLORS.primary }]}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total SKU</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: COLORS.dangerLight }]}>
            <Text style={[styles.statNum, { color: COLORS.danger }]}>{stats.habis}</Text>
            <Text style={styles.statLabel}>Stok Habis</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: COLORS.warningLight }]}>
            <Text style={[styles.statNum, { color: COLORS.warning }]}>{stats.menipis}</Text>
            <Text style={styles.statLabel}>Stok Menipis</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: COLORS.successLight }]}>
            <Text style={[styles.statNum, { color: COLORS.success }]}>{stats.terjual}</Text>
            <Text style={styles.statLabel}>Barang Terjual</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => { setEditing(null); setForm({ name: '', category_id: '', price: '', cost: '', stock: '' }); setShowForm(true) }}>
            <MaterialCommunityIcons name="plus" size={20} color={COLORS.white} />
            <Text style={styles.addBtnText}>Tambah Barang Baru</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 40 }} size="large" color={COLORS.primary} />
        ) : (
          <DataTable
            columns={columns}
            data={paged}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            renderRow={(item) => (
              columns.map((col, ci) => {
                if (col.label === 'SKU/Barcode') return <Text key={ci} style={[styles.cell, { width: col.width }]}>{item.barcode || `SKU-${String(item.id).padStart(4, '0')}`}</Text>
                if (col.label === 'Nama Barang') return <Text key={ci} style={[styles.cell, { width: col.width, fontWeight: '600' }]}>{item.name}</Text>
                if (col.label === 'Kategori') return <Text key={ci} style={[styles.cell, { width: col.width }]}>{item.category?.name || '-'}</Text>
                if (col.label === 'Level Stok') return <View key={ci} style={[styles.cell, { width: col.width }]}>{getStockBadge(item.stock)}</View>
                if (col.label === 'Harga Beli') return <Text key={ci} style={[styles.cell, { width: col.width, textAlign: 'right' }]}>Rp{Number(item.cost || 0).toLocaleString('id-ID')}</Text>
                if (col.label === 'Harga Jual') return <Text key={ci} style={[styles.cell, { width: col.width, textAlign: 'right', fontWeight: '600', color: COLORS.primary }]}>Rp{Number(item.price).toLocaleString('id-ID')}</Text>
                if (col.label === 'Aksi') return (
                  <View key={ci} style={[styles.cell, { width: col.width, flexDirection: 'row', gap: 8, justifyContent: 'center' }]}>
                    <TouchableOpacity onPress={() => { setEditing(item.id); setForm({ name: item.name, category_id: item.category_id, price: item.price.toString(), cost: (item.cost || 0).toString(), stock: item.stock.toString() }); setShowForm(true) }}>
                      <MaterialCommunityIcons name="pencil" size={18} color={COLORS.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                      <MaterialCommunityIcons name="trash-can-outline" size={18} color={COLORS.danger} />
                    </TouchableOpacity>
                  </View>
                )
                return null
              })
            )}
          />
        )}
      </View>

      <Modal visible={showForm} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editing ? 'Edit Barang' : 'Tambah Barang Baru'}</Text>
            <TextInput style={styles.input} placeholder="Nama Barang" value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} />
            <View style={styles.categoryPicker}>
              <TouchableOpacity style={[styles.categoryOption, !form.category_id && styles.categoryOptionActive]}
                onPress={() => setForm({ ...form, category_id: '' })}>
                <Text style={[styles.categoryOptText, !form.category_id && styles.categoryOptTextActive]}>Tanpa Kat.</Text>
              </TouchableOpacity>
              {categories.map((c) => (
                <TouchableOpacity key={c.id} style={[styles.categoryOption, form.category_id == c.id && styles.categoryOptionActive]}
                  onPress={() => setForm({ ...form, category_id: c.id })}>
                  <Text style={[styles.categoryOptText, form.category_id == c.id && styles.categoryOptTextActive]}>{c.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput style={styles.input} placeholder="Harga Beli" value={form.cost} onChangeText={(t) => setForm({ ...form, cost: t })} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Harga Jual" value={form.price} onChangeText={(t) => setForm({ ...form, price: t })} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Stok" value={form.stock} onChangeText={(t) => setForm({ ...form, stock: t })} keyboardType="numeric" />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowForm(false)}>
                <Text style={styles.cancelBtnText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitBtnText}>{editing ? 'Update' : 'Simpan'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.xl },
  statsRow: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.xl, alignItems: 'center', flexWrap: 'wrap' },
  statBox: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderRadius: RADIUS.md, minWidth: 100 },
  statNum: { fontSize: FONT_SIZES.xl, fontWeight: '700' },
  statLabel: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, marginTop: 2 },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderRadius: RADIUS.md, gap: SPACING.sm, marginLeft: 'auto' },
  addBtnText: { color: COLORS.white, fontWeight: '600', fontSize: FONT_SIZES.sm },
  cell: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.md, fontSize: FONT_SIZES.sm, color: COLORS.textPrimary },
  modalOverlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: COLORS.cardBg, width: '90%', maxWidth: 480, borderRadius: RADIUS.xl, padding: SPACING.xxl },
  modalTitle: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.lg },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: SPACING.md, fontSize: FONT_SIZES.md, marginBottom: SPACING.md, color: COLORS.textPrimary },
  categoryPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.md },
  categoryOption: { paddingHorizontal: SPACING.md, paddingVertical: 6, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: COLORS.border },
  categoryOptionActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  categoryOptText: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary },
  categoryOptTextActive: { color: COLORS.primary, fontWeight: '600' },
  modalActions: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.md },
  cancelBtn: { flex: 1, paddingVertical: SPACING.md, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  cancelBtnText: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.textSecondary },
  submitBtn: { flex: 1, paddingVertical: SPACING.md, borderRadius: RADIUS.md, backgroundColor: COLORS.primary, alignItems: 'center' },
  submitBtnText: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.white },
})

export default InventoryScreen
