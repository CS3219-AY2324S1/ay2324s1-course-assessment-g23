import { Error } from '@mui/icons-material'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import Loader from '../LoadingAnimation/Loader.tsx'

interface EditProfileProps {
    onClose: () => void
    onExit: () => void
}

const ConfirmationBox: React.FC<EditProfileProps> = ({ onClose, onExit }) => {
    const [isExiting, setIsExiting] = useState(false)

    const onRoomExit = () => {
        setIsExiting(true)
        onExit()
    }

    return (
        <div className='dark-overlay' style={{ zIndex: 4 }}>
            <motion.div
                className='box-shadow'
                style={{
                    backgroundColor: '#303030',
                    borderRadius: '15px',
                    width: '400px',
                    height: '200px',
                    padding: '20px',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                    isExiting
                        ? { opacity: 1, width: '300px', height: '250px' }
                        : { opacity: 1, scale: 1 }
                }
                transition={{ duration: 0.3 }}
            >
                {isExiting ? (
                    <motion.div
                        style={{
                            padding: '30px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Loader />
                        <h2 style={{ marginTop: '70px' }}>Redirecting...</h2>
                    </motion.div>
                ) : (
                    <>
                        <span style={{ display: 'flex', alignItems: 'center', height: '50px' }}>
                            <Error sx={{ marginRight: '10px', color: '#febf1d', height: '20px' }} />
                            <h3 style={{ margin: '0', display: 'flex' }}>Exit room</h3>
                        </span>
                        <div>You would not be able to go back to this room once you exit.</div>
                        <span
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                marginTop: '25px',
                            }}
                        >
                            <button
                                style={{ backgroundColor: '#fe375f', marginRight: '5px' }}
                                onClick={onRoomExit}
                            >
                                Exit
                            </button>
                            <button style={{ backgroundColor: 'transparent' }} onClick={onClose}>
                                Cancel
                            </button>
                        </span>
                    </>
                )}
            </motion.div>
        </div>
    )
}

export default ConfirmationBox
