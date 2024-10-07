import * as Y from 'yjs'
import object from './object'
import { YOBJECT_KEY, convert } from './utils'

const arrays = new WeakMap<Y.Array<any>>()

function toKey(prop: string | number | symbol) {
  if (typeof prop === 'string' && prop.trim().length) {
    const num = Number(prop)
    if (Number.isInteger(num)) {
      return num
    }
  }

  return prop
}

export default function array<T>(
  init: T[] = [],
  arr = new Y.Array<T>(),
): T[] & { [YOBJECT_KEY]: Y.Array<T> } {
  if (init.length && arr.length) {
    throw new Error("Can't provide initial values for a non-empty array.")
  }

  if (arrays.has(arr)) return arrays.get(arr)

  function transact(fn: () => any) {
    return arr.doc ? arr.doc.transact(fn) : fn()
  }

  const proxy = new Proxy([] as any as T[] & { [YOBJECT_KEY]: Y.Array<T> }, {
    get(target, prop, receiver) {
      const key = toKey(prop)

      if (key === YOBJECT_KEY) {
        return arr
      }

      if (typeof key === 'symbol') {
        return Reflect.get(target, key)
      }

      if (typeof key === 'number') {
        const value = arr.get(key)
        if (value instanceof Y.Array) {
          return array([], value)
        } else if (value instanceof Y.Map) {
          return object({}, value)
        }
        return value
      }

      if (key === 'length') {
        return arr.length
      }

      if (key === 'pop') {
        return function () {
          const index = arr.length - 1

          const value = receiver[index]
          arr.delete(index)

          return value
        }
      }

      if (key === 'push') {
        return function () {
          arr.push(Array.from(arguments).map(convert))

          return arr.length
        }
      }

      if (key === 'shift') {
        return function () {
          const value = receiver[0]
          arr.delete(0)

          return value
        }
      }

      if (key === 'splice') {
        return function () {
          const length = arr.length

          const start =
            !arguments.length || arguments[0] < -length
              ? 0
              : arguments[0] > length
              ? length
              : arguments[0] < 0
              ? length - Math.abs(arguments[0])
              : arguments[0]
          const deleteCount =
            arguments.length === 1 || start + arguments[1] > length
              ? length - start
              : arguments[1] < 0
              ? 0
              : arguments[1]
          const items = Array.from(arguments).slice(2)

          const deleted: T[] = []
          for (let i = start; i < start + deleteCount; i++) {
            deleted.push(receiver[i])
          }

          transact(() => {
            arr.delete(start, deleteCount)
            arr.insert(start, items.map(convert))
          })

          return deleted
        }
      }

      if (key === 'unshift') {
        return function () {
          arr.unshift(Array.from(arguments).map(convert))

          return arr.length
        }
      }

      // TODO: implement these methods separately, reverse is broken and copyWithin, fill and sort might need some extra conversion / convert logic
      if (
        key === 'copyWithin' ||
        key === 'fill' ||
        key === 'reverse' ||
        key === 'sort'
      ) {
        // throw new Error(`"${key}" is not supported`)

        // const method = target[key] as any
        const method = Reflect.get(target, prop)

        return function () {
          return transact(() => {
            return method.apply(receiver, arguments)
          })
        }
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

    set(target, prop, value, receiver) {
      const key = toKey(prop)

      if (typeof key === 'symbol') {
        return Reflect.set(target, key, value)
      }

      if (typeof key === 'number') {
        transact(() => {
          arr.delete(key, 1)
          arr.insert(key, [convert(value)])
        })

        return true
      }

      if (key === 'length') {
        const length = arr.length

        if (value < length) {
          arr.delete(value, length - value)
        }

        return true
      }

      return Reflect.set(target, prop, value, receiver)
    },

    deleteProperty(_target, _prop) {
      throw new Error('delete operation not allowed')
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
      const keys: string[] = []
      for (let i = 0; i < arr.length; i++) {
        keys.push(`${i}`)
      }
      keys.push('length')

      return keys
    },
  })

  arr.insert(0, init.map(convert))

  arrays.set(arr, proxy)
  return proxy
}
