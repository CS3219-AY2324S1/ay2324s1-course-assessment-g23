import { Add, Circle, Remove } from '@mui/icons-material'
import { motion, useAnimation } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { useSessionDetails } from '../../stores/sessionStore.ts'
import { useUser } from '../../stores/userStore.ts'
import '../../styles/Room.css'
import ChatMessage from './ChatMessage.tsx'

type ChatMessage = {
    sender: string // The sender's name or identifier
    text: string // The message content
}

const ChatBox: React.FC = () => {
    const { roomId } = useParams()
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const { data: sessionDetails } = useSessionDetails()
    const { data: user } = useUser(sessionDetails?.user_id)
    const constraintsRef = useRef(null)
    const [formValue, setFormValue] = useState('')
    const [isMinimized, setIsMinimized] = useState(true)
    const chatHeaderControls = useAnimation()
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])

    useEffect(() => {
        const socket = new WebSocket(
            `ws://localhost:8000/ws/communication/${roomId}/${user?.username}`
        )
        setSocket(socket)

        return () => {
            socket.close()
        }
    }, [])

    useEffect(() => {
        if (socket == null) return

        socket.onopen = () => {
            console.log('WebSocket connection is open')
        }

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data)

            if (data.event == 'receive-message') {
                const text = data.message
                const sender_id = data.sender
                const newMessage = { sender: sender_id, text: text }
                setChatMessages((prevChatMessages) => [...prevChatMessages, newMessage])
            }
        }
    }, [socket])

    const chatBoxVariants = {
        minimized: { height: '50px' },
        expanded: { height: '500px' },
    }

    const sendMessage = (event: React.FormEvent) => {
        event.preventDefault()
        if (!socket) return // Ensure the socket is available

        // Create the payload in the required format
        const payload = JSON.stringify({
            event: 'send-message',
            sender: user?.username,
            message: formValue,
        })

        // Send the message through the WebSocket
        socket.send(payload)

        setChatMessages((prevChatMessages) => [
            ...prevChatMessages,
            { sender: user?.username as string, text: formValue } as ChatMessage,
        ])

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
                        {chatMessages.map((message, index) => (
                            <ChatMessage key={index} text={message.text} sender={message.sender} />
                        ))}
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
