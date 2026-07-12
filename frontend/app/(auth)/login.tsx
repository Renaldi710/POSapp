import { useState } from 'react'
import { View, KeyboardAvoidingView, Platform } from 'react-native'
import Input from '../../src/components/ui/Input'
import Button from '../../src/components/ui/Button'
import { useLogin } from '../../src/features/auth/hooks/useAuth'
import { isEmail, isRequired } from '../../src/utils/validation'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const { mutate, isPending, error } = useLogin()

  const validate = () => {
    const e: typeof errors = {}
    if (!isRequired(email)) e.email = 'Email wajib diisi'
    else if (!isEmail(email)) e.email = 'Email tidak valid'
    if (!isRequired(password)) e.password = 'Password wajib diisi'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleLogin = () => {
    if (!validate()) return
    mutate({ email, password, device_name: 'mobile-app' })
  }

  const apiError = error?.response?.data?.message

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 justify-center bg-white px-6"
    >
      <View className="mb-8">
        <View className="mb-1">
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="admin@pos.app"
            keyboardType="email-address"
            error={errors.email}
          />
        </View>
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="password"
          secureTextEntry
          error={errors.password}
        />
        {apiError && (
          <View className="mb-4">
            <View className="text-red-500 text-sm">{apiError}</View>
          </View>
        )}
        <Button title="Login" onPress={handleLogin} loading={isPending} />
      </View>
    </KeyboardAvoidingView>
  )
}
