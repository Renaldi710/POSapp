import { View, Text } from 'react-native'

interface BadgeProps {
  label: string
  variant?: 'success' | 'warning' | 'danger' | 'default'
}

const VARIANTS: Record<string, string> = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  default: 'bg-gray-100 text-gray-700',
}

export default function Badge({ label, variant = 'default' }: BadgeProps) {
  return (
    <View className={`px-2.5 py-0.5 rounded-full self-start ${VARIANTS[variant].split(' ')[0]}`}>
      <Text className={`text-xs font-medium ${VARIANTS[variant].split(' ')[1]}`}>{label}</Text>
    </View>
  )
}
