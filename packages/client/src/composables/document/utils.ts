import object from './object'
import array from './array'
import * as Y from 'yjs'

export const INTERNAL_OBJECT = Symbol('INTERNAL_OBJECT')

export function resolve(value: any) {
  let resolved = value

  if (Array.isArray(value)) {
    resolved = array(value)[INTERNAL_OBJECT]
  } else if (value && typeof value === 'object') {
    resolved = object(value)[INTERNAL_OBJECT]
  }

  return resolved
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
