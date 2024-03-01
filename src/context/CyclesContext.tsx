import {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { Cycle, CyclesReducer } from '../reducers/cycles/reducer'
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions'
import { differenceInSeconds } from 'date-fns'

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
  // reducer [estado, função disparadora] = useReducer(reducer, estado inicial, função disparada no inicio do reducer para recupar os dados de outro lugar)
  const [cyclesState, dispatch] = useReducer(
    CyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    (initialState) => {
      const storedStateAsJSON = localStorage.getItem(
        '@ignite-timer:cycles-state-1.0.0',
      )

      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON)
      }

      return initialState
    },
  )

  const { cycles, activeCycleId } = cyclesState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }

    return 0
  })

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
  }

  function createNewCycle(data: CreateCycleData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))
    setAmountSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction())
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
