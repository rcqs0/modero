import { Type, type Static } from '@sinclair/typebox'

export const User = () =>
  Type.Recursive((This) =>
    Type.Object({
      id: Type.Number(),
      name: Type.String(),
      email: Type.String({
        pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.toString(),
      }),
      group: Type.Object({
        id: Type.Number(),
        title: Type.String(),
        users: Type.Array(This),
      }),
    }),
  )

export type User = Static<ReturnType<typeof User>>

export const Group = () =>
  Type.Object({
    id: Type.Number(),
    title: Type.String(),
    users: Type.Array(User()),
  })

export type Group = Static<ReturnType<typeof Group>>

console.log(User())
