export type Filter<T, E> = T extends E ? T : never

export type Pull<T, E> = T extends E ? never : T

export type Defined<T> = T extends undefined ? never : T

export type PickBy<T, M> = Pick<
  T,
  { [K in keyof T]: T[K] extends M ? K : never }[keyof T]
>

export type OmitBy<T, M> = Omit<
  T,
  { [K in keyof T]: T[K] extends M ? K : never }[keyof T]
>

export type PickOptional<T> = Pick<
  T,
  { [K in keyof T]: T[K] extends Defined<T[K]> ? never : K }[keyof T]
>

export type PickRequired<T> = Pick<
  T,
  { [K in keyof T]: T[K] extends Defined<T[K]> ? K : never }[keyof T]
>

export type PickPartial<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> &
  Partial<Pick<T, K>>

export type OmitPartial<T, K extends keyof T> = Omit<T, Exclude<keyof T, K>> &
  Partial<Omit<T, K>>

export type DeepPartial<T> = T extends Record<string, any>
  ? Partial<{
      [K in keyof T]: DeepPartial<T[K]>
    }>
  : T extends Array<infer X>
  ? Array<DeepPartial<X>>
  : T

export type UnionToIntersection<T> = (
  T extends any ? (x: T) => any : never
) extends (x: infer R) => any
  ? R
  : never
