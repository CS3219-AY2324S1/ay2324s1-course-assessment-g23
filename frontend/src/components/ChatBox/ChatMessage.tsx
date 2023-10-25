import React from 'react'
import { useSessionDetails } from '../../stores/sessionStore.ts'
import { useUser } from '../../stores/userStore.ts'
import '../../styles/Room.css'

interface ChatMessageProps {
    text: string
    sender: string
}

const ChatMessage: React.FC<ChatMessageProps> = ({ text, sender }) => {
    const { data: sessionDetails } = useSessionDetails()
    const { data: user } = useUser(sessionDetails?.user_id)
    // Check if the message sender is the current user
    const isSentByCurrentUser = user && sender === user.username

    return (
        <div className={`message-item-${isSentByCurrentUser ? 'sent' : 'received'}`}>
            <div className={`text-box-${isSentByCurrentUser ? 'sent' : 'received'}`}>{text}</div>
            {!isSentByCurrentUser && <div className='sender-info'>{sender}</div>}
        </div>
    )
}

export default ChatMessage
