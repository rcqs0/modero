import object from './object'
import array from './array'
import * as Y from 'yjs'

// symbol key used to expose the inner yobject of a proxy
export const YOBJECT_KEY = Symbol('yobject')

// resolve a value into a proxy, if available
export function proxify(value: any) {
  if (value instanceof Y.Array) {
    return array([], value)
  }

  if (value instanceof Y.Map) {
    return object({}, value)
  }

  return value
}

// convert a value to a yobject, if the type is compatible
export function convert(value: any) {
  if (Array.isArray(value)) {
    return array(value)[YOBJECT_KEY]
  }

  if (value && typeof value === 'object') {
    return object(value)[YOBJECT_KEY]
  }

  return value
}

// perform a transaction on the ydoc bound to the provided scope, if applicable
export function transact<T>(
  scope: any,
  f: (transaction?: Y.Transaction) => T,
): T {
  if (scope instanceof Y.Doc) {
    return scope.transact(f)
  }

  if (scope instanceof Y.AbstractType) {
    if (scope.doc) {
      return scope.doc.transact(f)
    }
    return f()
  }

  if (typeof scope === 'object') {
    const yobject = scope[YOBJECT_KEY]

    if (yobject instanceof Y.Doc) {
      return yobject.transact(f)
    }

    if (yobject instanceof Y.AbstractType) {
      if (yobject.doc) {
        return yobject.doc.transact(f)
      }
    }
  }

  return f()
}
