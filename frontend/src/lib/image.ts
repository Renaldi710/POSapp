import * as ImagePicker from 'expo-image-picker'
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator'
import { readAsStringAsync, EncodingType } from 'expo-file-system/legacy'

export async function pickFromCamera(): Promise<string | null> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync()
  if (status !== 'granted') return null

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    quality: 1,
  })
  if (result.canceled || !result.assets[0]) return null
  return compressImage(result.assets[0].uri)
}

export async function pickFromGallery(): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
  if (status !== 'granted') return null

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 1,
  })
  if (result.canceled || !result.assets[0]) return null
  return compressImage(result.assets[0].uri)
}

// ponytail: compress to max 800px + 0.5 quality → ~50-100KB
// upgrade: tunable quality/resolution if users complain about clarity
async function compressImage(uri: string): Promise<string> {
  const result = await manipulateAsync(uri, [{ resize: { width: 800 } }], {
    compress: 0.5,
    format: SaveFormat.JPEG,
  })
  return result.uri
}

export async function uriToBase64(uri: string): Promise<string> {
  const base64 = await readAsStringAsync(uri, {
    encoding: EncodingType.Base64,
  })
  return `data:image/jpeg;base64,${base64}`
}
