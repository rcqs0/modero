import _ from 'lodash'
import { ref, toRaw } from 'vue'

type Entities = Record<string, Record<string, any>>

export function normalize(
  input: any,
  entities: Entities = {},
): {
  data: any
  entities: Entities
} {
  if (!input || typeof input !== 'object') return { data: input, entities }

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

function denormalize(input: any, entities: Entities): any {
  if (!input || typeof input !== 'object') return input

  const instance = entities[input.__typename]?.[input.id]
  const object = instance || input

  return new Proxy(object, {
    get(target, prop, receiver) {
      if (typeof prop === 'symbol') {
        return Reflect.get(target, prop)
      }

      if (prop === '__v_raw') {
        return toRaw(object)
      }

      if (Array.isArray(target)) {
        const method = Reflect.get(target, prop)

        if (typeof method === 'function') {
          return function () {
            return method.apply(
              receiver,
              normalize(Array.from(arguments), entities).data,
            )
          }
        }
      }

      return denormalize(target[prop], entities)
    },

    set(target, prop, value, _receiver) {
      if (typeof prop === 'symbol') {
        return Reflect.set(target, prop, value)
      }

      const normalized = normalize(value, entities)

      if (!_.isEqual(target[prop], normalized.data)) {
        Reflect.set(target, prop, normalized.data)
      }

      return true
    },

    deleteProperty(target, prop) {
      if (prop in target) {
        delete target[prop]
      }

      return true
    },
  })
}

export default function useRepo(input: Entities = {}) {
  const entities = ref<Entities>(input)

  function resolve(input: any) {
    return denormalize(input, entities.value)
  }

  function get(entity: string, id: string) {
    return resolve(entities.value[entity]?.[id])
  }

  function update(input: any) {
    const { data } = normalize(input, entities.value)

    return resolve(data)
  }

  function initialize(input: Entities) {
    entities.value = input
  }

  return { entities, resolve, get, update, initialize }
}
