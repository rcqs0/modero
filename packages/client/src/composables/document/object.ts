import * as Y from 'yjs'
import { type Binding, YOBJECT_KEY, proxify, convert, bind } from './utils'

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

  const bindings = new Map<string | null, Binding>()

  function listener(event: Y.YMapEvent<any>) {
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
      bindings.get(null)?.trigger()
    }

    updated.forEach((key) => {
      bindings.get(key)?.trigger()
    })

    deleted.forEach((key) => bindings.delete(key))
    if (!bindings.size) {
      map.unobserve(listener)
    }
  }

  function observe(key: null | string = null) {
    if (!bindings.size) {
      map.observe(listener)
    }

    let binding = bindings.get(key)

    if (!binding) {
      binding = bind()
      bindings.set(key, binding)
    }

    binding.track()
  }

  // create new proxy
  const proxy = new Proxy({} as T, {
    get(target, prop) {
      if (prop === YOBJECT_KEY) {
        return map
      }

      if (typeof prop === 'symbol') {
        return Reflect.get(target, prop)
      }

      if (prop === '__v_skip') {
        return true
      }

      observe(prop)

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

      observe()

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
      observe()

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
