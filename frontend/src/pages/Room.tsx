import { useState } from 'react'
import { useNavigate } from 'react-router'
import ChatBox from '../components/ChatBox/ChatBox.tsx'
import ChatTab from '../components/ChatBox/ChatTab.tsx'
import CodeEditor from '../components/CollaborationRoom/CodeEditor'
import ConfirmationBox from '../components/CollaborationRoom/ConfirmationBox.tsx'
import QuestionDescription from '../components/CollaborationRoom/QuestionDescription.tsx'
import '../styles/Room.css'

export const Room = () => {
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [openChatBox, setOpenChatBox] = useState(false)
    const [openChatTab, setOpenChatTab] = useState(true)
    const navigate = useNavigate()

    const handleExit = () => {
        setTimeout(() => {
            navigate('/questions')
        }, 2000) // 2000 milliseconds (2 seconds) delay
    }

    const maximiseChat = () => {
        setOpenChatBox(true)
        setOpenChatTab(false)
    }

    const minimiseChat = () => {
        setOpenChatBox(false)
        setOpenChatTab(true)
    }

    return (
        <div>
            {openChatBox && <ChatBox onMinimise={minimiseChat} />}
            {openChatTab && <ChatTab onMaximise={maximiseChat} />}
            {showConfirmation && (
                <ConfirmationBox onClose={() => setShowConfirmation(false)} onExit={handleExit} />
            )}
            <nav className='nav' style={{ padding: '8px 20px' }}>
                <h2
                    style={{
                        margin: '0 0 0 2rem',
                        padding: '0',
                        fontWeight: '500',
                        fontSize: '2rem',
                    }}
                >
                    PeerPrep
                </h2>
                <button
                    style={{ backgroundColor: '#fe375f', width: '200px', margin: '0' }}
                    onClick={() => setShowConfirmation(true)}
                >
                    Exit Room
                </button>
            </nav>
            <div className='split-container' style={{ padding: '20px' }}>
                <div className='pane' style={{ backgroundColor: '#303030', marginRight: '10px' }}>
                    <QuestionDescription />
                </div>
                <div className='pane' style={{ backgroundColor: '#303030', marginLeft: '10px' }}>
                    <CodeEditor />
                </div>
            </div>
        </div>
    )
}

export default Room
