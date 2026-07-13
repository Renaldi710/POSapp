import { View } from 'react-native'

interface ProgressBarProps {
  value: number
  max: number
  color?: string
  height?: number
}

export default function ProgressBar({ value, max, color = '#22C55E', height = 8 }: ProgressBarProps) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0

  return (
    <View className="bg-gray-200 rounded-full overflow-hidden" style={{ height }}>
      <View style={{ width: `${pct}%`, height, backgroundColor: color, borderRadius: 9999 }} />
    </View>
  )
}
