import * as Y from 'yjs'
import { YOBJECT_KEY, proxify, convert, transact, bind } from './utils'

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
  entities?: Y.Map<any>,
) {
  // return cached proxy if available
  if (arrays.has(arr)) return arrays.get(arr) as T

  convert(init, { type: arr, entities })

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

      // wrap all mutating functions in a transaction
      if (
        key === 'copyWithin' ||
        key === 'fill' ||
        key === 'reverse' ||
        key === 'sort' ||
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

      if (typeof key === 'number') {
        track(key)

        return proxify(arr.get(key), entities)
      }

      return Reflect.get(target, prop, receiver)
    },

    has(target, prop) {
      const key = toKey(prop)

      if (typeof key === 'number') {
        return key >= 0 && key < arr.length
      }

      return Reflect.has(target, prop)
    },

    set(target, prop, value, _receiver) {
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

      if (typeof key === 'number') {
        transact(arr, () => {
          if (key < arr.length) {
            arr.delete(key, 1)
          }

          // TODO: splice is the only(?) method that sets values higher than length - perhaps optimize with custom splice implementation
          // doing the below is risky because it allows pulluting the array with null values
          if (key > arr.length) {
            arr.insert(
              arr.length,
              [...Array(key - arr.length).keys()].map(() => null) as any,
            )
          }

          arr.insert(key, [convert(value, { entities })])
        })

        return true
      }

      throw new Error(`Can't assign "${key}" to array.`)
    },

    deleteProperty(target, prop) {
      const key = toKey(prop)

      if (typeof key === 'symbol' || typeof key === 'string') {
        return Reflect.deleteProperty(target, prop)
      }

      arr.delete(key, 1)

      return true
    },

    getOwnPropertyDescriptor(_target, prop) {
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

    ownKeys(_target) {
      track()

      const keys = ['length']

      for (let i = 0; i < arr.length; i++) {
        keys.push(`${i}`)
      }

      return keys
    },
  })

  // cache proxy before returning
  arrays.set(arr, proxy)
  return proxy
}
