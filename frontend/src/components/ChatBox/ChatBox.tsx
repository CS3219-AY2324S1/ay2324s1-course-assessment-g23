import { Circle, Remove } from '@mui/icons-material'
import { motion } from 'framer-motion'
import React, { useRef, useState } from 'react'
import '../../styles/Room.css'
import ChatMessage from './ChatMessage.tsx'

interface ChatBoxProps {
    onMinimise: () => void
}

const ChatBox: React.FC<ChatBoxProps> = ({ onMinimise }) => {
    const constraintsRef = useRef(null)
    const [formValue, setFormValue] = useState('')

    const sendMessage = () => {
        //insert api call
    }

    return (
        <motion.div ref={constraintsRef}>
            <motion.div
                className='chat-box'
                style={{ display: 'flex' }}
                drag='x'
                dragElastic={false}
                dragMomentum={false}
                dragConstraints={constraintsRef}
            >
                <div style={{ alignItems: 'center', width: '100%' }}>
                    <div className='chat-header'>
                        <Remove sx={{ marginRight: 'auto' }} onClick={onMinimise} />
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
