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
    const userid = user?.username
    return (
        <div className={`message-item-${userid === sender ? 'sent' : 'received'}`}>
            <div className={`text-box-${userid === sender ? 'sent' : 'received'}`}>{text}</div>
            {userid !== sender && <div className='sender-info'>{sender}</div>}
        </div>
    )
}

export default ChatMessage
