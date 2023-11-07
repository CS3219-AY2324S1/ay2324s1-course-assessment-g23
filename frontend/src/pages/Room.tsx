import { useState } from 'react'
import { useNavigate } from 'react-router'
import ChatBox from '../components/ChatBox/ChatBox.tsx'
import CodeEditor from '../components/CollaborationRoom/CodeEditor'
import CodeExecutor from '../components/CollaborationRoom/CodeExecutor.tsx'
import ConfirmationBox from '../components/CollaborationRoom/ConfirmationBox.tsx'
import QuestionDescription from '../components/CollaborationRoom/QuestionDescription.tsx'
import RoomNavBar from '../components/CollaborationRoom/RoomNavBar.tsx'
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
            <RoomNavBar onExitClick={() => setShowConfirmation(true)} />
            <div className='horizontal-split-container'>
                <div
                    className='pane'
                    style={{ flex: '1', marginRight: '10px', width: '50%', paddingBottom: '50px' }}
                >
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
