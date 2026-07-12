import { TextInput, View, Text } from 'react-native'

interface InputProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  label?: string
  error?: string
  secureTextEntry?: boolean
  keyboardType?: 'default' | 'numeric' | 'email-address'
}

export default function Input({ value, onChangeText, placeholder, label, error, secureTextEntry, keyboardType }: InputProps) {
  return (
    <View className="mb-4">
      {label && <Text className="text-sm font-medium text-gray-700 mb-1">{label}</Text>}
      <TextInput
        className={`border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 text-base`}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  )
}
