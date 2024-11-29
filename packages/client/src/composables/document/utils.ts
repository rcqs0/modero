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

// bind yobject to the reactivity system
export function bind<T extends Y.YEvent<any>>(
  value: Y.AbstractType<any>,
  observe: (
    event: T,
    trigger: (key?: string | number) => void,
    untrack: (key?: string | number) => void,
  ) => any,
) {
  const bindings = new Map<
    string | number | null,
    {
      track: () => any
      trigger: () => void
    }
  >()

  function trigger(key: string | number | null = null) {
    bindings.get(key)?.trigger()
  }

  function untrack(key: string | number | null = null) {
    bindings.delete(key)
  }

  function handler(event: T) {
    observe(event, trigger, untrack)

    if (!bindings.size) {
      value.unobserve(handler)
    }
  }

  function track(key: string | number | null = null) {
    if (!bindings.size) {
      value.observe(handler)
    }

    let binding = bindings.get(key)

    if (!binding) {
      const observable = shallowRef()

      binding = {
        track: () => observable.value,
        trigger: () => triggerRef(observable),
      }

      bindings.set(key, binding)
    }

    binding.track()
  }

  return track
}
