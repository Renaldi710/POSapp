import { View, Text } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams()
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold">Transaction {id}</Text>
    </View>
  )
}
