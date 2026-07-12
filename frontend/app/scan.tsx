import { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { router } from 'expo-router'
import client from '../src/api/client'
import { ENDPOINTS } from '../src/api/endpoints'
import { useCartStore } from '../src/features/cart/store/useCartStore'
import type { Product } from '../src/api/types'

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions()
  const [scanning, setScanning] = useState(true)
  const [error, setError] = useState('')
  const addItem = useCartStore((s) => s.addItem)

  if (!permission) return null
  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-lg mb-4 text-center">Izinkan akses kamera untuk scan barcode</Text>
        <TouchableOpacity className="bg-blue-600 px-6 py-3 rounded-lg" onPress={requestPermission}>
          <Text className="text-white font-semibold">Izinkan Kamera</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (!scanning) return
    setScanning(false)
    try {
      const res = await client.get<Product[]>(ENDPOINTS.PRODUCTS.LIST, { params: { search: data } })
      const product = res.data[0]
      if (product) {
        addItem(product.id, product.name, product.price)
        router.back()
      } else {
        setError(`Produk dengan kode "${data}" tidak ditemukan`)
        setScanning(true)
      }
    } catch {
      setError('Gagal mencari produk')
      setScanning(true)
    }
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        className="flex-1"
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'code39'] }}
        onBarcodeScanned={handleBarcodeScanned}
      >
        <View className="flex-1 justify-between p-6">
          <View className="items-center mt-12">
            <Text className="text-white text-lg font-semibold">Arahkan ke barcode produk</Text>
          </View>
          {error && (
            <View className="bg-red-500 px-4 py-3 rounded-lg mb-4">
              <Text className="text-white text-center">{error}</Text>
            </View>
          )}
          <TouchableOpacity
            className="bg-white px-6 py-3 rounded-lg items-center mb-12"
            onPress={() => router.back()}
          >
            <Text className="text-gray-900 font-semibold">Batal</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  )
}
