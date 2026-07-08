import React from 'react'
import { AuthProvider, useAuth } from './src/context/AuthContext'
import { POSProvider } from './src/context/POSContext'
import MainNavigator from './src/navigation/MainNavigator'

const AppContent = () => {
  const { user, login, logout } = useAuth()

  return (
    <POSProvider>
      <MainNavigator user={user} onLogin={login} onLogout={logout} />
    </POSProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
