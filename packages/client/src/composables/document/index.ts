import * as Y from 'yjs'
import document from './document'

export { inspect, transact } from './utils'

export default function useDocument<
  T extends Record<string, any[] | Record<any, any>>,
>(init: T) {
  const doc = new Y.Doc()
  const state = document(init, doc)

  return { state, doc }
}
