import { useState } from 'react'
import { useNavigate } from 'react-router'
import ChatBox from '../components/ChatBox/ChatBox.tsx'
import CodeEditor from '../components/CollaborationRoom/CodeEditor'
import CodeExecutor from '../components/CollaborationRoom/CodeExecutor.tsx'
import ConfirmationBox from '../components/CollaborationRoom/ConfirmationBox.tsx'
import QuestionDescription from '../components/CollaborationRoom/QuestionDescription.tsx'
import '../styles/Room.css'

export const Room = () => {
    const [showConfirmation, setShowConfirmation] = useState(false)
    const navigate = useNavigate()

    const handleExit = () => {
        setTimeout(() => {
            navigate('/questions')
        }, 2000) // 2000 milliseconds (2 seconds) delay
    }

    return (
        <div>
            <ChatBox />
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
            <div className='horizontal-split-container'>
                <div className='pane' style={{ flex: '1', marginRight: '10px' }}>
                    <QuestionDescription />
                </div>
                <div className='vertical-split-container'>
                    <div className='editor-container'>
                        <CodeEditor />
                    </div>
                    <CodeExecutor />
                </div>
            </div>
        </div>
    )
}

export default Room
