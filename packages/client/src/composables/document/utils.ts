import object from './object'
import array from './array'
import * as Y from 'yjs'

export const YOBJECT_KEY = Symbol('yobject')

export function convert(value: any) {
  if (Array.isArray(value)) {
    return array(value)[YOBJECT_KEY]
  }

  if (value && typeof value === 'object') {
    return object(value)[YOBJECT_KEY]
  }

  return value
}

export function transact<T>(obj: any, f: (tr?: Y.Transaction) => T): T {
  if (typeof obj !== 'object') return f()

  const internal = obj[YOBJECT_KEY]

  if (internal instanceof Y.Doc) {
    return internal.transact(f)
  }

  if (internal instanceof Y.AbstractType) {
    if (internal.doc) {
      return internal.doc.transact(f)
    }
  }

  return f()
}
