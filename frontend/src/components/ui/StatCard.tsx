import { View, Text } from 'react-native'
import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string
  icon?: ReactNode
  trend?: string
  trendUp?: boolean
  footnote?: string
}

export default function StatCard({ label, value, icon, trend, trendUp, footnote }: StatCardProps) {
  return (
    <View className="flex-1 bg-white rounded-xl border border-border p-4 shadow-sm">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-xs text-text-light font-medium">{label}</Text>
        {icon && <View>{icon}</View>}
      </View>
      <Text className="text-xl font-bold text-text-dark">{value}</Text>
      {trend && (
        <View className="flex-row items-center mt-1.5 gap-1.5">
          <View className={`px-1.5 py-0.5 rounded ${trendUp ? 'bg-green-100' : 'bg-red-100'}`}>
            <Text className={`text-xs font-medium ${trendUp ? 'text-green-700' : 'text-red-700'}`}>
              {trendUp ? '+' : ''}{trend}
            </Text>
          </View>
          {footnote && <Text className="text-xs text-text-light">{footnote}</Text>}
        </View>
      )}
      {footnote && !trend && (
        <Text className="text-xs text-text-light mt-1">{footnote}</Text>
      )}
    </View>
  )
}
