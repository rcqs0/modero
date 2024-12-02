import * as Y from 'yjs'
import {
  YOBJECT_KEY,
  CACHE_KEY,
  proxify,
  convert,
  transact,
  bind,
  normalize,
} from './utils'
import { ENTITIES_KEY } from './object'

// proxy cache
const arrays = new WeakMap<Y.Array<any>>()

// convert proxy property to array key
function toKey(prop: string | number | symbol) {
  if (typeof prop === 'string' && prop.trim().length) {
    const number = Number(prop)

    if (Number.isInteger(number)) {
      return number
    }
  }

  return prop
}

export default function array<T>(
  init: T[] = [],
  arr = new Y.Array<T>(),
  entities?: any,
) {
  // if (init.length && arr.doc && arr.length) {
  //   throw new Error("Can't provide initial values for a non-empty array.")
  // }

  // return cached proxy if available
  if (arrays.has(arr)) {
    const existing = arrays.get(arr)
    existing[ENTITIES_KEY] = entities
    return existing
  }

  const track = bind(arr, (event: Y.YArrayEvent<any>, trigger, untrack) => {
    const start = event.delta[0]?.retain || 0
    const length = event.target.length

    if (event.changes.added.size !== event.changes.deleted.size) {
      trigger()
    }

    let end = 1

    for (const segment of event.delta) {
      if (segment.insert) {
        end += (segment.insert as any[]).length
      } else if (segment.delete) {
        end -= segment.delete
      } else if (segment.retain) {
        end += segment.retain
      }
    }

    // TODO: optimize further to remove more unnecessary triggers
    for (let key = 0; key < end; key++) {
      if (key >= start) {
        trigger(key)
      }

      if (key >= length) {
        untrack(key)
      }
    }
  })

  const target = [] as any
  target[YOBJECT_KEY] = arr

  // create new proxy
  const proxy = new Proxy(target as T[], {
    get(target, prop, receiver) {
      const cached = Reflect.get(target, CACHE_KEY)
      if (cached) {
        return Reflect.get(cached, prop)
      }

      const key = toKey(prop)

      if (typeof key === 'symbol') {
        return Reflect.get(target, key)
      }

      if (prop === '__v_skip') {
        return true
      }

      if (key === 'length') {
        track()

        return arr.length
      }

      // if (key === 'pop') {
      //   return function () {
      //     const index = arr.length - 1

      //     const value = receiver[index]
      //     arr.delete(index)

      //     return value
      //   }
      // }

      // if (key === 'push') {
      //   return function () {
      //     arr.push(Array.from(arguments).map(convert))

      //     return arr.length
      //   }
      // }

      // if (key === 'shift') {
      //   return function () {
      //     const value = receiver[0]
      //     arr.delete(0)

      //     return value
      //   }
      // }

      // if (key === 'splice') {
      //   return function () {
      //     const length = arr.length

      //     const start =
      //       !arguments.length || arguments[0] < -length
      //         ? 0
      //         : arguments[0] > length
      //         ? length
      //         : arguments[0] < 0
      //         ? length - Math.abs(arguments[0])
      //         : arguments[0]
      //     const deleteCount =
      //       arguments.length === 1 || start + arguments[1] > length
      //         ? length - start
      //         : arguments[1] < 0
      //         ? 0
      //         : arguments[1]
      //     const items = Array.from(arguments).slice(2)

      //     const deleted: T[] = []
      //     for (let i = start; i < start + deleteCount; i++) {
      //       deleted.push(receiver[i])
      //     }

      //     transact(arr, () => {
      //       arr.delete(start, deleteCount)
      //       arr.insert(start, items.map(convert))
      //     })

      //     return deleted
      //   }
      // }

      // if (key === 'unshift') {
      //   return function () {
      //     arr.unshift(Array.from(arguments).map(convert))

      //     return arr.length
      //   }
      // }

      // wrap any other functions that perform multiple updates in a transaction
      if (
        key === 'copyWithin' ||
        key === 'fill' ||
        key === 'reverse' ||
        key === 'sort' ||
        // poc
        key === 'pop' ||
        key === 'push' ||
        key === 'shift' ||
        key === 'splice' ||
        key === 'unshift'
      ) {
        const method = Reflect.get(target, prop)

        return function () {
          return transact(arr, () => {
            return method.apply(receiver, arguments)
          })
        }
      }

      const entities = receiver[ENTITIES_KEY]

      if (typeof key === 'number') {
        track(key)

        const input = arr.get(key) as any

        if (
          entities &&
          input instanceof Y.Map &&
          input.has('__typename') &&
          input.has('id')
        ) {
          const instance = entities[YOBJECT_KEY].get(
            input.get('__typename'),
          )?.get(input.get('id'))

          if (instance) {
            return proxify(instance, entities)
          }
        }

        return proxify(arr.get(key), entities)
      }

      return Reflect.get(target, prop, receiver)
    },

    has(target, prop) {
      const cached = Reflect.get(target, CACHE_KEY)
      if (cached) {
        return Reflect.has(cached, prop)
      }

      const key = toKey(prop)

      if (typeof key === 'number') {
        return key >= 0 && key < arr.length
      }

      return Reflect.has(target, prop)
    },

    set(target, prop, value, receiver) {
      const cached = Reflect.get(target, CACHE_KEY)
      if (cached) {
        return Reflect.set(cached, prop, value)
      }

      const key = toKey(prop)

      if (typeof key === 'symbol') {
        return Reflect.set(target, key, value)
      }

      if (key === 'length') {
        const length = arr.length

        if (value < length) {
          arr.delete(value, length - value)
        }

        return true
      }

      const entities = receiver[ENTITIES_KEY]

      if (typeof key === 'number') {
        transact(arr, () => {
          if (arr.doc) {
            const current = receiver[key]
            const yobject = current?.[YOBJECT_KEY]

            if (yobject) {
              current[CACHE_KEY] = yobject.toJSON()

              if (yobject instanceof Y.Map) {
                yobject.clear()
              } else if (yobject instanceof Y.Array) {
                yobject.delete(0, yobject.length)
              }
            }
          }

          if (key < length) {
            arr.delete(key, 1)
          }

          if (entities) {
            const { data } = normalize(value, entities)
            arr.insert(key, [convert(data, entities)])
          } else {
            arr.insert(key, [convert(value)])
          }
        })

        return true
      }

      return Reflect.set(target, prop, value, receiver)
    },

    deleteProperty(target, prop) {
      const cached = Reflect.get(target, CACHE_KEY)
      if (cached) {
        return Reflect.deleteProperty(cached, prop)
      }

      const key = toKey(prop)

      if (typeof key === 'symbol' || typeof key === 'string') {
        return Reflect.deleteProperty(target, prop)
      }

      arr.delete(key, 1)

      return true
    },

    getOwnPropertyDescriptor(target, prop) {
      const cached = Reflect.get(target, CACHE_KEY)
      if (cached) {
        return Reflect.getOwnPropertyDescriptor(cached, prop)
      }

      const key = toKey(prop)

      if (key === 'length') {
        return {
          enumerable: false,
          configurable: false,
          writable: true,
        }
      }

      if (typeof key === 'number') {
        if (key >= 0 && key < arr.length) {
          return {
            enumerable: true,
            configurable: true,
            writable: true,
          }
        }
      }
    },

    ownKeys(target) {
      const cached = Reflect.get(target, CACHE_KEY)
      if (cached) {
        return Reflect.ownKeys(cached)
      }

      track()

      const keys = ['length']

      for (let i = 0; i < arr.length; i++) {
        keys.push(`${i}`)
      }

      return keys
    },
  })

  // initialize with provided values
  arr.insert(0, init.map(convert))

  // cache proxy before returning
  arrays.set(arr, proxy)
  return proxy
}
