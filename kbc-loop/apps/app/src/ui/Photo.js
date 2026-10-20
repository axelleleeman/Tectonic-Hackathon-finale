// Toont een foto als die bestaat (zie photos.js); anders een illustratie in de categoriekleuren met het emoji-icoon.
import { Image, StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { T } from './T.js'
import { photos } from './photos.js'

export function Photo({ photoKey, tint, icon, iconSize = 54, style, children }) {
  const source = photoKey ? photos[photoKey] : null
  return (
    <View style={[styles.photo, style]}>
      <LinearGradient colors={tint} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <View style={[styles.bubble, styles.bubbleTop]} />
      <View style={[styles.bubble, styles.bubbleBottom]} />
      <T style={[styles.fallback, { fontSize: iconSize, lineHeight: iconSize * 1.2 }]} aria-hidden>{icon}</T>
      {source ? <Image source={source} style={StyleSheet.absoluteFill} resizeMode="cover" /> : null}
      {children ? (
        <LinearGradient colors={['rgba(0,30,60,0)', 'rgba(0,30,60,0.55)']} locations={[0.3, 1]} style={styles.overlay}>
          {children}
        </LinearGradient>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  photo: { overflow: 'hidden', position: 'relative' },
  bubble: { position: 'absolute', borderRadius: 999 },
  bubbleTop: { width: 90, height: 90, right: '8%', top: -20, backgroundColor: 'rgba(255,255,255,0.3)' },
  bubbleBottom: { width: 140, height: 140, left: -50, bottom: -70, backgroundColor: 'rgba(255,255,255,0.2)' },
  fallback: { position: 'absolute', right: 14, bottom: 6, textShadowColor: 'rgba(0,0,0,0.15)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 8 },
  overlay: { flex: 1, justifyContent: 'flex-end', paddingVertical: 14, paddingHorizontal: 16 },
})
