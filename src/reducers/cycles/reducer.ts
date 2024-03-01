import { ActionTypes } from './actions'
import { produce } from 'immer'

export interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptDate?: Date
  finishedDate?: Date
}

interface CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
}

export function CyclesReducer(state: CyclesState, action: any) {
  switch (action.type) {
    case ActionTypes.ADD_NEW_CYCLE:
      // return {
      //   ...state,
      //   cycles: [...state.cycles, action.payload.newCycle],
      //   activeCycleId: action.payload.newCycle.id,
      // }

      return produce(state, (draft) => {
        draft.cycles.push(action.payload.newCycle)
        draft.activeCycleId = action.payload.newCycle.id
      })
    case ActionTypes.INTERRUPT_CURRENT_CYCLE: {
      // return {
      //   ...state,
      //   cycles: [
      //     state.cycles.map((cycle) => {
      //       if (cycle.id === state.activeCycleId) {
      //         return { ...cycle, interruptDate: new Date() }
      //       }
      //       return cycle
      //     }),
      //   ],
      //   activeCycleId: null,
      // }

      const currentCycleIndex = state.cycles.findIndex(
        (cycle) => cycle.id === state.activeCycleId,
      )

      if (currentCycleIndex < 0) {
        return state
      }

      return produce(state, (draft) => {
        draft.activeCycleId = null
        draft.cycles[currentCycleIndex].interruptDate = new Date()
      })
    }
    case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED: {
      // return {
      //   ...state,
      //   cycles: [
      //     state.cycles.map((cycle) => {
      //       if (cycle.id === state.activeCycleId) {
      //         return { ...cycle, finishedDate: new Date() }
      //       }
      //       return cycle
      //     }),
      //   ],
      //   activeCycleId: null,
      // }

      const currentCycleIndex = state.cycles.findIndex(
        (cycle) => cycle.id === state.activeCycleId,
      )

      if (currentCycleIndex < 1) {
        return state
      }

      return produce(state, (draft) => {
        draft.cycles[currentCycleIndex].finishedDate = new Date()
        draft.activeCycleId = null
      })
    }
    default:
      return state
  }
}
