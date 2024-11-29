import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { Awareness } from 'y-protocols/awareness'
import { onBeforeUnmount, ref, toRaw } from 'vue'

type User = { email: string; owner?: boolean }

type Session = { user: User; focus: any }[]

export default function useCollab(
  doc: Y.Doc,
  channel: string,
  options?: { user?: User },
) {
  const awareness = new Awareness(doc)
  const provider = new WebsocketProvider('ws://localhost:1337', channel, doc, {
    awareness,
    params: { client: `${awareness.clientID}` },
  })

  doc.on('update', (update, origin, doc, tr) => {
    console.log(update, origin, doc, tr)
  })

  provider.on('status', (event: { status: 'connected' | 'disconnected' }) => {
    if (event.status === 'connected') {
      console.log('[Collab][Connected]', channel)
    } else if (event.status === 'disconnected') {
      console.log('[Collab][Disconnected]', channel)
    }
  })

  provider.on('sync', (event: boolean) => {
    console.log('[Collab][Sync]', event)
  })

  const session = ref<Session>([])

  awareness.on('change', () => {
    session.value = Array.from(awareness.getStates().values()) as Session
  })

  if (options?.user) {
    awareness.setLocalStateField('user', options.user)
    awareness.setLocalStateField('focus', null)
  }

  // window.addEventListener('beforeunload', () => {
  //   provider.awareness.destroy()
  // })

  return { provider, awareness, session }
}
