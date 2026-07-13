import { useState } from 'react'
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native'
import { Mail, Lock, ShoppingBag, Clock } from 'lucide-react-native'
import { useLogin } from '../../src/features/auth/hooks/useAuth'
import Input from '../../src/components/ui/Input'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const { mutate, isPending, error } = useLogin()

  const validate = () => {
    const e: typeof errors = {}
    if (!email.trim()) e.email = 'Email wajib diisi'
    if (!password.trim()) e.password = 'Password wajib diisi'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleLogin = () => {
    if (!validate()) return
    mutate({ email: email.trim(), password })
  }

  const apiError = (error?.response?.data as { detail?: string })?.detail || error?.response?.data?.message

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-bg-page"
    >
      <ScrollView contentContainerClassName="flex-1 justify-center items-center px-4">
        <View className="w-full max-w-[480px] bg-white rounded-3xl shadow-lg p-8">
          <View className="items-center mb-8">
            <View className="w-16 h-16 bg-primary rounded-2xl items-center justify-center mb-4">
              <ShoppingBag size={32} color="white" />
            </View>
            <Text className="text-2xl font-bold text-text-dark">Kasir POS</Text>
            <Text className="text-sm text-text-light mt-1">Sistem Kasir UMKM VarcaTech</Text>
          </View>

          <Input
            label="Email"
            placeholder="Masukkan email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            icon={<Mail size={18} color="#737686" />}
            error={errors.email}
          />

          <Input
            label="Password"
            placeholder="Masukkan password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon={<Lock size={18} color="#737686" />}
            error={errors.password}
          />

          {apiError && (
            <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
              <Text className="text-red-600 text-sm text-center">{apiError}</Text>
            </View>
          )}

          <TouchableOpacity
            className="bg-primary py-3.5 rounded-xl items-center"
            onPress={handleLogin}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-base">Masuk ke Dashboard</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row items-center justify-center mt-6 bg-bg-input rounded-xl px-4 py-3">
            <Clock size={16} color="#737686" />
            <Text className="text-xs text-text-light ml-2">Terakhir masuk: Belum ada data</Text>
          </View>
        </View>

        <View className="flex-row items-center justify-center mt-6 gap-4">
          <Text className="text-xs text-text-light">© 2026 VarcaTech</Text>
          <Text className="text-xs text-text-light">|</Text>
          <Text className="text-xs text-primary">Bantuan</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
