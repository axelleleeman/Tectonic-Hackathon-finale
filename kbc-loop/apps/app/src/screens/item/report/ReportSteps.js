// The three steps of "Report a problem": choose the issue, describe it (optional text and photo), review.
import { Image, StyleSheet, TextInput, View } from 'react-native'
import { MAX_NOTE_LENGTH } from '@kbc-loop/shared/state/loopReducer.js'
import { T } from '../../../ui/T.js'
import { ActionButton, Card, ChoiceRow, SectionLabel, StepTitle, SummaryRow } from '../parts.js'
import { PhotoField } from './PhotoField.js'
import { technicianSlot } from '../format.js'
import { colors } from '../../../theme.js'

export function IssueStep({ product, partner, issues, issue, onIssue, onNext }) {
  return (
    <>
      <StepTitle title="What is wrong?" />
      <View role="radiogroup" aria-label="Problem">
        {issues.map((i) => <ChoiceRow key={i} title={i} selected={issue === i} onPress={() => onIssue(i)} />)}
      </View>
      <ActionButton onPress={onNext} disabled={!issue}>Continue</ActionButton>
    </>
  )
}

export function DetailsStep({ note, onNote, photo, onPhoto, onNext }) {
  return (
    <>
      <StepTitle title="Details" />
      <SectionLabel>Description (optional)</SectionLabel>
      <TextInput value={note} onChangeText={onNote} maxLength={MAX_NOTE_LENGTH} multiline
        placeholder="Since when, how often, error code…" placeholderTextColor={colors.kmGrey}
        style={styles.input} accessibilityLabel="Description of the problem (optional)" textAlignVertical="top" />
      <T style={styles.counter}>{note.length}/{MAX_NOTE_LENGTH}</T>
      <SectionLabel>Photo (optional)</SectionLabel>
      <PhotoField uri={photo} onChange={onPhoto} />
      <ActionButton onPress={onNext}>Continue</ActionButton>
    </>
  )
}

export function ReviewStep({ product, partner, issue, note, photo, onSubmit }) {
  const text = note.trim()
  return (
    <>
      <StepTitle title="Review" />
      <Card>
        <SummaryRow label="Product" value={product.name} />
        <SummaryRow label="Problem" value={issue} />
        <SummaryRow label="Description" value={text || 'None'} />
        <SummaryRow label="Photo" value={photo ? 'Attached' : 'None'} />
        <SummaryRow label="Earliest visit" value={technicianSlot} />
        <SummaryRow label="Cost" value="€ 0" strong last />
        {photo ? <Image source={{ uri: photo }} style={styles.thumb} accessibilityLabel="Attached photo" /> : null}
      </Card>
      <ActionButton onPress={onSubmit} label={`Send report about ${issue}`}>Send report</ActionButton>
    </>
  )
}

const styles = StyleSheet.create({
  input: {
    minHeight: 110, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1.5, borderColor: colors.kmLine, padding: 14,
    fontSize: 15, lineHeight: 21, color: colors.kmNavy,
  },
  counter: { alignSelf: 'flex-end', fontSize: 12, color: colors.kmGrey, marginTop: 6 },
  thumb: { width: '100%', height: 160, borderRadius: 12, marginTop: 12, backgroundColor: colors.kmSky },
})
