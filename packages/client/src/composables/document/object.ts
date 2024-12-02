import * as Y from 'yjs'
import {
  YOBJECT_KEY,
  CACHE_KEY,
  proxify,
  convert,
  bind,
  transact,
  normalize,
} from './utils'

export const ENTITIES_KEY = Symbol('entities')

// proxy cache
const objects = new WeakMap<Y.Map<any>>()

export default function object<
  T extends Record<string, any> = Record<string, any>,
>(init = {} as T, map = new Y.Map<any>(), entities?: any) {
  // return cached proxy if available
  if (objects.has(map)) {
    const existing = objects.get(map)
    existing[ENTITIES_KEY] = entities
    return existing
  }

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

  const target = {} as any
  target[YOBJECT_KEY] = map
  target[ENTITIES_KEY] = entities

  // create new proxy
  const proxy = new Proxy(target as T, {
    get(target, prop, receiver) {
      const cached = Reflect.get(target, CACHE_KEY)
      if (cached) {
        return Reflect.get(cached, prop)
      }

      if (typeof prop === 'symbol') {
        return Reflect.get(target, prop)
      }

      if (prop === '__v_skip') {
        return true
      }

      track(prop)

      const input = map.get(prop)
      const entities = receiver[ENTITIES_KEY]

      if (
        entities &&
        input instanceof Y.Map &&
        input.has('__typename') &&
        input.has('id')
      ) {
        // const instance = entities[input.get('__typename')]?.[input.get('id')]
        const instance = entities[YOBJECT_KEY].get(
          input.get('__typename'),
        )?.get(input.get('id'))

        if (instance) {
          return proxify(instance, entities)
        }
      }

      return proxify(input, entities)
    },
    set(target, prop, value, receiver) {
      const cached = Reflect.get(target, CACHE_KEY)
      if (cached) {
        return Reflect.set(cached, prop, value)
      }

      if (typeof prop === 'symbol') {
        return Reflect.set(target, prop, value)
      }

      const entities = receiver[ENTITIES_KEY]

      transact(map, () => {
        if (map.doc) {
          const current = receiver[prop]
          const yobject = current?.[YOBJECT_KEY]

          if (yobject && yobject.parent?.parent !== entities[YOBJECT_KEY]) {
            current[CACHE_KEY] = yobject.toJSON()

            if (yobject instanceof Y.Map) {
              yobject.clear()
            } else if (yobject instanceof Y.Array) {
              yobject.delete(0, yobject.length)
            }
          }
        }

        if (entities) {
          const { data } = normalize(value, entities)
          map.set(prop, convert(data, entities))
        } else {
          map.set(prop, convert(value))
        }
      })
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
