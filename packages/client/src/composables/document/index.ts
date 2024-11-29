import { onBeforeUnmount, ref, shallowRef } from 'vue'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { Awareness } from 'y-protocols/awareness'
import document from './document'

export { inspect, transact } from './utils'

export default function useDocument<
  T extends Record<string, any[] | Record<any, any>>,
  C extends Record<string, any>,
>(init: T, options?: { channel?: string; context?: C }) {
  const state = shallowRef<T>()
  const synced = ref(false)
  const error = ref<string | null>(null)

  const doc = new Y.Doc()

  let provider: WebsocketProvider | null = null
  let awareness: Awareness | null = null

  const session = ref<C[]>(options?.context ? [options.context] : [])

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
        synced.value = true
      }
    })

    provider.on('connection-error', () => {
      error.value = 'Could not connect to remote document.'
    })

    awareness.on('change', () => {
      session.value = Array.from(awareness!.getStates().values()) as C[]
    })

    if (options?.context) {
      for (const [key, value] of Object.entries(options.context)) {
        awareness.setLocalStateField(key, value)
      }
    }
  } else {
    state.value = document(init)
    synced.value = true
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
