import React from 'react'
import {useTimer} from "./TimerProvider.tsx";
import '../styles/Match.css'
import type { Complexity } from '../api/questions.ts'


type MatchingScreenProps = {
    difficulty: Complexity
    onMatchExit: () => void
    onMaximise: () => void
}
const MatchingStatusBar: React.FC<MatchingScreenProps> = ({
    difficulty,
    onMatchExit: onMatchExit,
    onMaximise: onMaximise
}) => {
    const { seconds, resetTimer } = useTimer();

    const handleMatchExit = () => {
        resetTimer();
        onMatchExit();
    };

    function formatTime(totalSeconds : number) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    return (
        <div className="matchmaking-bar">
            <div>
                <h2>Finding a Match...</h2>
                <button className="exit-button" onClick={handleMatchExit}>Exit Matchmaking</button>
                <button onClick={onMaximise}>Show Matchmaking Screen</button>
            </div>

            <div className="timer-circle">
                <span>{formatTime(seconds)}</span>
            </div>
        </div>
    )
}

export default MatchingStatusBar
