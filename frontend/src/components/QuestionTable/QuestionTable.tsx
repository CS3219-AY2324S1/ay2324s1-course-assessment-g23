import { Add, ArrowUpward, Cancel, Error, UnfoldMoreOutlined } from '@mui/icons-material'
import { AnimatePresence, motion } from 'framer-motion'
import React, { FormEvent, Fragment, useEffect, useState } from 'react'
import { type Question } from '../../api/questions.ts'
import {
    createRequestSort,
    filterByCategory,
    filterByComplexity,
    filterBySearchTerm,
    sortItems,
} from '../../api/sortingAndFiltering.ts'
import {
    useAllQuestions,
    useDeleteQuestion,
    useStoreQuestion,
    useUpdateQuestion,
} from '../../stores/questionStore.ts'
import { useCurrentUser } from '../../stores/userStore.ts'
import '../../styles/AlertMessage.css'
import '../../styles/QuestionTable.css'
import AlertMessage from '../AlertMessage.tsx'
import DropdownSelect from './DropdownSelect.tsx'
import DropdownTabs from './DropdownTabs.tsx'
import { EditQuestionForm } from './EditQuestionForm.tsx'
import { QuestionForm } from './QuestionForm.tsx'
import QuestionReadOnlyRow from './QuestionReadOnlyRow.tsx'

