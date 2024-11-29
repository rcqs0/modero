import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { ref, toRaw } from 'vue'

type User = { email: string; owner?: boolean }

type Session = { user: User; focus: any }[]

export default function useCollab(
  doc: Y.Doc,
  channel: string,
  options?: { user?: User },
) {
  const provider = new WebsocketProvider('ws://localhost:1337', channel, doc)

  provider.on('status', (event: { status: 'connected' | 'disconnected' }) => {
    if (event.status === 'connected') {
      console.log('[Collab][Connected]', channel)
    } else if (event.status === 'disconnected') {
      console.log('[Collab][Disconnected]', channel)
    }
  })

  const awareness = provider.awareness

  const session = ref<Session>([])

  awareness.on('change', () => {
    console.log(awareness.getStates())
    session.value = Array.from(awareness.getStates().values()) as Session
    console.log('[Collab][Session]', toRaw(session.value))
    console.log(awareness)
  })

  if (options?.user) {
    awareness.setLocalStateField('user', options.user)
    awareness.setLocalStateField('focus', null)
  }

  window.addEventListener('beforeunload', () => {
    provider.awareness.destroy()
  })

  return { provider, session }
}
