import { ref } from 'vue'
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
  const doc = new Y.Doc()
  const { clientID } = doc
  doc.clientID = 0
  const state = document(init, doc)
  doc.clientID = clientID

  doc.on('update', (update, origin, doc, transaction) => {
    console.log({ update, origin, doc, transaction })
  })

  const session = ref<Session>([])

  if (options?.channel) {
    const awareness = new Awareness(doc)
    const provider = new WebsocketProvider(
      'ws://localhost:1337',
      options.channel,
      doc,
      {
        awareness,
        params: { client: `${awareness.clientID}` },
      },
    )

    awareness.on('change', () => {
      session.value = Array.from(awareness.getStates().values()) as Session
    })

    if (options?.user) {
      awareness.setLocalStateField('user', options.user)
    }
  }

  return { state, doc, session }
}
