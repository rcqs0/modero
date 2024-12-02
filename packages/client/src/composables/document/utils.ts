import object from './object'
import array from './array'
import * as Y from 'yjs'
import { shallowRef, triggerRef } from 'vue'
import _ from 'lodash'

// used types
export type Entities = Record<string, Record<string, any>>

// symbol key used to expose the inner yobject of a proxy
export const YOBJECT_KEY = Symbol('yobject')

// symbol key used to cache values destroyed instances
export const CACHE_KEY = Symbol('cache')

// inspect a value, returning it's related yobject if available
export function inspect(value: any) {
  if (typeof value === 'object' && value) {
    return value[YOBJECT_KEY] as Y.AbstractType<any>
  }
}

// resolve a value into a proxy, if available
export function proxify(value: any, entities?: any) {
  if (value instanceof Y.Array) {
    return array([], value, entities)
  }

  if (value instanceof Y.Map) {
    return object({}, value, entities)
  }

  if (Array.isArray(value)) {
    return array(value, new Y.Array(), entities)
  }

  if (value && typeof value === 'object') {
    return object(value, new Y.Map(), entities)
  }

  return value
}

// convert a value to a yobject, if the type is compatible
export function convert(value: any, entities?: any) {
  return inspect(proxify(value, entities)) ?? value
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

// normalization
export function normalize(
  input: any,
  entities: Entities = {},
): {
  data: any
  entities: Entities
} {
  if (!input || typeof input !== 'object' || !Object.keys(input).length)
    return { data: input, entities }

  const data = _.clone(input)

  _.each(data, (value, key) => {
    data[key] = normalize(value, entities).data
  })

  if ('__typename' in data && 'id' in data) {
    const { __typename: type, id } = data
    const reference = { __typename: type, id }

    if (!entities[type]) entities[type] = {}

    if (!entities[type][id]) {
      entities[type][id] = data
    } else {
      const instance = entities[type][id]

      for (const [key, value] of Object.entries(data)) {
        if (!_.isEqual(instance[key], value)) {
          instance[key] = value
        }
      }
    }

    return { data: reference, entities }
  }

  return { data, entities }
}