const QuestionTable: React.FC = () => {
    const { data: user } = useCurrentUser()
    const { data: questions } = useAllQuestions()
    const storeQuestionMutation = useStoreQuestion()
    const updateQuestionMutation = useUpdateQuestion()
    const deleteQuestionMutation = useDeleteQuestion()
    const [addFormData, setAddFormData] = useState<Omit<Question, 'question_id'>>({
        title: '',
        description: '',
        category: '',
        complexity: 'Easy',
    })
    const [editFormData, setEditFormData] = useState<Question>({
        question_id: '',
        title: '',
        description: '',
        category: '',
        complexity: 'Easy',
    })
    const blankQuestion: Question = {
        question_id: '',
        title: '',
        description: '',
        category: '',
        complexity: 'Easy',
    }
    const [showQuestionForm, setShowQuestionForm] = useState(false)
    const [showEditQuestionForm, setShowEditQuestionForm] = useState(false)
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Question
        direction: 'ascending' | 'descending'
    } | null>({
        key: 'complexity',
        direction: 'ascending',
    })
    const [complexityFilter, setComplexityFilter] = useState<null | 'Easy' | 'Medium' | 'Hard'>(
        null
    )
    const [categoryFilter, setCategoryFilter] = useState<null | string>(null)
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
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [showTopBtn, setShowTopBtn] = useState(false)
    const [idToDelete, setIdToDelete] = useState('')
    const [showDeleteQuestionPrompt, setShowDeleteQuestionPrompt] = useState(false)
    const requestSort = createRequestSort(setSortConfig)

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                setShowTopBtn(true)
            } else {
                setShowTopBtn(false)
            }
        })
    }, [])

    const filteredAndSortedQuestions = React.useMemo(() => {
        let filteredItems = [...questions]
        filteredItems = filterByComplexity(filteredItems, complexityFilter)
        filteredItems = filterByCategory(filteredItems, categoryFilter)
        filteredItems = filterBySearchTerm(filteredItems, searchTerm)
        filteredItems = sortItems(filteredItems, sortConfig)
        return filteredItems
    }, [questions, sortConfig, complexityFilter, categoryFilter, searchTerm])

    const handleEditFormChange = (updatedData: Question) => {
        setEditFormData(updatedData)
    }

    const handleAddFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        await storeQuestionMutation.mutateAsync(addFormData)
        setAddFormData({
            title: '',
            description: '',
            category: '',
            complexity: 'Easy',
        })
        setShowQuestionForm(false)
    }

    const handleEditFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        console.log('hello')
        event.preventDefault()

        if (!editFormData) return
        await updateQuestionMutation.mutateAsync(editFormData)
        setEditFormData(blankQuestion)
        setShowEditQuestionForm(false)
    }

    const handleEditClick = (event: React.MouseEvent<HTMLButtonElement>, question: Question) => {
        event.preventDefault()
        setEditFormData(question)
        setShowEditQuestionForm(true)
    }

    const handleCancelClick = () => {
        setEditFormData(blankQuestion)
        setShowEditQuestionForm(false)
    }

    const handleFormChange = (updatedData: Omit<Question, 'question_id'>) => {
        setAddFormData(updatedData)
    }

    const handleDeleteClick = (questionId: string) => {
        setIdToDelete(questionId)
        setShowDeleteQuestionPrompt(true)
    }

    const handleDelete = () => {
        deleteQuestionMutation.mutate(idToDelete)
        setShowDeleteQuestionPrompt(false)
    }

    const goToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const isMaintainer = user?.role === 'maintainer'

    return (
        <div className='question-container'>
            <h2>Questions</h2>
            <div className='dropdown-row'>
                {isMaintainer && (
                    <>
                        <button
                            className='add-question-button'
                            onClick={() => setShowQuestionForm(true)}
                        >
                            Add a Question
                            <Add fontSize={'small'} />
                        </button>
                        <AnimatePresence>
                            {showQuestionForm && (
                                <QuestionForm
                                    initialData={addFormData}
                                    onFormChange={handleFormChange}
                                    onSubmit={handleAddFormSubmit}
                                    onClose={() => setShowQuestionForm(false)}
                                />
                            )}
                            {showEditQuestionForm && (
                                <EditQuestionForm
                                    initialData={editFormData}
                                    onFormChange={handleEditFormChange}
                                    onSubmit={handleEditFormSubmit}
                                    onClose={handleCancelClick}
                                />
                            )}
                        </AnimatePresence>
                    </>
                )}
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
            <div className='reset-row'>
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
            <form onSubmit={handleEditFormSubmit}>
                <table className='question-table'>
                    <thead>
                        <tr>
                            <th id='id-header'>
                                <div className='header'>
                                    ID
                                    <UnfoldMoreOutlined
                                        className='sort-icon'
                                        onClick={() => requestSort('question_id')}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className='header'>
                                    Title
                                    <UnfoldMoreOutlined
                                        className='sort-icon'
                                        onClick={() => requestSort('title')}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className='header'>
                                    Category
                                    <UnfoldMoreOutlined
                                        className='sort-icon'
                                        onClick={() => requestSort('category')}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className='header'>
                                    Complexity
                                    <UnfoldMoreOutlined
                                        className='sort-icon'
                                        onClick={() => requestSort('complexity')}
                                    />
                                </div>
                            </th>
                            {isMaintainer && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedQuestions.length > 0 ? (
                            filteredAndSortedQuestions.map((question) => (
                                <Fragment key={question.question_id}>
                                    <QuestionReadOnlyRow
                                        question={question}
                                        handleEditClick={handleEditClick}
                                        handleDeleteClick={handleDeleteClick}
                                        hasActions={isMaintainer}
                                    />
                                </Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={isMaintainer ? 5 : 4} style={{ textAlign: 'center' }}>
                                    No results found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </form>
            {showDeleteQuestionPrompt && (
                <DeletePrompt
                    onDelete={handleDelete}
                    onClose={() => setShowDeleteQuestionPrompt(false)}
                />
            )}
            {showTopBtn && (
                <button
                    onClick={goToTop}
                    className='back-to-top'
                    style={{ margin: '10px 0 0 auto' }}
                >
                    Back to top
                    <ArrowUpward fontSize={'small'} />
                </button>
            )}
            {updateQuestionMutation.isError && (
                <AlertMessage variant='error'>
                    <h4>Oops! {updateQuestionMutation.error.detail}</h4>
                </AlertMessage>
            )}
            {deleteQuestionMutation.isError && (
                <AlertMessage variant='error'>
                    <h4>Oops! {deleteQuestionMutation.error.detail}</h4>
                </AlertMessage>
            )}
            {storeQuestionMutation.isError && (
                <AlertMessage variant='error'>
                    <h4>Oops! {storeQuestionMutation.error.detail}</h4>
                </AlertMessage>
            )}
            {updateQuestionMutation.isSuccess && (
                <AlertMessage variant='success'>
                    <h4>Question successfully edited!</h4>
                </AlertMessage>
            )}
            {deleteQuestionMutation.isSuccess && (
                <AlertMessage variant='success'>
                    <h4>Question successfully deleted!</h4>
                </AlertMessage>
            )}
            {storeQuestionMutation.isSuccess && (
                <AlertMessage variant='success'>
                    <h4>Question successfully added!</h4>
                </AlertMessage>
            )}
        </div>
    )
}

export default QuestionTable

interface DeletePromptProps {
    onDelete: () => void
    onClose: () => void
}

const DeletePrompt: React.FC<DeletePromptProps> = ({ onDelete, onClose }) => {
    return (
        <div className='dark-overlay' style={{ zIndex: 4 }}>
            <motion.div
                className='reset-confirmation'
                key='reset'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                <span className='reset-title'>
                    <Error
                        sx={{
                            marginRight: '10px',
                            color: '#febf1d',
                            height: '20px',
                            width: '20px',
                        }}
                    />
                    <h3 style={{ margin: '0' }}>Are you sure?</h3>
                </span>
                <div style={{ padding: '10px' }}>Question will be permanently deleted!</div>
                <span className='reset-buttons'>
                    <button
                        style={{ backgroundColor: '#fe375f', marginRight: '5px' }}
                        onClick={onDelete}
                    >
                        Delete
                    </button>
                    <button style={{ backgroundColor: 'transparent' }} onClick={onClose}>
                        Cancel
                    </button>
                </span>
            </motion.div>
        </div>
    )
}
