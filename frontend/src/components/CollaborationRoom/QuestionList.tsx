import { ArrowUpward, Cancel, Close } from '@mui/icons-material'
import { motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { Question } from '../../api/questions.ts'
import {
    filterByCategory,
    filterByComplexity,
    filterBySearchTerm,
    sortItems,
} from '../../api/sortingAndFiltering.ts'
import useGlobalState, { useAllQuestions } from '../../stores/questionStore.ts'
import '../../styles/QuestionList.css'
import DropdownSelect from '../QuestionTable/DropdownSelect.tsx'
import DropdownTabs from '../QuestionTable/DropdownTabs.tsx'

interface QuestionListProps {
    onClose: () => void
    categoriesList: string[]
}

const QuestionList: React.FC<QuestionListProps> = ({ onClose }) => {
    const { data: questions } = useAllQuestions()
    const { questionId, setQuestionId } = useGlobalState()
    const [complexityFilter, setComplexityFilter] = useState<null | 'Easy' | 'Medium' | 'Hard'>(
        null
    )
    const [categoryFilter, setCategoryFilter] = useState<null | string>(null)
    const [searchTerm, setSearchTerm] = useState<string>('')
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [showTopBtn, setShowTopBtn] = useState(false)
    type SortConfig = {
        key: keyof Question
        direction: 'ascending' | 'descending'
    } | null

    const sortConfig: SortConfig = {
        key: 'complexity',
        direction: 'ascending',
    }

    const categoriesList: string[] = [
        'Algorithms',
        'Arrays',
        'Bit Manipulation',
        'Brainteaser',
        'Databases',
        'Data Structures',
        'Recursion',
        'Strings',
    ]

    useEffect(() => {
        const container = containerRef.current
        if (container) {
            const handleScroll = () => {
                if (container.scrollTop > 300) {
                    setShowTopBtn(true)
                } else {
                    setShowTopBtn(false)
                }
            }
            container.addEventListener('scroll', handleScroll)
            return () => {
                container.removeEventListener('scroll', handleScroll)
            }
        }
    }, [])

    const handleQuestionClick = (questionId: string) => {
        setQuestionId(questionId)
        onClose()
    }

    const filteredAndSortedQuestions = React.useMemo(() => {
        let filteredItems = [...questions]
        filteredItems = filterByComplexity(filteredItems, complexityFilter)
        filteredItems = filterByCategory(filteredItems, categoryFilter)
        filteredItems = filterBySearchTerm(filteredItems, searchTerm)
        filteredItems = sortItems(filteredItems, sortConfig)
        return filteredItems
    }, [questions, complexityFilter, categoryFilter, searchTerm])

    const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation()
    }

    const goToTop = () => {
        containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className='dark-overlay' style={{ zIndex: '2' }} onClick={onClose}>
            <motion.div
                className='question-list-container'
                key='question-list'
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.3 }}
                onClick={handleContainerClick}
                ref={containerRef}
            >
                <div className='question-list-title'>
                    <h2>Question List</h2>
                    <div style={{ cursor: 'pointer' }} onClick={onClose}>
                        <Close />
                    </div>
                </div>
                <div className='sort-filter-tab'>
                    <DropdownSelect
                        type='complexity'
                        options={['Easy', 'Medium', 'Hard']}
                        onOptionChange={(selectedComplexity) =>
                            setComplexityFilter(selectedComplexity as 'Easy' | 'Medium' | 'Hard')
                        }
                        defaultOption={'Complexity'}
                    />
                    <DropdownTabs
                        options={categoriesList}
                        onOptionChange={(selectedCategory) => setCategoryFilter(selectedCategory)}
                        defaultOption={'Category'}
                    />
                    <input
                        className='search-box'
                        type='text'
                        placeholder='Search questions'
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                </div>
                <div className='ql-reset-row'>
                    {complexityFilter && (
                        <div
                            className='reset-button'
                            id={complexityFilter}
                            onClick={() => setComplexityFilter(null)}
                        >
                            {complexityFilter}
                            <Cancel fontSize={'small'} sx={{ color: '#c2c2c2' }} />
                        </div>
                    )}

                    {categoryFilter && (
                        <div
                            className='reset-button'
                            id={categoryFilter}
                            onClick={() => setCategoryFilter(null)}
                        >
                            {categoryFilter}
                            <Cancel fontSize={'small'} sx={{ color: '#c2c2c2' }} />
                        </div>
                    )}
                </div>
                <ul className='question-list'>
                    {filteredAndSortedQuestions.length > 0 ? (
                        filteredAndSortedQuestions.map((question) => (
                            <QuestionRow
                                key={question.question_id}
                                question={question}
                                selectedQuestionId={questionId}
                                onClick={() => handleQuestionClick(question?.question_id)}
                            />
                        ))
                    ) : (
                        <div style={{ textAlign: 'center' }}>No results found</div>
                    )}
                </ul>

                {showTopBtn && (
                    <button onClick={goToTop} className='back-to-top'>
                        Back to top
                        <ArrowUpward fontSize={'small'} />
                    </button>
                )}
            </motion.div>
        </div>
    )
}

interface QuestionRowProps {
    question: Question
    selectedQuestionId: string
    onClick: () => void
}

const QuestionRow: React.FC<QuestionRowProps> = ({ question, selectedQuestionId, onClick }) => {
    return (
        <li
            className={question.question_id === selectedQuestionId ? 'question-row-selected' : ''}
            onClick={onClick}
        >
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <p>{question.title}</p>
                </div>
                <div style={{ color: '#c8c8c8', fontSize: '12px' }}>
                    {question.category.replace(', ', ' · ')}
                </div>
            </div>
            <p className={`complexity-color-${question.complexity}`}>{question.complexity}</p>
        </li>
    )
}

export default QuestionList
