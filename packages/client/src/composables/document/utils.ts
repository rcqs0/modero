import object from './object'
import array from './array'
import * as Y from 'yjs'
import { shallowRef, triggerRef } from 'vue'

// used types
export type Entities = Record<string, Record<string, any>>

// symbol key used to expose the inner yobject of a proxy
export const YOBJECT_KEY = Symbol('yobject')

// symbol key used to cache values destroyed instances
export const CACHE_KEY = Symbol('cache')

// symbol key used to store a reference to the entities proxy
export const ENTITIES_KEY = Symbol('entities')

// inspect a value, returning it's related yobject if available
export function inspect(value: any) {
  if (typeof value === 'object' && value) {
    return value[YOBJECT_KEY] as Y.AbstractType<any>
  }
}

// normalization & denormalization
export function normalize(input: any, entities: Y.Map<any>) {
  if (!input || typeof input !== 'object' || !Object.keys(input).length)
    return input

  const data = Array.isArray(input) ? [...input] : Object.assign({}, input)

  for (const [key, value] of Object.entries(data)) {
    data[key] = normalize(value, entities)
  }

  if ('__typename' in data && 'id' in data) {
    const { __typename, id } = data

    if (!entities.has(__typename)) {
      entities.set(__typename, new Y.Map())
    }
    const group = entities.get(__typename)

    if (!group.has(id)) {
      group.set(id, new Y.Map())
    }
    const instance = group.get(id)

    for (const [key, value] of Object.entries(data)) {
      instance.set(key, convert(value))
    }

    return { __typename, id }
  }

  return data
}

export function denormalize(value: any, entities: Y.Map<any>) {
  if (value instanceof Y.Map && value.has('__typename') && value.has('id')) {
    const instance = entities.get(value.get('__typename'))?.get(value.get('id'))

    if (instance) return instance
  }

  return value
}

// resolve a value into a proxy, if available
export function proxify(value: any, entities?: Y.Map<any>) {
  if (value instanceof Y.Array) {
    return array([], value, entities)
  }

  if (value instanceof Y.Map) {
    const denormalized = entities ? denormalize(value, entities) : value
    return object({}, denormalized, entities)
  }

  return value
}

// convert a value to a yobject, if the type is compatible
export function convert(
  input: any,
  options?: { type?: Y.AbstractType<any>; entities?: Y.Map<any> },
) {
  const type = options?.type
  const entities = options?.entities

  const normalized = entities ? normalize(input, entities) : input

  if (Array.isArray(input)) {
    if (type && !(type instanceof Y.Array)) throw new Error()

    const arr = type || new Y.Array()
    arr.insert(0, normalized.map(convert))

    return arr
  }

  if (input && typeof input === 'object') {
    if (type && !(type instanceof Y.Map)) throw new Error()

    const map = type || new Y.Map()
    for (const [key, value] of Object.entries(normalized)) {
      map.set(key, convert(value))
    }

    return map
  }

  return input
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
      : scope && typeof scope === 'object'
      ? scope[YOBJECT_KEY]
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
