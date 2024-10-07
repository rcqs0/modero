import * as Y from 'yjs'
import object from './object'
import array from './array'
import { YOBJECT_KEY } from './utils'
import { reactive, Reactive } from 'vue'

export { YOBJECT_KEY, transact } from './utils'

export default function useDocument<
  T extends Record<string, any[] | Record<any, any>>,
>(init: T, doc = new Y.Doc()): Reactive<T> {
  for (const [key, value] of Object.entries(init)) {
    if (Array.isArray(value)) {
      array(value, doc.getArray(key))
    } else {
      object(value, doc.getMap(key))
    }
  }

  const proxy = new Proxy({} as T, {
    get(target, prop) {
      if (prop === YOBJECT_KEY) {
        return doc
      }

      if (typeof prop === 'symbol') {
        return Reflect.get(target, prop)
      }

      if (typeof prop !== 'string' || !doc.share.has(prop))
        return Reflect.get(target, prop)

      const value = doc.get(prop)

      if (value instanceof Y.Array) {
        return array([], value)
      }

      return object({}, value as Y.Map<any>)
    },
    set(target, prop, value) {
      if (typeof prop === 'symbol') {
        return Reflect.set(target, prop, value)
      }

      throw new Error("Can't add new root level objects after initialization.")
    },
    deleteProperty(_target, _prop) {
      throw new Error("Can't delete root level objects after initialization.")
    },
    has(_target, prop) {
      if (typeof prop !== 'string') return false

      return doc.share.has(prop)
    },
    getOwnPropertyDescriptor(_target, prop) {
      if (typeof prop !== 'string' || !doc.share.has(prop)) return

      return {
        enumerable: true,
        configurable: true,
      }
    },
    ownKeys(_target) {
      return Array.from(doc.share.keys())
    },
  })

  return reactive(proxy)
}