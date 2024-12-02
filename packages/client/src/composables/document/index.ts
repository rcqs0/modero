import { onBeforeUnmount, Ref, ref, shallowRef, watch, reactive } from 'vue'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { Awareness } from 'y-protocols/awareness'
import document from './document'

export { inspect, transact } from './utils'

export default function useDocument<
  T extends Record<string, any[] | Record<any, any>>,
  C extends Record<string, any>,
>(init: T, options?: { channel?: string; session?: Ref<C> }) {
  const state = shallowRef<T>({} as T)
  const synced = ref(false)
  const initialized = ref(false)
  const error = ref<string | null>(null)

  const doc = new Y.Doc()

  let provider: WebsocketProvider | null = null
  let awareness: Awareness | null = null

  const collaborators = ref<C[]>([])

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
        initialized.value = true
      }
    })

    provider.on('connection-error', () => {
      error.value = 'Could not connect to remote document.'
    })

    awareness.on('change', () => {
      collaborators.value = Array.from(awareness!.getStates().values()) as C[]
    })
  } else {
    state.value = document(init)
    initialized.value = true
  }

  if (options?.session) {
    watch(
      options.session,
      (session) => {
        if (awareness && session) {
          for (const [key, value] of Object.entries(session)) {
            awareness!.setLocalStateField(key, value)
          }
        } else {
          collaborators.value = [session]
        }
      },
      { immediate: true, deep: true },
    )
  }

  onBeforeUnmount(() => {
    provider?.destroy()
    provider = null

    awareness?.destroy()
    awareness = null
  })

  return reactive({
    state,
    doc,
    initialized,
    synced,
    provider,
    awareness,
    collaborators,
  })
}
