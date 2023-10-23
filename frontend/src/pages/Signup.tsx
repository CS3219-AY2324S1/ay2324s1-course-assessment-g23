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
    const navigate = useNavigate()

    const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        await signupUserMutation.mutateAsync(addNewUser)
        navigate('/')
    }

    const handleAddUserChange = (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target
        setAddNewUser({
            ...addNewUser,
            [name]: value,
        })
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
                        <input
                            name='password'
                            required
                            placeholder='Password'
                            onChange={handleAddUserChange}
                            value={addNewUser.password}
                        />
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
