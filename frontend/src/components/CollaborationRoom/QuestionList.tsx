import { Close } from '@mui/icons-material'
import { motion } from 'framer-motion'
import React from 'react'
import { Question } from '../../api/questions.ts'
import useGlobalState, { useAllQuestions } from '../../stores/questionStore.ts'
import '../../styles/QuestionList.css'

interface QuestionListProps {
    onClose: () => void
}

const QuestionList: React.FC<QuestionListProps> = ({ onClose }) => {
    const { data: questions } = useAllQuestions()
    const { questionId, setQuestionId } = useGlobalState()

    const handleQuestionClick = (questionId: string) => {
        setQuestionId(questionId)
    }

    return (
        <div className='dark-overlay' style={{ zIndex: '2' }}>
            <motion.div
                className='question-list-container'
                key='question-list'
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.3 }}
            >
                <div className='question-list-title'>
                    <h2>Question List</h2>
                    <div style={{ cursor: 'pointer' }} onClick={onClose}>
                        <Close />
                    </div>
                </div>
                <ul className='question-list'>
                    {questions?.map((question) => (
                        // <QuestionRow key={question.question_id} question={question} />
                        <li key={question?.question_id}>
                            <button onClick={() => handleQuestionClick(question?.question_id)}>
                                {question?.title}
                            </button>
                        </li>
                    ))}
                </ul>
            </motion.div>
        </div>
    )
}

interface QuestionRowProps {
    question: Question
}

const QuestionRow: React.FC<QuestionRowProps> = ({ question }) => {
    return (
        <li className='question-row'>
            <p>{question.title}</p>
            <p className={`complexity-color-${question.complexity}`}>{question.complexity}</p>
        </li>
    )
}

export default QuestionList
