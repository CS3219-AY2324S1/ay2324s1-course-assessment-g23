import React from 'react'
import '../../styles/Match.css'
import TimerCircle from '../LoadingAnimation/TimerCircle.tsx'
import { useTimer } from '../TimerProvider.tsx'

type MatchingScreenProps = {
    onMatchExit: () => void
    onMaximise: () => void
}
const MatchingStatusBar: React.FC<MatchingScreenProps> = ({
    onMatchExit: onMatchExit,
    onMaximise: onMaximise,
}) => {
    const { seconds, resetTimer } = useTimer()

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
        <div className='matchmaking-bar'>
            <div>
                <h2>Finding a Match...</h2>
                <button className='exit-button' onClick={handleMatchExit}>
                    Exit Matchmaking
                </button>
                <button className='maximise-button' onClick={onMaximise}>
                    Show Matchmaking Screen
                </button>
            </div>

            <TimerCircle time={formatTime(seconds)} />
        </div>
    )
}

export default MatchingStatusBar
