import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MatchBar from '../components/Matching/MatchBar.tsx'
import Navbar from '../components/Navbar.tsx'
import QuestionTable from '../components/QuestionTable/QuestionTable.tsx'
import { TimerProvider } from '../components/TimerProvider.tsx'
import { useCurrentUser } from '../stores/userStore.ts'

const Questions = () => {
    const { data: user, isFetching: isFetchingCurrentUser } = useCurrentUser()

    const navigate = useNavigate()

    // Redirect if not logged in.
    useEffect(() => {
        const isNotLoggedIn = user === null
        if (isNotLoggedIn && !isFetchingCurrentUser) navigate('/')
    }, [user, isFetchingCurrentUser, navigate])

    return (
        <>
            <Navbar />
            <div className='question-page-container'>
                <TimerProvider>
                    <MatchBar />
                </TimerProvider>
                <QuestionTable />
            </div>
        </>
    )
}

export default Questions
