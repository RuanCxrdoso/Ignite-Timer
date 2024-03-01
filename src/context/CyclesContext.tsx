import { ReactNode, createContext, useReducer, useState } from 'react'
import { Cycle, CyclesReducer, ActionTypes } from '../reducers/cycles'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface CycleContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  interruptCurrentCycle: () => void
}

interface CyclesContextProviderProps {
  children: ReactNode
}

export const CyclesContext = createContext({} as CycleContextType)

// const reducer = (state: CyclesState, action: any) => {
//   switch (action.type) {
//     case 'ADD_NEW_CYCLE':
//       return {
//         ...state,
//         cycles: [...state.cycles, action.payload.newCycle],
//         activeCycleId: action.payload.newCycle.id,
//       }
//     case 'INTERRUPT_CURRENT_CYCLE':
//       return {
//         ...state,
//         cycles: [
//           state.cycles.map((cycle) => {
//             if (cycle.id === state.activeCycleId) {
//               return { ...cycle, interruptDate: new Date() }
//             }
//             return cycle
//           }),
//         ],
//         activeCycleId: null,
//       }
//     case 'MARK_CURRENT_CYCLE_AS_FINISHED':
//       return {
//         ...state,
//         cycles: [
//           state.cycles.map((cycle) => {
//             if (cycle.id === state.activeCycleId) {
//               return { ...cycle, finishedDate: new Date() }
//             }
//             return cycle
//           }),
//         ],
//         activeCycleId: null,
//       }
//     default:
//       return state
//   }
// }

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(CyclesReducer, {
    cycles: [],
    activeCycleId: null,
  })

  const { cycles, activeCycleId } = cyclesState

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch({
      type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED,
      payload: {
        activeCycle,
      },
    })
  }

  function createNewCycle(data: CreateCycleData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch({
      type: ActionTypes.ADD_NEW_CYCLE,
      payload: {
        newCycle,
      },
    })
    setAmountSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    dispatch({
      type: ActionTypes.INTERRUPT_CURRENT_CYCLE,
      payload: {
        activeCycleId,
      },
    })
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
