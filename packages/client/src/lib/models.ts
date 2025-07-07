import { z } from 'zod'
import _ from 'lodash'
import { nanoid } from 'nanoid'

type ModelDef = {
  fields: Record<
    string,
    {
      schema: z.ZodTypeAny
      label: string
      translatable?: boolean
    }
  >
}

export type Model = Record<string, any> & { schema: z.ZodTypeAny }

export type Infer<T extends Model> = z.infer<T['schema']>

const registry = new Map()

export function flatten(
  input: Record<string, any> | any[],
  filter?: (value: any, key: any, parent: any) => boolean,
  prefix: string = '',
): Record<string, any> {
  let result: any = {}

  const filtered = filter
    ? _.pickBy(input, (value, key) => filter(value, key, input))
    : input

  _.forOwn(filtered, (value, key) => {
    const newKey = prefix ? `${prefix}.${key}` : key

    if (_.isObject(value) && !_.isArray(value)) {
      result = { ...result, ...flatten(value, filter, newKey) }
    } else if (_.isArray(value)) {
      value.forEach((item, index) => {
        result = { ...result, ...flatten(item, filter, `${newKey}[${index}]`) }
      })
    } else {
      result[newKey] = value
    }
  })

  return result
}

export function unflatten(input: Record<string, any>): Record<string, any> {
  return _.reduce(
    input,
    (result, value, key) => {
      _.set(result, key, value)
      return result
    },
    {},
  )
}

export function transcribe<T extends Record<string, any>>(entity: T) {
  return flatten(entity, (value, key, parent) => {
    if (_.isObject(value)) {
      return true
    }

    const model = registry.get(parent.__typename)

    if (!model) {
      return false
    }

    return _.keys(_.pickBy(model.fields, { translatable: true })).includes(key)
  })
}

export function define<N extends string, T extends ModelDef>(name: N, data: T) {
  const schema = z.object({
    __typename: z.literal(name).default(name),
    id: z.string().default(nanoid),
    ...(_.mapValues(data.fields, (field) => field.schema) as {
      [K in keyof T['fields']]: T['fields'][K]['schema']
    }),
  })

  function create(input: z.input<typeof schema>) {
    return schema.parse(input)
  }

  function merge(entity: z.input<typeof schema>, patch: Record<string, any>) {
    _.merge(entity, unflatten(patch))
  }

  const model = {
    fields: data.fields,
    schema,
    create,
    transcribe: transcribe<z.infer<typeof schema>>,
    merge,
  }

  registry.set(name, model)
  return model
}
