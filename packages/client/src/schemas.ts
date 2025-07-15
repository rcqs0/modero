import { z } from 'zod/v4'
import { nanoid } from 'nanoid'

export const uncertaintySchema = z.object({
  __typename: z.literal('Uncertainty').default('Uncertainty'),
  id: z.string().default(nanoid),
  label: z.string(),
  description: z.string().optional(),
})

export type Uncertainty = z.infer<typeof uncertaintySchema>

export const eventSchema = z.object({
  __typename: z.literal('Event').default('Event'),
  id: z.string().default(nanoid),
  label: z.string(),
  description: z.string().optional(),
})

export type Event = z.infer<typeof eventSchema>

export const controlSchema = z.object({
  __typename: z.literal('Control').default('Control'),
  id: z.string().default(nanoid),
  label: z.string(),
  description: z.string().optional(),
  effectiveness: z.number().default(0),
})

export type Control = z.infer<typeof controlSchema>

export const causeSchema = z.object({
  __typename: z.literal('Cause').default('Cause'),
  id: z.string().default(nanoid),
  event: eventSchema,
  uncertainty: uncertaintySchema,
  controls: z.array(controlSchema).default(() => []),
})

export type Cause = z.infer<typeof causeSchema>

export const effectSchema = z.object({
  __typename: z.literal('Effect').default('Effect'),
  id: z.string().default(nanoid),
  uncertainty: uncertaintySchema,
  event: eventSchema,
  controls: z.array(controlSchema).default(() => []),
})

export type Effect = z.infer<typeof effectSchema>
