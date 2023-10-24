import { Add, Circle, Remove } from '@mui/icons-material'
import { motion, useAnimation } from 'framer-motion'
import React, { useRef, useState } from 'react'
import '../../styles/Room.css'
import ChatMessage from './ChatMessage.tsx'

const ChatBox: React.FC = () => {
    const constraintsRef = useRef(null)
    const [formValue, setFormValue] = useState('')
    const [isMinimized, setIsMinimized] = useState(true)
    const chatHeaderControls = useAnimation()

    const chatBoxVariants = {
        minimized: { height: '50px' },
        expanded: { height: '500px' },
    }

    const sendMessage = (event: React.FormEvent) => {
        event.preventDefault()
        //insert api call
        setFormValue('')
    }

    const toggleMinimize = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsMinimized(!isMinimized)
    }

    const handleHeaderClick = () => {
        if (isMinimized) {
            chatHeaderControls.start({ y: -10 }).then(() => {
                chatHeaderControls.start({ y: 0 })
            })
        }
    }

    return (
        <motion.div ref={constraintsRef}>
            <motion.div
                className='chat-box'
                style={{ display: 'flex' }}
                animate={isMinimized ? 'minimized' : 'expanded'}
                variants={chatBoxVariants}
                drag='x'
                dragElastic={false}
                dragMomentum={false}
                dragConstraints={constraintsRef}
            >
                <motion.div
                    style={{ alignItems: 'center', width: '100%' }}
                    animate={chatHeaderControls}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleHeaderClick}
                >
                    <div className='chat-header'>
                        {isMinimized ? (
                            <Add
                                sx={{ marginRight: 'auto', cursor: 'pointer' }}
                                onClick={toggleMinimize}
                            />
                        ) : (
                            <Remove
                                sx={{ marginRight: 'auto', cursor: 'pointer' }}
                                onClick={toggleMinimize}
                            />
                        )}
                        <Circle sx={{ alignSelf: 'right', color: '#00b8a2', fontSize: '10px' }} />
                        <h3 style={{ color: 'white', margin: '12px' }}>Chat Room</h3>
                    </div>
                    <div className='chat-background'>
                        <ChatMessage text={'hello'} sender={'admin'} />
                    </div>
                    <div style={{ backgroundColor: 'white', padding: '10px' }}>
                        <form onSubmit={sendMessage}>
                            <input
                                value={formValue}
                                onChange={(e) => setFormValue(e.target.value)}
                                placeholder='Send a message'
                            />

                            <button type='submit' disabled={!formValue}>
                                Send
                            </button>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}

export default ChatBox
