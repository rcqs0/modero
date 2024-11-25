import object from './object'
import array from './array'
import * as Y from 'yjs'
import { shallowRef, triggerRef } from 'vue'

// symbol key used to expose the inner yobject of a proxy
export const YOBJECT_KEY = Symbol('yobject')

// inspect a value, returning it's related yobject if available
export function inspect(value: any) {
  if (typeof value === 'object' && value) {
    return value[YOBJECT_KEY] as Y.AbstractType<any>
  }
}

// resolve a value into a proxy, if available
export function proxify(value: any) {
  if (value instanceof Y.Array) {
    return array([], value)
  }

  if (value instanceof Y.Map) {
    return object({}, value)
  }

  if (Array.isArray(value)) {
    return array(value)
  }

  if (value && typeof value === 'object') {
    return object(value)
  }

  return value
}

// convert a value to a yobject, if the type is compatible
export function convert(value: any) {
  return inspect(proxify(value)) ?? value
}

// perform a transaction on the ydoc bound to the provided scope, if applicable
export function transact<T>(
  scope: any,
  f: (transaction?: Y.Transaction) => T,
): T {
  const doc =
    scope instanceof Y.Doc
      ? scope
      : scope instanceof Y.AbstractType
      ? scope.doc
      : typeof scope === 'object'
      ? inspect(scope)?.doc
      : undefined

  if (doc) {
    return doc.transact(f)
  }

  return f()
}

// create reactive binding
export function bind() {
  const binding = shallowRef()

  function track() {
    return binding.value
  }

  function trigger() {
    triggerRef(binding)
  }

  return { track, trigger }
}

export type Binding = ReturnType<typeof bind>

export function bind2<T>(
  value: Y.AbstractType<any>,
  listener: (event: T, bindings: Map<string | number | null, Binding>) => any,
) {
  const bindings = new Map<string | number | null, Binding>()
}
