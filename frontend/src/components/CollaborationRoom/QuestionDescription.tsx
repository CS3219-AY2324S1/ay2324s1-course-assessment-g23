import React from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import useGlobalState, { useQuestion } from '../../stores/questionStore'

const QuestionDescription: React.FC = () => {
    const { questionId } = useGlobalState()
    const { data: question } = useQuestion(questionId)
    // const easyQuestions = questions.filter((question) => question.complexity === 'Easy')
    // const randomQuestion = easyQuestions[Math.floor(Math.random() * easyQuestions.length)]

    return (
        <div
            style={{
                padding: '10px 20px',
                width: '100%',
                height: '100%',
                overflow: 'scroll',
            }}
        >
            <h2 style={{ margin: '0', fontWeight: 'normal', fontSize: '1.5rem' }}>
                {question?.title}
            </h2>
            <h2
                className={`complexity-color-${question?.complexity}`}
                style={{ margin: '0', fontSize: '1.25rem' }}
            >
                {question?.complexity}
            </h2>
            <Markdown className='markdown' remarkPlugins={[remarkGfm]}>
                {question?.description}
            </Markdown>
        </div>
    )
}

export default QuestionDescription
