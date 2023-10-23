import React from 'react'
import '../../styles/Room.css'

interface ChatMessageProps {
    text: string
    sender: string
}

const ChatMessage: React.FC<ChatMessageProps> = ({ text, sender }) => {
    return (
        <div className='message-item'>
            <div className='text-box'>{text}</div>
            <div className='sender-info'>{sender}</div>
        </div>
    )
}

export default ChatMessage
