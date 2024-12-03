import { onBeforeUnmount, Ref, ref, watch } from 'vue'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { Awareness } from 'y-protocols/awareness'
import object from './object'
import { Entities } from './utils'

export default function useDocument<
  T extends Record<string, any[] | Record<any, any>>,
  C extends Record<string, any>,
>(init: T, options?: { channel?: string; session?: Ref<C> }) {
  const doc = new Y.Doc()
  const stateMap = doc.getMap('state')
  const entitiesMap = doc.getMap('entities')

  const state = object({} as T, stateMap, entitiesMap)
  const entities = object({} as Entities, entitiesMap, entitiesMap)

  const undoManager = new Y.UndoManager([stateMap, entitiesMap], {
    captureTimeout: 0,
  })

  const initialized = ref(false)
  const synced = ref(false)
  const error = ref<string | null>(null)

  function initialize() {
    doc.transact(() => {
      Object.assign(state, init)
    })

    undoManager.clear()
    initialized.value = true
  }

  function transact<T>(f: (transaction: Y.Transaction) => T): T {
    return doc.transact(f)
  }

  function undo() {
    undoManager.undo()
  }

  function redo() {
    undoManager.redo()
  }

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
        if (!Object.keys(state).length) {
          initialize()
        }
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
    initialize()
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

  return {
    doc,
    entities,
    state,
    transact,
    undo,
    redo,
    initialized,
    synced,
    provider,
    awareness,
    collaborators,
  }
}
