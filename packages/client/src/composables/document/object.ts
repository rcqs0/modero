import * as Y from 'yjs'
import { resolve, INTERNAL_OBJECT } from './utils'
import array from './array'

const objects = new WeakMap<Y.Map<any>>()

export default function object<
  T extends Record<string, any> = Record<string, any>,
>(init = {} as T, map = new Y.Map<any>()): T {
  if (objects.has(map)) return objects.get(map)

  // proxy
  const proxy = new Proxy({} as T, {
    get(target, prop) {
      if (prop === INTERNAL_OBJECT) {
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

      map.set(prop, resolve(value))
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
