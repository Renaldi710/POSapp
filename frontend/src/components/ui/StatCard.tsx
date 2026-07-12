import { View, Text } from 'react-native'

interface StatCardProps {
  label: string
  value: string
  variant?: 'blue' | 'green' | 'yellow'
}

const BG: Record<string, string> = {
  blue: 'bg-blue-50 border-blue-200',
  green: 'bg-green-50 border-green-200',
  yellow: 'bg-yellow-50 border-yellow-200',
}

const TEXT: Record<string, string> = {
  blue: 'text-blue-800',
  green: 'text-green-800',
  yellow: 'text-yellow-800',
}

export default function StatCard({ label, value, variant = 'blue' }: StatCardProps) {
  return (
    <View className={`flex-1 rounded-xl border p-4 ${BG[variant]}`}>
      <Text className={`text-xs font-medium ${TEXT[variant]} opacity-80`}>{label}</Text>
      <Text className={`text-xl font-bold mt-1 ${TEXT[variant]}`}>{value}</Text>
    </View>
  )
}
