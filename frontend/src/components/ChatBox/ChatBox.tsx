import { Add, Circle, Remove } from '@mui/icons-material'
import { motion } from 'framer-motion'
import React, { useRef, useState } from 'react'
import '../../styles/Room.css'
import ChatMessage from './ChatMessage.tsx'

const ChatBox: React.FC = () => {
    const constraintsRef = useRef(null)
    const [formValue, setFormValue] = useState('')
    const [isMinimized, setIsMinimized] = useState(true)

    const chatBoxVariants = {
        minimized: { height: '50px' },
        expanded: { height: '500px' },
    }

    const sendMessage = () => {
        //insert api call
    }

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized)
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
                <div style={{ alignItems: 'center', width: '100%' }}>
                    <div className='chat-header'>
                        {isMinimized ? (
                            <Add sx={{ marginRight: 'auto' }} onClick={toggleMinimize} />
                        ) : (
                            <Remove sx={{ marginRight: 'auto' }} onClick={toggleMinimize} />
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
                </div>
            </motion.div>
        </motion.div>
    )
}

export default ChatBox
