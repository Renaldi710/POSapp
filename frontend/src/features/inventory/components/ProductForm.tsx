import { useState, useCallback } from 'react'
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, ScrollView, Image, Alert } from 'react-native'
import { Camera, Image as ImageIcon, Trash2 } from 'lucide-react-native'
import { router } from 'expo-router'
import { useCategories } from '../../categories/hooks/useCategories'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { pickFromCamera, pickFromGallery, uriToBase64 } from '../../../lib/image'
import type { Product } from '../../../api/types'

interface ProductFormProps {
  initial?: Product
  onSubmit: (data: { category_id: number; name: string; price: number; stock?: number; image_url?: string }) => void
  loading: boolean
  error: string | null
}

export default function ProductForm({ initial, onSubmit, loading, error }: ProductFormProps) {
  const [name, setName] = useState(initial?.name || '')
  const [price, setPrice] = useState(initial?.price ? String(initial.price) : '')
  const [stock, setStock] = useState(initial?.stock !== undefined ? String(initial.stock) : '')
  const [categoryId, setCategoryId] = useState<number>(initial?.category_id || 1)
  const [showCategoryPicker, setShowCategoryPicker] = useState(false)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(false)
  const { data: categories } = useCategories()

  const selectedCategory = categories?.find((c) => c.id === categoryId)

  const handlePickImage = useCallback(async (source: 'camera' | 'gallery') => {
    setImageLoading(true)
    try {
      const uri = source === 'camera' ? await pickFromCamera() : await pickFromGallery()
      if (uri) {
        const base64 = await uriToBase64(uri)
        setImageBase64(base64)
      }
    } catch {
      Alert.alert('Gagal', 'Tidak dapat mengakses kamera/galeri')
    } finally {
      setImageLoading(false)
    }
  }, [])

  const handleSubmit = useCallback(() => {
    if (!name.trim() || !price) return
    onSubmit({
      category_id: categoryId,
      name: name.trim(),
      price: Number(price),
      stock: stock ? Number(stock) : undefined,
      image_url: imageBase64 || initial?.image_url || undefined,
    })
  }, [name, price, stock, categoryId, imageBase64, initial, onSubmit])

  const previewUri = imageBase64 || initial?.image_url || null

  return (
    <ScrollView className="flex-1 bg-bg-page px-4 pt-4">
      <View className="mb-4">
        <Text className="text-sm font-medium text-text-dark mb-2">Foto Produk</Text>
        {previewUri ? (
          <View className="relative">
            <Image source={{ uri: previewUri }} className="w-full h-40 rounded-xl bg-bg-search" resizeMode="cover" />
            <TouchableOpacity
              className="absolute top-2 right-2 bg-white/80 rounded-full p-1.5"
              onPress={() => setImageBase64(null)}
            >
              <Trash2 size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 bg-bg-search border border-border rounded-xl py-8 items-center"
              onPress={() => handlePickImage('camera')}
              disabled={imageLoading}
            >
              <Camera size={28} color="#737686" />
              <Text className="text-xs text-text-light mt-2 font-medium">Ambil Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-bg-search border border-border rounded-xl py-8 items-center"
              onPress={() => handlePickImage('gallery')}
              disabled={imageLoading}
            >
              <ImageIcon size={28} color="#737686" />
              <Text className="text-xs text-text-light mt-2 font-medium">Pilih Galeri</Text>
            </TouchableOpacity>
          </View>
        )}
        {imageLoading && <Text className="text-xs text-text-light mt-1 text-center">Memproses gambar...</Text>}
      </View>

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
