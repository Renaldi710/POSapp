import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import { useState } from 'react'
import { Search, Plus, Users, Clock, Shield, MoreHorizontal } from 'lucide-react-native'
import StatCard from '../../src/components/ui/StatCard'
import Badge from '../../src/components/ui/Badge'
import ScreenLayout from '../../src/components/layout/ScreenLayout'

const MOCK_USERS = [
  { id: 1, name: 'Admin POS', email: 'admin@pos.app', role: 'admin', lastLogin: 'Hari ini, 08:15', status: true },
  { id: 2, name: 'Kasir 1', email: 'kasir1@pos.app', role: 'kasir', lastLogin: 'Hari ini, 07:30', status: true },
  { id: 3, name: 'Kasir 2', email: 'kasir2@pos.app', role: 'kasir', lastLogin: 'Kemarin, 17:00', status: false },
  { id: 4, name: 'Kasir 3', email: 'kasir3@pos.app', role: 'kasir', lastLogin: '13 Jul 2026', status: true },
  { id: 5, name: 'Staff Gudang', email: 'gudang@pos.app', role: 'kasir', lastLogin: '12 Jul 2026', status: false },
]

export default function UserManagementScreen() {
  const [search, setSearch] = useState('')

  const filtered = MOCK_USERS.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <ScreenLayout title="User Management">
      <ScrollView className="flex-1 px-4 pt-4">
        <View className="flex-row items-center gap-2 mb-4">
          <View className="flex-1 flex-row items-center bg-bg-search rounded-full px-4">
            <Search size={18} color="#737686" />
            <TextInput
              className="flex-1 ml-2 py-2.5 text-base text-text-dark"
              placeholder="Cari pengguna..."
              placeholderTextColor="#737686"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity className="bg-primary px-4 py-2.5 rounded-xl flex-row items-center gap-1.5">
            <Plus size={18} color="white" />
            <Text className="text-white font-medium text-sm">Tambah Baru</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-3 mb-4">
          <StatCard label="Total Karyawan" value="24" icon={<Users size={18} color="#2563EB" />} />
          <StatCard label="Aktif Hari Ini" value="18" icon={<Clock size={18} color="#22C55E" />} />
        </View>
        <View className="flex-row gap-3 mb-4">
          <StatCard label="Izin Admin" value="3" icon={<Shield size={18} color="#8B5CF6" />} />
          <View className="flex-1" />
        </View>

        <View className="bg-white rounded-xl border border-border overflow-hidden mb-4">
          <View className="flex-row bg-bg-page px-3 py-2.5 border-b border-border">
            {['User', 'Role', 'Last Login', 'Status', ''].map((h) => (
              <View key={h} style={{ flex: h === 'User' ? 2 : h === '' ? 0.5 : 1 }}>
                <Text className="text-xs font-semibold text-text-medium uppercase tracking-wide">{h}</Text>
              </View>
            ))}
          </View>
          {filtered.map((user) => (
            <View key={user.id} className="flex-row items-center px-3 py-3 border-b border-border last:border-0">
              <View style={{ flex: 2 }} className="flex-row items-center gap-2.5">
                <View className={`w-8 h-8 rounded-full items-center justify-center ${user.role === 'admin' ? 'bg-purple-100' : 'bg-primary/10'}`}>
                  <Text className={`text-sm font-bold ${user.role === 'admin' ? 'text-purple-700' : 'text-primary'}`}>{user.name[0]}</Text>
                </View>
                <View>
                  <Text className="text-sm font-medium text-text-dark">{user.name}</Text>
                  <Text className="text-xs text-text-light">{user.email}</Text>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Badge label={user.role === 'admin' ? 'Admin' : 'Kasir'} variant={user.role === 'admin' ? 'warning' : 'default'} />
              </View>
              <View style={{ flex: 1 }}>
                <Text className="text-sm text-text-medium">{user.lastLogin}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  className={`px-3 py-1 rounded-full ${user.status ? 'bg-green-100' : 'bg-gray-100'}`}
                >
                  <Text className={`text-xs font-medium ${user.status ? 'text-green-700' : 'text-gray-500'}`}>
                    {user.status ? 'Aktif' : 'Nonaktif'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 0.5 }} className="items-center">
                <TouchableOpacity>
                  <MoreHorizontal size={18} color="#737686" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          {filtered.length === 0 && (
            <View className="py-8 items-center">
              <Text className="text-text-light text-sm">Pengguna tidak ditemukan</Text>
            </View>
          )}
        </View>

        <View className="flex-row items-center justify-center gap-2 mb-6">
          <TouchableOpacity className="w-8 h-8 rounded-lg bg-primary items-center justify-center">
            <Text className="text-white text-sm font-medium">1</Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-8 h-8 rounded-lg bg-white border border-border items-center justify-center">
            <Text className="text-text-medium text-sm">2</Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-8 h-8 rounded-lg bg-white border border-border items-center justify-center">
            <Text className="text-text-medium text-sm">3</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-3 mb-4">
          <View className="flex-1 bg-white rounded-xl border border-border p-4">
            <Shield size={20} color="#2563EB" />
            <Text className="text-sm font-semibold text-text-dark mt-2">2FA Security</Text>
            <Text className="text-xs text-text-light mt-1">Two-factor auth enabled for admin</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl border border-border p-4">
            <Shield size={20} color="#F59E0B" />
            <Text className="text-sm font-semibold text-text-dark mt-2">Password Policy</Text>
            <Text className="text-xs text-text-light mt-1">Min. 8 karakter, 1 huruf besar</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl border border-border p-4">
            <Shield size={20} color="#22C55E" />
            <Text className="text-sm font-semibold text-text-dark mt-2">Session</Text>
            <Text className="text-xs text-text-light mt-1">3 active sessions</Text>
          </View>
        </View>

        <View className="bg-white rounded-xl border border-border p-4 mb-6">
          <Text className="text-sm font-semibold text-text-dark mb-3">Activity Log</Text>
          {[
            { time: '10:32', desc: 'Admin POS menambahkan pengguna baru', type: 'info' },
            { time: '09:15', desc: 'Kasir 1 melakukan login', type: 'info' },
            { time: '08:45', desc: 'Admin POS mengubah role Kasir 2', type: 'warning' },
            { time: 'Kemarin', desc: 'Kasir 3 logout', type: 'info' },
          ].map((a, i) => (
            <View key={i} className="flex-row items-start py-2 border-b border-border last:border-0">
              <View className={`w-2 h-2 rounded-full mt-1.5 mr-3 ${a.type === 'warning' ? 'bg-amber-500' : 'bg-primary'}`} />
              <View className="flex-1">
                <Text className="text-sm text-text-dark">{a.desc}</Text>
                <Text className="text-xs text-text-light">{a.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenLayout>
  )
}
