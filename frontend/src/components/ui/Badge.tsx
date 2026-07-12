import { View, Text } from 'react-native'

interface BadgeProps {
  label: string
  variant?: 'success' | 'warning' | 'danger' | 'default'
}

export default function Badge({ label, variant = 'default' }: BadgeProps) {
  const bg = variant === 'success' ? 'bg-green-100' : variant === 'warning' ? 'bg-yellow-100' : variant === 'danger' ? 'bg-red-100' : 'bg-gray-100'
  const tc = variant === 'success' ? 'text-green-800' : variant === 'warning' ? 'text-yellow-800' : variant === 'danger' ? 'text-red-800' : 'text-gray-800'
  return (
    <View className={`px-2 py-1 rounded-full self-start ${bg}`}>
      <Text className={`text-xs font-medium ${tc}`}>{label}</Text>
    </View>
  )
}
