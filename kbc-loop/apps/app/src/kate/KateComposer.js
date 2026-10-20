// Input at the bottom: a large rounded field with a light-blue border and a round blue button.
// Empty field: microphone (voice doesn't work in the demo yet); with text: a send arrow.
import { useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { Icon } from '../ui/Icon.js'
import { Press } from '../ui/Press.js'
import { colors } from '../theme.js'

export function KateComposer({ onSend, onVoice, disabled }) {
  const [text, setText] = useState('')
  const hasText = text.trim().length > 0

  const send = () => { if (onSend(text)) setText('') }

  return (
    <View style={styles.row}>
      <TextInput value={text} onChangeText={setText} placeholder="Type your question" placeholderTextColor={colors.kmGrey}
        aria-label="Question for Kate" style={styles.input} onSubmitEditing={send} submitBehavior="submit"
        returnKeyType="send" autoFocus multiline={false} editable={!disabled} />
      <Press style={styles.button} onPress={hasText ? send : onVoice} disabled={disabled}
        label={hasText ? 'Send question' : 'Ask by voice'}>
        <Icon name={hasText ? 'arrowUp' : 'mic'} size={24} color="#fff" strokeWidth={2.2} />
      </Press>
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  input: {
    flex: 1, minWidth: 0, height: 54, paddingHorizontal: 20, fontSize: 17, color: colors.kmNavy,
    borderWidth: 1.5, borderColor: '#bfe0f4', borderRadius: 27, backgroundColor: '#fff', outlineStyle: 'none',
  },
  button: { width: 54, height: 54, borderRadius: 27, backgroundColor: colors.kmBlue, alignItems: 'center', justifyContent: 'center' },
})
