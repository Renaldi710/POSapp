import { TouchableOpacity, Text, ActivityIndicator } from 'react-native'

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: 'primary' | 'danger' | 'ghost' | 'outline'
  loading?: boolean
  disabled?: boolean
}

export default function Button({ title, onPress, variant = 'primary', loading, disabled }: ButtonProps) {
  const styles: Record<string, string> = {
    primary: 'bg-primary',
    danger: 'bg-red-600',
    ghost: 'bg-transparent',
    outline: 'border border-border bg-transparent',
  }

  const textStyles: Record<string, string> = {
    primary: 'text-white',
    danger: 'text-white',
    ghost: 'text-text-medium',
    outline: 'text-text-dark',
  }

  return (
    <TouchableOpacity
      className={`py-3 px-6 rounded-xl items-center ${styles[variant]} ${disabled ? 'opacity-50' : ''}`}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? <ActivityIndicator color="white" /> : <Text className={`font-semibold text-base ${textStyles[variant]}`}>{title}</Text>}
    </TouchableOpacity>
  )
}
