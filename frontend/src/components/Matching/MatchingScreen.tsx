import React, { useEffect } from 'react'
import type { Complexity } from '../../api/questions.ts'
import Loader from '../LoadingAnimation/Loader.tsx'
import { useTimer } from '../TimerProvider.tsx'

type MatchingScreenProps = {
    difficulty: Complexity
    onMatchExit: () => void
    onMinimise: () => void
}
const MatchingScreen: React.FC<MatchingScreenProps> = ({
    difficulty,
    onMatchExit: onMatchExit,
    onMinimise: onMinimise,
}) => {
    const { seconds, startTimer, resetTimer } = useTimer()

    useEffect(() => {
        startTimer()
    }, [startTimer])

    const handleMatchExit = () => {
        resetTimer()
        onMatchExit()
    }

    function formatTime(totalSeconds: number) {
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }

    return (
        <div
            className='dark-overlay'
            style={{ backgroundColor: '#242424', opacity: ' 100%', zIndex: '2' }}
        >
            <div className='home-page-container' style={{ opacity: '100%' }}>
                <h2 style={{ marginBottom: '2rem' }}>Finding a Match...</h2>
                <Loader />
                <h1 style={{ marginTop: '5rem' }}>{formatTime(seconds)}</h1>
                <h2 style={{ marginTop: '2rem' }}>
                    Selected difficulty:
                    <span className={`complexity-color-${difficulty}`}> {difficulty}</span>
                </h2>

                <button onClick={handleMatchExit} style={{ backgroundColor: '#ff2945' }}>
                    Exit matchmaking
                </button>
                <button onClick={onMinimise}>Minimise</button>
            </div>
        </div>
    )
}

export default MatchingScreen
