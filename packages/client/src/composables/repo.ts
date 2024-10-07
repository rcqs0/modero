import _ from 'lodash'
import { DeepPartial } from '@/lib/types'
import { reactive } from 'vue'

// const proxies = new WeakMap()

const META_KEY = Symbol('meta')

export function inspect(value: any) {
  return typeof value !== 'object' ? undefined : value[META_KEY]
}

export function patch<T>(target: T, value: DeepPartial<T>): void {
  _.mergeWith(target, value, (_value, other) => {
    // don't try to merge array values - replace instead
    if (Array.isArray(other)) return other
  })
}

export function normalize(
  input: any,
  entities: Record<string, Record<string, any>> = {},
): {
  data: any
  entities: Record<string, Record<string, any>>
} {
  if (!input || typeof input !== 'object') return { data: input, entities }

  _.each(input, (value, key) => {
    input[key] = normalize(value, entities).data
  })

  if ('id' in input && '__typename' in input) {
    const type = input.__typename

    const reference = _.pick(input, ['__typename', 'id'])

    if (!entities[type]) entities[type] = {}
    patch(entities[type], { [input.id]: input })

    return { data: reference, entities }
  }

  return { data: input, entities }
}

export function denormalize(
  input: any,
  entities: Record<string, Record<string, any>>,
  path: string[] = [],
): any {
  if (!input || typeof input !== 'object') return input

  const normalized = entities[input.__typename]?.[input.id]
  const object = normalized || input

  const proxy = new Proxy(object, {
    get(target, prop, receiver) {
      if (prop === META_KEY) {
        return {
          target: object,
          normalized: !!normalized,
          path,
        }
      }

      if (typeof prop === 'symbol') {
        return Reflect.get(target, prop)
      }

      if (prop === '__v_raw') {
        return _.cloneDeep(receiver)
      }

      return denormalize(target[prop], entities, [...path, prop])
    },
    set(target, prop, value) {
      if (typeof prop === 'symbol') {
        return Reflect.set(target, prop, value)
      }

      target[prop] = normalize(value, entities).data

      return true
    },
  })

  return proxy
}

export default function useRepo(input: any) {
  const entities = reactive(normalize(input).entities)

  function resolve(input: any) {
    return denormalize(input, entities)
  }

  return { resolve }
}
