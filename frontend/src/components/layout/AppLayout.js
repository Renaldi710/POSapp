import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { COLORS } from '../../constants/theme'
import Sidebar from './Sidebar'

const { width } = Dimensions.get('window')
const isWide = width >= 1024

const AppLayout = ({ activeRoute, onNavigate, onLogout, children }) => {
  return (
    <View style={styles.container}>
      {isWide && (
        <Sidebar activeRoute={activeRoute} onNavigate={onNavigate} onLogout={onLogout} />
      )}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
})

export default AppLayout
