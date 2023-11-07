import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.tsx'
import UserTable from '../components/UserTable/UserTable.tsx'
import { useCurrentUser } from '../stores/userStore.ts'

const Users = () => {
    const { data: user, isFetching: isFetchingCurrentUser } = useCurrentUser()
    const navigate = useNavigate()

    // Redirect if not logged in.
    useEffect(() => {
        const hasAccessToPage = user !== null && user.role === 'maintainer'
        if (!hasAccessToPage && !isFetchingCurrentUser) navigate('/')
    }, [user, isFetchingCurrentUser, navigate])

    return (
        <>
            <Navbar />
            <UserTable />
        </>
    )
}

export default Users
