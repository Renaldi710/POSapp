import { useState, useCallback } from 'react'
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, ScrollView } from 'react-native'
import { router } from 'expo-router'
import { useCategories } from '../../categories/hooks/useCategories'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import type { Product } from '../../../api/types'

interface ProductFormProps {
  initial?: Product
  onSubmit: (data: { category_id: number; name: string; price: number; stock?: number }) => void
  loading: boolean
  error: string | null
}

export default function ProductForm({ initial, onSubmit, loading, error }: ProductFormProps) {
  const [name, setName] = useState(initial?.name || '')
  const [price, setPrice] = useState(initial?.price ? String(initial.price) : '')
  const [stock, setStock] = useState(initial?.stock !== undefined ? String(initial.stock) : '')
  const [categoryId, setCategoryId] = useState<number>(initial?.category_id || 1)
  const [showCategoryPicker, setShowCategoryPicker] = useState(false)
  const { data: categories } = useCategories()

  const selectedCategory = categories?.find((c) => c.id === categoryId)

  const handleSubmit = useCallback(() => {
    if (!name.trim() || !price) return
    onSubmit({
      category_id: categoryId,
      name: name.trim(),
      price: Number(price),
      stock: stock ? Number(stock) : undefined,
    })
  }, [name, price, stock, categoryId, onSubmit])

  return (
    <ScrollView className="flex-1 bg-bg-page px-4 pt-4">
      <Input
        label="Nama Produk"
        placeholder="Nama produk"
        value={name}
        onChangeText={setName}
      />

      <Text className="text-sm font-medium text-text-dark mb-1.5">Kategori</Text>
      <TouchableOpacity
        className="bg-bg-input border border-border rounded-xl px-4 py-3.5 mb-4"
        onPress={() => setShowCategoryPicker(true)}
      >
        <Text className={`text-base ${selectedCategory ? 'text-text-dark' : 'text-text-light'}`}>
          {selectedCategory?.name || 'Pilih kategori'}
        </Text>
      </TouchableOpacity>

      <Modal visible={showCategoryPicker} transparent animationType="slide" onRequestClose={() => setShowCategoryPicker(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-2xl max-h-96">
            <View className="p-4 border-b border-border">
              <Text className="text-lg font-bold text-text-dark text-center">Pilih Kategori</Text>
            </View>
            <FlatList
              data={categories || []}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`px-6 py-4 border-b border-border ${item.id === categoryId ? 'bg-blue-50' : ''}`}
                  onPress={() => {
                    setCategoryId(item.id)
                    setShowCategoryPicker(false)
                  }}
                >
                  <Text className={`text-base ${item.id === categoryId ? 'text-primary font-semibold' : 'text-text-dark'}`}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <Input
        label="Harga (Rp)"
        placeholder="0"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <Input
        label="Stok"
        placeholder="0"
        keyboardType="numeric"
        value={stock}
        onChangeText={setStock}
      />

      {error && (
        <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
          <Text className="text-red-700 text-sm">{error}</Text>
        </View>
      )}

      <Button title="Simpan" onPress={handleSubmit} loading={loading} disabled={!name.trim() || !price || loading} />

      <TouchableOpacity className="mt-4 py-3 items-center mb-6" onPress={() => router.back()} disabled={loading}>
        <Text className="text-text-light text-sm font-medium">Batal</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
