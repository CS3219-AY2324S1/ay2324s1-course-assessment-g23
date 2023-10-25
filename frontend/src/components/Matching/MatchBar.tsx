import { Info, Star, Whatshot } from '@mui/icons-material'
import { Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import type { Complexity } from '../../api/questions.ts'
import { useCancelQueue, useJoinQueue } from '../../stores/matchingStore.ts'
import { useSessionDetails } from '../../stores/sessionStore.ts'
import { useUser } from '../../stores/userStore.ts'
import '../../styles/MatchBar.css'
import AlertMessage from '../AlertMessage.tsx'
import { useTimer } from '../TimerProvider.tsx'
import MatchSuccess from './MatchSuccess.tsx'
import MatchingScreen from './MatchingScreen.tsx'
import MatchingStatusBar from './MatchingStatusBar.tsx'

const tooltipDescription =
    'Select a difficulty level and get matched with another user. ' +
    'Together, you both will collaboratively attempt a question of the chosen difficulty.'
const MatchBar: React.FC = () => {
    const { resetTimer } = useTimer()
    const { data: sessionDetails } = useSessionDetails()
    const { data: user } = useUser(sessionDetails?.user_id)
    const joinQueueMutation = useJoinQueue()
    const cancelQueueMutation = useCancelQueue()
    const {
        isLoading: isFindingMatch,
        isSuccess: isMatchSuccess,
        isError: isMatchError,
    } = joinQueueMutation

    const [difficulty, setDifficulty] = useState<Complexity>('Easy')
    const [isMatchingScreenVisible, setMatchingScreenVisible] = useState(false)
    const [isMatchingStatusBarVisible, setMatchingStatusBarVisible] = useState(false)

    useEffect(() => {
        if (!isFindingMatch) {
            setMatchingScreenVisible(false)
            setMatchingStatusBarVisible(false)
            resetTimer()
        }
    }, [isFindingMatch])

    const startFindMatch = (difficulty: Complexity) => {
        joinQueueMutation.mutateAsync(difficulty)
        setMatchingScreenVisible(true)
        setDifficulty(difficulty)
    }

    const stopFindMatch = () => {
        cancelQueueMutation.mutateAsync()
    }

    const handleMinimise = () => {
        setMatchingScreenVisible(false)
        setMatchingStatusBarVisible(true)
    }

    const handleMaximise = () => {
        setMatchingScreenVisible(true)
        setMatchingStatusBarVisible(false)
    }

    return (
        <>
            <span className='matchbar-container'>
                <div className='welcome'>
                    <h2>Welcome back, {user?.username}!</h2>
                </div>
                <div className='match'>
                    {!isFindingMatch && (
                        <>
                            <div className='match-title'>
                                <h2>Find a Match</h2>
                                <Whatshot fontSize='large' />
                                <Tooltip title={tooltipDescription} style={{ fontSize: '1.5rem' }}>
                                    <Info style={{ opacity: '0.5', marginLeft: '0.5rem' }} />
                                </Tooltip>
                            </div>
                            <div className='match-button-container'>
                                <button
                                    className='match-button'
                                    id='easy'
                                    onClick={() => startFindMatch('Easy')}
                                >
                                    <div className='icon-text-wrapper'>
                                        <Star />
                                        Easy
                                    </div>
                                </button>
                                <button
                                    className='match-button'
                                    id='medium'
                                    onClick={() => startFindMatch('Medium')}
                                >
                                    <Star />
                                    <Star />
                                    Medium
                                </button>
                                <button
                                    className='match-button'
                                    id='hard'
                                    onClick={() => startFindMatch('Hard')}
                                >
                                    <Star />
                                    <Star />
                                    <Star />
                                    Hard
                                </button>
                            </div>
                        </>
                    )}
                    {isMatchingStatusBarVisible && (
                        <MatchingStatusBar
                            difficulty={difficulty}
                            onMatchExit={() => stopFindMatch()}
                            onMaximise={handleMaximise}
                        />
                    )}
                </div>
            </span>
            {isMatchingScreenVisible && (
                <MatchingScreen
                    difficulty={difficulty}
                    onMatchExit={() => stopFindMatch()}
                    onMinimise={handleMinimise}
                />
            )}
            {isMatchSuccess && <MatchSuccess />}
            {isMatchError && (
                <AlertMessage variant='error'>
                    <h4>{joinQueueMutation.error.detail}</h4>
                </AlertMessage>
            )}
        </>
    )
}

export default MatchBar
