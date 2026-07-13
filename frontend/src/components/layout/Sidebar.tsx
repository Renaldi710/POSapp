import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter, usePathname } from 'expo-router'
import { useAuthStore } from '../../features/auth/store/useAuthStore'
import { Home, FileText, BarChart3, Package, Users, LogOut, ShoppingBag } from 'lucide-react-native'

const NAV_ITEMS = [
  { label: 'Home', icon: Home, route: '/(tabs)' },
  { label: 'Laporan', icon: FileText, route: '/(tabs)/laporan' },
  { label: 'Dashboard', icon: BarChart3, route: '/(tabs)/dashboard' },
  { label: 'Inventaris', icon: Package, route: '/(tabs)/inventaris' },
  { label: 'User', icon: Users, route: '/(tabs)/user-management' },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const handleLogout = async () => {
    await logout()
    router.replace('/(auth)/login')
  }

  const isActive = (route: string) => {
    if (route === '/(tabs)') return pathname === '/(tabs)' || pathname === '/'
    return pathname.startsWith(route)
  }

  return (
    <View className="w-[280px] bg-white border-r border-border">
      <View className="px-5 py-6 border-b border-border">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-xl bg-primary items-center justify-center">
            <ShoppingBag size={22} color="white" />
          </View>
          <View>
            <Text className="text-base font-bold text-text-dark">Kasir POS</Text>
            <Text className="text-xs text-text-light">
              {user?.role === 'admin' ? 'Admin' : 'Kasir'}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-1 px-3 pt-4">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.route)
          const Icon = item.icon
          return (
            <TouchableOpacity
              key={item.route}
              className={`flex-row items-center gap-3 px-4 py-3 rounded-xl mb-1 ${active ? 'bg-sidebar-active' : ''}`}
              onPress={() => router.push(item.route as any)}
            >
              <Icon size={20} color={active ? '#004AC6' : '#737686'} />
              <Text className={`text-sm font-medium ${active ? 'text-primary font-semibold' : 'text-text-medium'}`}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      <View className="px-3 pb-6 border-t border-border pt-4">
        <TouchableOpacity
          className="flex-row items-center gap-3 px-4 py-3 rounded-xl"
          onPress={handleLogout}
        >
          <LogOut size={20} color="#EF4444" />
          <Text className="text-sm font-medium text-red-500">Keluar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
