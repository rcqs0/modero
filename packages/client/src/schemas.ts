import { z } from 'zod/v4'
import { nanoid } from 'nanoid'

export const eventSchema = z.object({
  __typename: z.literal('Event').default('Event'),
  id: z.string().default(nanoid),
  label: z.string(),
})

export type Event = z.infer<typeof eventSchema>

export const controlSchema = z.object({
  __typename: z.literal('Control').default('Control'),
  id: z.string().default(nanoid),
  label: z.string(),
})

export type Control = z.infer<typeof controlSchema>

export const causalitySchema = z.object({
  __typename: z.literal('Causality').default('Causality'),
  id: z.string().default(nanoid),
  cause: eventSchema,
  effect: eventSchema,
  controls: z.array(controlSchema).default(() => []),
})

export type Causality = z.infer<typeof causalitySchema>

export const uncertaintySchema = z.object({
  __typename: z.literal('Uncertainty').default('Uncertainty'),
  id: z.string().default(nanoid),
  label: z.string(),
  event: eventSchema,
})

export type Uncertainty = z.infer<typeof uncertaintySchema>
