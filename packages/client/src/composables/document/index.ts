import { onBeforeUnmount, ref, shallowRef } from 'vue'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { Awareness } from 'y-protocols/awareness'
import document from './document'

export { inspect, transact } from './utils'

type User = { email: string; owner?: boolean }
type Session = { user: User; focus: any }[]

export default function useDocument<
  T extends Record<string, any[] | Record<any, any>>,
>(init: T, options?: { channel?: string; user?: User }) {
  const state = shallowRef<T>()
  const doc = new Y.Doc()

  let provider: WebsocketProvider | null = null
  let awareness: Awareness | null = null
  const session = ref<Session>([])

  if (options?.channel) {
    awareness = new Awareness(doc)
    provider = new WebsocketProvider(
      'ws://localhost:1337',
      options.channel,
      doc,
      {
        awareness,
        params: { client: `${awareness.clientID}` },
      },
    )

    provider.on('sync', (event: boolean) => {
      if (event) {
        state.value = document(init, doc)
      }
    })

    awareness.on('change', () => {
      session.value = Array.from(awareness!.getStates().values()) as Session
    })

    if (options?.user) {
      awareness.setLocalStateField('user', options.user)
    }
  } else {
    state.value = document(init)
  }

  onBeforeUnmount(() => {
    if (provider) {
      provider.destroy()
      awareness?.destroy()

      provider = null
      awareness = null
    }
  })

  return { state, doc, provider, awareness, session }
}
