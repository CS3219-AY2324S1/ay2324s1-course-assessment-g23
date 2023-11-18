import { Visibility, VisibilityOff } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { ChangeEvent, FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserSignupDetails } from '../api/users.ts'
import AlertMessage from '../components/AlertMessage.tsx'
import { useSignupUser } from '../stores/sessionStore.ts'
import '../styles/SignupPage.css'

const Signup = () => {
    const signupUserMutation = useSignupUser()
    const [addNewUser, setAddNewUser] = useState<UserSignupDetails>({
        username: '',
        password: '',
        email: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [emailError, setEmailError] = useState('')
    const navigate = useNavigate()
    const validEmailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!validateEmail(addNewUser.email)) {
            setEmailError('Please enter a valid email address.')
            return
        }
        await signupUserMutation.mutateAsync(addNewUser)
        navigate('/', { state: 'signup' })
    }

    const validateEmail = (email: string) => {
        return String(email).toLowerCase().match(validEmailRegex)
    }

    const handleAddUserChange = (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target
        setAddNewUser({
            ...addNewUser,
            [name]: value,
        })
        if (event.target.name === 'email') setEmailError('')
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <motion.div
            key='Signup'
            initial={{ x: '70vw' }}
            animate={{
                x: 0,
                transition: {
                    type: 'spring',
                    stiffness: 100,
                    damping: 10,
                    mass: 0.5,
                    bounce: 0.1,
                },
            }}
            exit={{ x: '-70vw' }}
            transition={{ duration: 0.3 }}
        >
            <div className='signup-page'>
                <div className='signup-box'>
                    <img src='../../peerprep.png' width='80' height='80' alt='PeerPrep Logo' />
                    <h3>Sign up for PeerPrep and enhance your coding skills with your peers.</h3>
                    <form onSubmit={handleSignup}>
                        <input
                            name='username'
                            required
                            placeholder='Username'
                            onChange={handleAddUserChange}
                            value={addNewUser.username}
                        />
                        <div className='password-container'>
                            <input
                                name='password'
                                type={showPassword ? 'text' : 'password'}
                                required
                                placeholder='Password'
                                onChange={handleAddUserChange}
                                value={addNewUser.password}
                            />
                            <button type='button' onClick={toggleShowPassword}>
                                {showPassword ? (
                                    <Visibility fontSize={'small'} />
                                ) : (
                                    <VisibilityOff fontSize={'small'} />
                                )}
                            </button>
                        </div>

                        <input
                            name='email'
                            required
                            placeholder='Email'
                            onChange={handleAddUserChange}
                            value={addNewUser.email}
                        />
                        <button>Sign up</button>
                        <h4 style={{ textAlign: 'left', display: 'inline-block' }}>
                            Have an account?&nbsp;
                        </h4>
                        <Link to='/'>Log in</Link>
                    </form>
                    {emailError && (
                        <AlertMessage variant='error'>
                            <h4>{emailError}</h4>
                        </AlertMessage>
                    )}
                </div>
                {signupUserMutation.isError && (
                    <AlertMessage variant='error'>
                        <h4>Oops! {signupUserMutation.error.detail}</h4>
                    </AlertMessage>
                )}
            </div>
        </motion.div>
    )
}

export default Signup
