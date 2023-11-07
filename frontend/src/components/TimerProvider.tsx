import React, {
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'

// Define the type for the context
interface TimerContextType {
    seconds: number
    resetTimer: () => void
    startTimer: () => void
    stopTimer: () => void
}

// Create the context with default values
const TimerContext = createContext<TimerContextType>({
    seconds: 0,
    resetTimer: () => {},
    startTimer: () => {},
    stopTimer: () => {},
})

// Define props type for TimerProvider
interface TimerProviderProps {
    children: ReactNode
}

// Provider component
export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
    const [seconds, setSeconds] = useState<number>(0)
    const [isTimerActive, setIsTimerActive] = useState<boolean>(false)

    const resetTimer = useCallback(() => {
        setSeconds(0)
        setIsTimerActive(false)
    }, [])

    const startTimer = useCallback(() => {
        setIsTimerActive(true)
    }, [])

    const stopTimer = useCallback(() => {
        setIsTimerActive(false)
    }, [])

    useEffect(() => {
        if (isTimerActive) {
            const interval = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds + 1)
            }, 1000)

            return () => clearInterval(interval)
        }
    }, [isTimerActive])

    return (
        <TimerContext.Provider value={{ seconds, resetTimer, startTimer, stopTimer }}>
            {children}
        </TimerContext.Provider>
    )
}

export const useTimer = () => {
    return useContext(TimerContext)
}
