// Notifications inbox: the shared notifications (unread first, quiet dates). Tapping one marks it read and
// opens its target screen; "Mark all as read" clears the badge on the bell.
import { StyleSheet, View } from 'react-native'
import { notificationsFor } from '@kbc-loop/shared/state/derive.js'
import { dateText, today } from '../item/format.js'
import { Press } from '../../ui/Press.js'
import { T } from '../../ui/T.js'
import { cardShadow, colors } from '../../theme.js'

const dateLabel = (iso) => {
  const d = String(iso).slice(0, 10)
  if (d === today) return 'Today'
  try { return dateText(d, { withYear: false }) } catch { return '' }
}

/** Notifications with a read flag, unread first (newest first within each group). */
export function inboxList(state) {
  if (!state) return []
  return notificationsFor(state).slice().sort((a, b) => (a.read - b.read) || String(b.date).localeCompare(String(a.date)))
}

export function InboxScreen({ state, actions }) {
  const list = inboxList(state)
  const unread = list.filter((n) => !n.read)

  const open = (n) => {
    if (!n.read) actions.markNotificationsRead?.([n.id])
    const { screen, active = {} } = n.target ?? {}
    actions.navigate(screen ?? 'home', active)
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <T style={styles.count}>{unread.length ? `${unread.length} unread` : 'All caught up'}</T>
        {unread.length ? (
          <Press onPress={() => actions.markNotificationsRead?.(unread.map((n) => n.id))} label="Mark all as read" style={styles.markAll}>
            <T style={styles.markAllText}>Mark all as read</T>
          </Press>
        ) : null}
      </View>
      {list.length ? (
        <View style={styles.card}>
          {list.map((n, i) => (
            <Press key={n.id} onPress={() => open(n)} label={`${n.read ? '' : 'Unread. '}${n.title}. ${n.body ?? ''}`}
              style={[styles.row, i > 0 && styles.rowLine]}>
              <View style={[styles.dot, !n.read && styles.dotOn]} />
              <View style={styles.text}>
                <T style={[styles.title, n.read && styles.titleRead]}>{n.title}</T>
                {n.body ? <T style={styles.body} numberOfLines={2}>{n.body}</T> : null}
              </View>
              <T style={styles.date}>{dateLabel(n.date)}</T>
            </Press>
          ))}
        </View>
      ) : <T style={styles.body}>No notifications yet.</T>}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  count: { fontSize: 13, color: colors.kmSub, fontWeight: '600' },
  markAll: { paddingVertical: 6, paddingHorizontal: 4 },
  markAllText: { fontSize: 14, color: colors.button, fontWeight: '600' },
  card: { backgroundColor: '#fff', borderRadius: 16, ...cardShadow },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 14, paddingHorizontal: 14 },
  rowLine: { borderTopWidth: 1, borderTopColor: colors.kmLine },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 7 },
  dotOn: { backgroundColor: colors.kmBlue },
  text: { flex: 1, minWidth: 0 },
  title: { fontSize: 15, fontWeight: '600' },
  titleRead: { fontWeight: '400', color: colors.kmSub },
  body: { fontSize: 13, color: colors.kmSub, marginTop: 2, lineHeight: 18 },
  date: { fontSize: 12, color: colors.kmGrey, marginTop: 2 },
})
