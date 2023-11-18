import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AlertMessage from '../components/AlertMessage'
import { useLoginUser } from '../stores/sessionStore'
import { useCurrentUser } from '../stores/userStore'
import '../styles/LoginPage.css'

const Login = () => {
    const { data: user, isFetching: isFetchingCurrentUser } = useCurrentUser()
    const loginUserMutation = useLoginUser()
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    let location = useLocation()

    // Redirect if already logged in.
    useEffect(() => {
        const isLoggedIn = user !== null
        if (isLoggedIn && !isFetchingCurrentUser) navigate('/questions')
    }, [user, isFetchingCurrentUser, navigate])

    const handleLogin = async () => {
        await loginUserMutation.mutateAsync({ username, password })
    }

    return (
        <motion.div
            key='Login'
            initial={{ x: '50vw' }}
            animate={{ x: 0 }}
            exit={{ x: '-90vw' }}
            transition={{ duration: 0.3 }}
        >
            <span className='home-page-container'>
                <div className='info-container'>
                    <h1>Welcome to PeerPrep!</h1>
                    <h3>
                        Level up your coding skills with a variety of challenging questions.
                        Practice with peers and excel together.
                    </h3>
                </div>
                <div className='login-container'>
                    <img src='../../peerprep.png' width='80' height='80' />
                    <h2>Login to your account</h2>
                    <form className='login-form' onSubmit={(e) => e.preventDefault()}>
                        <input
                            placeholder='Username'
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                        />
                        <input
                            placeholder='Password'
                            type='password'
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                        <button onClick={handleLogin}>Log in</button>
                        <h4 style={{ textAlign: 'left', display: 'inline-block' }}>
                            Don't have an account?&nbsp;
                        </h4>
                        <Link to='/signup'>Sign up</Link>
                    </form>
                </div>
            </span>
            {loginUserMutation.isError && (
                <AlertMessage variant='error'>
                    <h4>Oops! {loginUserMutation.error.detail}</h4>
                </AlertMessage>
            )}
            {location.state === 'signup' && (
                <AlertMessage variant='success'>
                    <h4>Sign up successful!</h4>
                </AlertMessage>
            )}
        </motion.div>
    )
}

export default Login
