import * as Y from 'yjs'
import { YOBJECT_KEY, proxify, convert, bind, transact } from './utils'

// proxy cache
const objects = new WeakMap<Y.Map<any>>()

export default function object<
  T extends Record<string, any> = Record<string, any>,
>(init = {} as T, map = new Y.Map<any>(), entities?: Y.Map<any>) {
  // return cached proxy if available
  if (objects.has(map)) return objects.get(map) as T

  convert(init, { type: map, entities })

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
    get(target, prop, _receiver) {
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

      return proxify(map.get(prop), entities)
    },
    set(target, prop, value, _receiver) {
      if (typeof prop === 'symbol') {
        return Reflect.set(target, prop, value)
      }

      transact(map, () => {
        map.set(prop, convert(value, { entities }))
      })

      return true
    },
    deleteProperty(_target, prop) {
      if (typeof prop !== 'string' || !map.has(prop)) return false

      map.delete(prop)
      return true
    },
    has(_target, prop) {
      if (typeof prop !== 'string') return false

      track()

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
      track()

      return Array.from(map.keys())
    },
  })

  // cache proxy before returning
  objects.set(map, proxy)
  return proxy
}
