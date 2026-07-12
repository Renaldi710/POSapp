import { TouchableOpacity, Text, ActivityIndicator } from 'react-native'

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: 'primary' | 'danger' | 'ghost'
  loading?: boolean
  disabled?: boolean
}

export default function Button({ title, onPress, variant = 'primary', loading, disabled }: ButtonProps) {
  const bg = variant === 'primary' ? 'bg-blue-600' : variant === 'danger' ? 'bg-red-600' : 'bg-transparent'
  return (
    <TouchableOpacity
      className={`py-3 px-6 rounded-lg ${bg} ${disabled ? 'opacity-50' : ''}`}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? <ActivityIndicator color="white" /> : <Text className="text-white text-center font-semibold">{title}</Text>}
    </TouchableOpacity>
  )
}
