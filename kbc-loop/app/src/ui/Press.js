// Knop zonder eigen opmaak, met lichte feedback bij aanraken.
import { Pressable } from 'react-native'

export function Press({ style, onPress, disabled, label, children, ...rest }) {
  const inactive = disabled || !onPress
  return (
    <Pressable role="button" aria-label={label} aria-disabled={inactive || undefined} disabled={inactive}
      onPress={onPress} style={({ pressed }) => [typeof style === 'function' ? style({ pressed }) : style, pressed && !inactive && { opacity: 0.7 }]}
      {...rest}>
      {children}
    </Pressable>
  )
}
