import { View, Text } from 'react-native'

interface TimelineItem {
  time: string
  description: string
  type?: 'add' | 'sub' | 'info' | 'warning'
}

interface ActivityTimelineProps {
  items: TimelineItem[]
}

export default function ActivityTimeline({ items }: ActivityTimelineProps) {
  const dotColor = (type?: string) => {
    switch (type) {
      case 'add': return '#22C55E'
      case 'sub': return '#EF4444'
      case 'warning': return '#F59E0B'
      default: return '#2563EB'
    }
  }

  return (
    <View className="pl-4">
      {items.map((item, i) => (
        <View key={i} className="flex-row">
          <View className="items-center w-6">
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: dotColor(item.type) }} />
            {i < items.length - 1 && <View className="flex-1 w-px bg-border mt-1" />}
          </View>
          <View className="flex-1 pb-5 ml-3">
            <Text className="text-xs text-text-light">{item.time}</Text>
            <Text className="text-sm text-text-dark mt-0.5">{item.description}</Text>
          </View>
        </View>
      ))}
    </View>
  )
}
