import { useEffect, useRef } from 'react'
import { View, TouchableWithoutFeedback, Animated, Dimensions } from 'react-native'
import { useSidebarStore } from '../../stores/useSidebarStore'
import Sidebar from './Sidebar'

export default function SidebarOverlay() {
  const { isOpen, close } = useSidebarStore()
  const translateX = useRef(new Animated.Value(-280)).current

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : -280,
      duration: 250,
      useNativeDriver: true,
    }).start()
  }, [isOpen, translateX])

  if (!isOpen) return null

  return (
    <View className="absolute inset-0 z-50 flex-row">
      <TouchableWithoutFeedback onPress={close}>
        <View className="flex-1 bg-black/40" />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[{ transform: [{ translateX }] }]}
        className="absolute left-0 top-0 bottom-0"
      >
        <Sidebar />
      </Animated.View>
    </View>
  )
}
