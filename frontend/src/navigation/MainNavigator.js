import React, { useState } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { COLORS } from '../constants/theme'
import AppLayout from '../components/layout/AppLayout'
import LoginScreen from '../screens/LoginScreen'
import DashboardScreen from '../screens/DashboardScreen'
import POSScreen from '../screens/POSScreen'
import ReportsScreen from '../screens/ReportsScreen'
import InventoryScreen from '../screens/InventoryScreen'
import UserManagementScreen from '../screens/UserManagementScreen'

const { width } = Dimensions.get('window')

const MainNavigator = ({ user, onLogin, onLogout }) => {
  const [activeRoute, setActiveRoute] = useState('Dashboard')

  if (!user) {
    return <LoginScreen onLogin={onLogin} />
  }

  const renderScreen = () => {
    switch (activeRoute) {
      case 'Dashboard':
        return <DashboardScreen />
      case 'POS':
        return <POSScreen />
      case 'Reports':
        return <ReportsScreen />
      case 'Inventory':
        return <InventoryScreen />
      case 'Users':
        return <UserManagementScreen />
      default:
        return <DashboardScreen />
    }
  }

  return (
    <AppLayout
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      onLogout={onLogout}
    >
      {renderScreen()}
    </AppLayout>
  )
}

export default MainNavigator
