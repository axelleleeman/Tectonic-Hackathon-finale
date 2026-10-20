// Optional photo for a repair report. The photo stays on the device: only a local preview is kept in
// component state and the report just says "photo attached" (photo: true). Nothing is uploaded.
import { useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Press } from '../../../ui/Press.js'
import { T } from '../../../ui/T.js'
import { Glyph } from '../Glyph.js'
import { colors } from '../../../theme.js'

const pickerAvailable = typeof ImagePicker?.launchImageLibraryAsync === 'function'

export function PhotoField({ uri, onChange }) {
  const [error, setError] = useState(null)

  const pick = async () => {
    setError(null)
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.4, allowsEditing: false })
      if (!result.canceled && result.assets?.[0]?.uri) onChange(result.assets[0].uri)
    } catch {
      setError('The photo library could not be opened. You can send the report without a photo.')
    }
  }

  if (!pickerAvailable) {
    return (
      <View style={[styles.add, styles.addOff]} aria-disabled>
        <Glyph name="camera" size={22} color={colors.kmGrey} />
        <T style={[styles.addText, styles.offText]}>Add a photo (coming soon)</T>
      </View>
    )
  }

  if (uri) {
    return (
      <View style={styles.preview}>
        <Image source={{ uri }} style={styles.image} accessibilityLabel="Photo of the problem" />
        <View style={styles.previewText}>
          <T style={styles.previewTitle}>Photo added</T>
          <T style={styles.previewSub}>Stays on your phone until the technician visit.</T>
        </View>
        <Press onPress={() => onChange(null)} label="Remove photo" style={styles.remove} hitSlop={8}>
          <Glyph name="close" size={18} color={colors.kmSub} />
        </Press>
      </View>
    )
  }

  return (
    <>
      <Press onPress={pick} label="Add a photo of the problem from your photo library" style={styles.add}>
        <Glyph name="camera" size={22} color={colors.kmBlue} />
        <T style={styles.addText}>Add a photo</T>
        <T style={styles.optional}>optional</T>
      </Press>
      {error ? <T style={styles.error}>{error}</T> : null}
    </>
  )
}

const styles = StyleSheet.create({
  add: {
    flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, borderRadius: 14, borderWidth: 1.5, borderStyle: 'dashed',
    borderColor: '#a9d4ef', backgroundColor: '#f5fbff',
  },
  addOff: { borderColor: colors.kmLine, backgroundColor: '#f7f9fb' },
  addText: { flex: 1, fontWeight: '700', color: colors.kmBlue, fontSize: 15 },
  offText: { color: colors.kmGrey },
  optional: { fontSize: 12.5, color: colors.kmSub },
  preview: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.kmLine },
  image: { width: 64, height: 64, borderRadius: 10, backgroundColor: colors.kmSky },
  previewText: { flex: 1 },
  previewTitle: { fontWeight: '700', fontSize: 14.5 },
  previewSub: { fontSize: 12.5, color: colors.kmSub, marginTop: 2 },
  remove: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.kmSky },
  error: { color: colors.kmRed, fontSize: 13, marginTop: 8 },
})
