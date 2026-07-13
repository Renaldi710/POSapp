import { ReactNode } from 'react'
import { View, useWindowDimensions } from 'react-native'
import TopHeader from './TopHeader'

interface ScreenLayoutProps {
  title: string
  children: ReactNode
  showSearch?: boolean
}

export default function ScreenLayout({ title, children, showSearch }: ScreenLayoutProps) {
  const { width } = useWindowDimensions()
  const isTablet = width >= 768

  return (
    <View className="flex-1">
      <TopHeader title={title} showSearch={showSearch} isTablet={isTablet} />
      <View className="flex-1">
        {children}
      </View>
    </View>
  )
}
