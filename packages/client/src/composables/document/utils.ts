import object from './object'
import array from './array'
import * as Y from 'yjs'

export const INTERNAL_OBJECT = Symbol('INTERNAL_OBJECT')

export function resolve(value: any) {
  if (Array.isArray(value)) {
    return array(value)[INTERNAL_OBJECT]
  }

  if (value && typeof value === 'object') {
    return object(value)[INTERNAL_OBJECT]
  }

  return value
}

export function transact<T>(obj: any, f: (tr?: Y.Transaction) => T) {
  const internal = obj[INTERNAL_OBJECT]

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
