import * as Y from 'yjs'
import { YOBJECT_KEY, proxify, convert } from './utils'

// proxy cache
const objects = new WeakMap<Y.Map<any>>()

export default function object<
  T extends Record<string, any> = Record<string, any>,
>(init = {} as T, map = new Y.Map<any>()) {
  if (Object.keys(init).length && map.size) {
    throw new Error("Can't provide initial values for a non-empty map.")
  }

  // return cached proxy if available
  if (objects.has(map)) return objects.get(map)

  // create new proxy
  const proxy = new Proxy({} as T, {
    get(target, prop) {
      if (prop === YOBJECT_KEY) {
        return map
      }

      if (typeof prop === 'symbol') {
        return Reflect.get(target, prop)
      }

      return proxify(map.get(prop))
    },
    set(target, prop, value) {
      if (typeof prop === 'symbol') {
        return Reflect.set(target, prop, value)
      }

      map.set(prop, convert(value))
      return true
    },
    deleteProperty(_target, prop) {
      if (typeof prop !== 'string' || !map.has(prop)) return false

      map.delete(prop)
      return true
    },
    has(_target, prop) {
      if (typeof prop !== 'string') return false

      return map.has(prop)
    },
    getOwnPropertyDescriptor(_target, prop) {
      if (typeof prop !== 'string' || !map.has(prop)) return

      return {
        enumerable: true,
        configurable: true,
      }
    },
    ownKeys(_target) {
      return Array.from(map.keys())
    },
  })

  // initialize with provided values
  for (let key in init) {
    proxy[key] = init[key]
  }

  // cache proxy before returning
  objects.set(map, proxy)
  return proxy
}
