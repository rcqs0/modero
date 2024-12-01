import * as Y from 'yjs'
import {
  YOBJECT_KEY,
  CACHE_KEY,
  proxify,
  convert,
  bind,
  inspect,
} from './utils'

// proxy cache
const objects = new WeakMap<Y.Map<any>>()

export default function object<
  T extends Record<string, any> = Record<string, any>,
>(init = {} as T, map = new Y.Map<any>()) {
  // if (Object.keys(init).length && map.size) {
  //   throw new Error("Can't provide initial values for a non-empty map.")
  // }

  // return cached proxy if available
  if (objects.has(map)) return objects.get(map)

  const track = bind(map, (event: Y.YMapEvent<any>, trigger, untrack) => {
    const added: string[] = []
    const updated: string[] = []
    const deleted: string[] = []

    event.changes.keys.forEach((change, key) => {
      if (change.action === 'add') added.push(key)
      if (change.action === 'update') {
        if (change.oldValue !== event.target.get(key)) {
          updated.push(key)
        }
      }
      if (change.action === 'delete') deleted.push(key)
    })

    if (added.length || deleted.length) {
      trigger()
    }

    updated.forEach((key) => {
      trigger(key)
    })

    deleted.forEach((key) => untrack(key))
  })

  // create new proxy
  const proxy = new Proxy({} as T, {
    get(target, prop) {
      const cached = Reflect.get(target, CACHE_KEY)
      if (cached) {
        return Reflect.get(cached, prop)
      }

      if (prop === YOBJECT_KEY) {
        return map
      }

      if (typeof prop === 'symbol') {
        return Reflect.get(target, prop)
      }

      if (prop === '__v_skip') {
        return true
      }

      track(prop)

      return proxify(map.get(prop))
    },
    set(target, prop, value, receiver) {
      const cached = Reflect.get(target, CACHE_KEY)
      if (cached) {
        return Reflect.set(cached, prop, value)
      }

      if (map.doc) {
        const current = receiver[prop]
        const yobject = inspect(current)

        if (yobject) {
          current[CACHE_KEY] = yobject.toJSON()

          if (yobject instanceof Y.Map) {
            yobject.clear()
          } else if (yobject instanceof Y.Array) {
            yobject.delete(0, yobject.length)
          }
        }
      }

      if (typeof prop === 'symbol') {
        return Reflect.set(target, prop, value)
      }

      map.set(prop, convert(value))
      return true
    },
    deleteProperty(target, prop) {
      const cached = Reflect.get(target, CACHE_KEY)
      if (cached) {
        return Reflect.deleteProperty(cached, prop)
      }

      if (typeof prop !== 'string' || !map.has(prop)) return false

      map.delete(prop)
      return true
    },
    has(target, prop) {
      const cached = Reflect.get(target, CACHE_KEY)
      if (cached) {
        return Reflect.has(cached, prop)
      }

      if (typeof prop !== 'string') return false

      track()

      return map.has(prop)
    },
    getOwnPropertyDescriptor(target, prop) {
      const cached = Reflect.get(target, CACHE_KEY)
      if (cached) {
        return Reflect.getOwnPropertyDescriptor(cached, prop)
      }

      if (typeof prop !== 'string' || !map.has(prop)) return

      return {
        enumerable: true,
        configurable: true,
      }
    },
    ownKeys(target) {
      const cached = Reflect.get(target, CACHE_KEY)
      if (cached) {
        return Reflect.ownKeys(cached)
      }

      track()

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
