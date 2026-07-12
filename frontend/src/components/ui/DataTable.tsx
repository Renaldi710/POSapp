import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import type { ReactElement } from 'react'

export interface Column<T> {
  key: string
  label: string
  render?: (item: T) => ReactElement
  flex?: number
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  onRowPress?: (item: T) => void
}

export default function DataTable<T>({ columns, data, keyExtractor, onRowPress }: DataTableProps<T>) {
  return (
    <View>
      <View className="flex-row bg-gray-100 border-b border-gray-200 px-3 py-2">
        {columns.map((col) => (
          <View key={col.key} style={{ flex: col.flex ?? 1 }}>
            <Text className="text-xs font-semibold text-gray-500 uppercase">{col.label}</Text>
          </View>
        ))}
      </View>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row items-center px-3 py-3 border-b border-gray-100"
            onPress={() => onRowPress?.(item)}
            disabled={!onRowPress}
          >
            {columns.map((col) => (
              <View key={col.key} style={{ flex: col.flex ?? 1 }}>
                {col.render ? col.render(item) : <Text className="text-sm text-gray-900">{String((item as any)[col.key] ?? '')}</Text>}
              </View>
            ))}
          </TouchableOpacity>
        )}
      />
    </View>
  )
}
