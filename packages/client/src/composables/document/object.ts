import * as Y from 'yjs'
import { convert, YOBJECT_KEY } from './utils'
import array from './array'

const objects = new WeakMap<Y.Map<any>>()

export default function object<
  T extends Record<string, any> = Record<string, any>,
>(init = {} as T, map = new Y.Map<any>()): T {
  if (Object.keys(init).length && map.size) {
    throw new Error("Can't provide initial values for a non-empty map.")
  }

  if (objects.has(map)) return objects.get(map)

  // proxy
  const proxy = new Proxy({} as T, {
    get(target, prop) {
      if (prop === YOBJECT_KEY) {
        return map
      }

      if (typeof prop === 'symbol') {
        return Reflect.get(target, prop)
      }

      const value = map.get(prop)

      if (value instanceof Y.Array) {
        return array([], value)
      } else if (value instanceof Y.Map) {
        return object({}, value)
      }
      return value
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

  for (let key in init) {
    proxy[key] = init[key]
  }

  objects.set(map, proxy)
  return proxy
}
