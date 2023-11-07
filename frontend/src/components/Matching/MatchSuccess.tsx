import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useMatch } from '../../stores/matchingStore.ts'
import useGlobalState from '../../stores/questionStore.ts'
import { useUser } from '../../stores/userStore.ts'
import Loader from '../LoadingAnimation/Loader.tsx'
import Spinner from '../LoadingAnimation/Spinner.tsx'

const MatchingScreen = () => {
    const { data: match } = useMatch()
    const { data: matchedUser } = useUser(match?.user_id)
    const { questionId, setQuestionId } = useGlobalState()
    const [showMatchFound, setShowMatchFound] = useState(true)
    const [showMatchedUser, setShowMatchedUser] = useState(false)
    const navigate = useNavigate()

    const handleChangeQuestionId = (questionId: string) => {
        setQuestionId(questionId)
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowMatchFound(false)
            setShowMatchedUser(true) // Show the new message after hiding the previous one
        }, 2000) // Hide the Match Found message after 2 seconds

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        // Navigate to room after showing "Match Found" and "Redirecting" messages
        const timer = setTimeout(() => {
            if (match) {
                navigate(`/room/${match.room_id}`)
                handleChangeQuestionId(match?.question_id)
            }
        }, 4000)

        return () => clearTimeout(timer)
    }, [match])

    const fadeInOut = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0, transition: { duration: 0.5 } },
    }

    return (
        <div
            className='dark-overlay'
            style={{ backgroundColor: '#242424', opacity: ' 100%', zIndex: '2' }}
        >
            <div className='home-page-container' style={{ opacity: '100%' }}>
                <AnimatePresence>
                    <div>
                        {showMatchFound && <Spinner text={'Match Found!'} />}
                        {showMatchedUser && (
                            <motion.h2
                                key='matchedUser'
                                initial='initial'
                                animate='animate'
                                variants={fadeInOut}
                                style={{ marginBottom: '2rem' }}
                            >
                                Matched with {matchedUser!.username}
                            </motion.h2>
                        )}
                    </div>
                    <Loader key='loader' />
                    {showMatchedUser && (
                        <motion.h2
                            key='matchedUser'
                            initial='initial'
                            animate='animate'
                            variants={fadeInOut}
                            style={{ marginTop: '5rem' }}
                        >
                            Redirecting to collaboration space...{' '}
                        </motion.h2>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default MatchingScreen
