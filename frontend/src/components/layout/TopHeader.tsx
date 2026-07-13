import { View, Text, TouchableOpacity } from 'react-native'
import { Menu, Search, Bell } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import { useAuthStore } from '../../features/auth/store/useAuthStore'
import { useSidebarStore } from '../../stores/useSidebarStore'

interface TopHeaderProps {
  title: string
  showSearch?: boolean
  isTablet: boolean
}

export default function TopHeader({ title, showSearch, isTablet }: TopHeaderProps) {
  const user = useAuthStore((s) => s.user)
  const sidebar = useSidebarStore()
  const router = useRouter()

  return (
    <View className="bg-white border-b border-border px-4 py-3 flex-row items-center">
      {!isTablet && (
        <TouchableOpacity onPress={sidebar.toggle} className="mr-3">
          <Menu size={24} color="#191C1E" />
        </TouchableOpacity>
      )}
      <Text className="flex-1 text-lg font-semibold text-text-dark">{title}</Text>
      {isTablet && showSearch && (
        <TouchableOpacity className="mr-3">
          <Search size={20} color="#737686" />
        </TouchableOpacity>
      )}
      <TouchableOpacity className="mr-2">
        <Bell size={20} color="#737686" />
      </TouchableOpacity>
      <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
        <Text className="text-white text-sm font-bold">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </Text>
      </View>
    </View>
  )
}
