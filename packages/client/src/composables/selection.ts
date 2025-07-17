import { Ref, ShallowRef, shallowRef } from 'vue'
import _ from 'lodash'

type SelectionValue<T, M> = M extends false
  ? T
  : T extends (infer R)[]
  ? R | T
  : never

type SelectionState<T, M> = M extends true ? T : T | null

export default function useSelection<
  T extends M extends true ? any[] : any,
  M extends boolean = T extends any[] ? true : false,
>(
  init: T | Ref<T | null> | null,
  props?: { many?: M; matcher?: (value: any, other: any) => boolean },
): {
  state: ShallowRef<SelectionState<T, M>>
  select: (value?: SelectionValue<T, M>) => void
  toggle: (value?: SelectionValue<T, M>) => void
  deselect: (value?: SelectionValue<T, M>) => void
  isActive: (value?: SelectionValue<T, M>) => boolean
} {
  const state = shallowRef<any>(init)

  const many = props?.many ?? Array.isArray(state.value)
  const matcher = props?.matcher || _.isEqual

  function select(value: any) {
    if (typeof value === 'undefined') {
      if (typeof state.value === 'boolean') {
        state.value = true
      }
    } else if (many) {
      state.value = _.uniqWith(
        _.concat(state.value, _.castArray(value)),
        matcher,
      )
    } else {
      state.value = value
    }
  }

  function toggle(value: any) {
    if (typeof value === 'undefined') {
      if (typeof state.value === 'boolean') {
        state.value = !state.value
      }
    } else if (many) {
      state.value = _.xorWith(state.value, _.castArray(value), matcher)
    } else {
      state.value = matcher(state.value, value) ? null : value
    }
  }

  function deselect(value?: any) {
    if (many) {
      if (typeof value === 'undefined') {
        state.value = []
      } else {
        state.value = _.differenceWith(state.value, _.castArray(value), matcher)
      }
    } else {
      if (typeof value === 'undefined' || matcher(state.value, value)) {
        state.value = null
      }
    }
  }

  function isActive(value: any): boolean {
    if (typeof value === 'undefined') {
      return typeof state.value === 'boolean' ? state.value : false
    }

    if (many) {
      return !_.differenceWith(_.castArray(value), state.value, matcher).length
    }

    return matcher(state.value, value)
  }

  return { state, select, deselect, toggle, isActive }
}
