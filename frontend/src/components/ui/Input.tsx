import { View, TextInput, Text } from 'react-native'
import type { ReactNode } from 'react'

interface InputProps {
  value: string
  onChangeText: (v: string) => void
  placeholder?: string
  icon?: ReactNode
  secureTextEntry?: boolean
  keyboardType?: 'default' | 'numeric' | 'email-address'
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  error?: string
  label?: string
}

export default function Input({ value, onChangeText, placeholder, icon, secureTextEntry, keyboardType, autoCapitalize, error, label }: InputProps) {
  return (
    <View className="mb-4">
      {label && <Text className="text-sm font-medium text-text-dark mb-1.5">{label}</Text>}
      <View className="flex-row items-center bg-bg-input border border-border rounded-xl px-4">
        {icon && <View className="mr-3">{icon}</View>}
        <TextInput
          className="flex-1 py-3.5 text-base text-text-dark"
          placeholder={placeholder}
          placeholderTextColor="#737686"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
      </View>
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  )
}
