import { Add, Circle } from '@mui/icons-material'
import { motion } from 'framer-motion'
import React, { useRef } from 'react'
import '../../styles/Room.css'

interface ChatTabProps {
    onMaximise: () => void
}

const ChatTab: React.FC<ChatTabProps> = ({ onMaximise: onMaximise }) => {
    const constraintsRef = useRef(null)
    return (
        <motion.div ref={constraintsRef}>
            <motion.div
                className='hidden-chat'
                style={{ display: 'flex' }}
                drag='x'
                dragElastic={false}
                dragMomentum={false}
                dragConstraints={constraintsRef}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Add sx={{ marginRight: 'auto' }} onClick={onMaximise} />
                    <Circle sx={{ alignSelf: 'right', color: '#00b8a2', fontSize: '10px' }} />
                    <h3 style={{ color: 'white', margin: '12px' }}>Chat Room</h3>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default ChatTab
