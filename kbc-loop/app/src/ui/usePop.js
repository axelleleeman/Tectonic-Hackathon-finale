// Kleine "pop"-animatie (schaal + vervagen) bij het verschijnen, zoals @keyframes pop op het web.
import { useEffect, useRef } from 'react'
import { Animated, Platform } from 'react-native'

export function usePop(duration = 400) {
  const v = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration, useNativeDriver: Platform.OS !== 'web' }).start()
  }, [v, duration])
  return { opacity: v, transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) }] }
}
