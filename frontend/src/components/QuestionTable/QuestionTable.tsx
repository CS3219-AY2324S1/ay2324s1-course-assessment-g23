import React, { ChangeEvent, FormEvent, Fragment, useState } from 'react'
import QuestionEditableRow from './QuestionEditableRow.tsx'
import QuestionReadOnlyRow from './QuestionReadOnlyRow.tsx'
import { type Question } from '../../api/questions.ts'
import {
    useAllQuestions,
    useDeleteQuestion,
    useStoreQuestion,
    useUpdateQuestion,
} from '../../stores/questionStore.ts'
import '../../styles/QuestionTable.css'
import AlertMessage from '../AlertMessage.tsx'
import '../../styles/AlertMessage.css'
import { useSessionDetails } from '../../stores/sessionStore.ts'

export const QuestionTable: React.FC = () => {
    const { data: sessionDetails } = useSessionDetails()
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
    const [editFormData, setEditFormData] = useState<Question | null>(null)

    const handleAddFormChange = (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target
        setAddFormData({
            ...addFormData,
            [name]: value,
        })
    }

    const handleEditFormChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target
        // @ts-ignore
        setEditFormData({
            ...editFormData,
            [name]: value,
        })
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
    }

    const handleEditFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!editFormData) return
        await updateQuestionMutation.mutateAsync(editFormData)
        setEditFormData(null)
    }

    const handleEditClick = (event: React.MouseEvent<HTMLButtonElement>, question: Question) => {
        event.preventDefault()
        setEditFormData(question)
    }

    const handleCancelClick = () => {
        setEditFormData(null)
    }

    const handleDeleteClick = (questionId: string) => deleteQuestionMutation.mutate(questionId)

    const isMaintainer = sessionDetails?.role === 'maintainer'
    return (
        <div className='question-container'>
            <h2>Questions</h2>
            <form onSubmit={handleEditFormSubmit}>
                <table className='question-table'>
                    <thead>
                        <tr>
                            <th id='id-header'>ID</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Complexity</th>
                            {isMaintainer && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((question) => (
                            <Fragment key={question.question_id}>
                                {editFormData &&
                                editFormData.question_id === question.question_id ? (
                                    <QuestionEditableRow
                                        editFormData={editFormData}
                                        handleEditFormChange={handleEditFormChange}
                                        handleCancelClick={handleCancelClick}
                                    />
                                ) : (
                                    <QuestionReadOnlyRow
                                        question={question}
                                        handleEditClick={handleEditClick}
                                        handleDeleteClick={handleDeleteClick}
                                        hasActions={isMaintainer}
                                    />
                                )}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </form>

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

            {isMaintainer && (
                <>
                    <h2>Add a Question</h2>
                    <form className='questionForm' onSubmit={handleAddFormSubmit}>
                        <input
                            name='id'
                            disabled
                            placeholder='ID'
                            onChange={handleAddFormChange}
                            value={'—'}
                        />
                        <input
                            name='title'
                            required
                            placeholder='Title'
                            onChange={handleAddFormChange}
                            value={addFormData.title}
                        />

                        <input
                            name='category'
                            required
                            placeholder='Category'
                            onChange={handleAddFormChange}
                            value={addFormData.category}
                        />
                        <select
                            name='complexity'
                            required
                            value={addFormData.complexity}
                            onChange={handleAddFormChange}
                        >
                            <option value='Easy'>Easy</option>
                            <option value='Medium'>Medium</option>
                            <option value='Hard'>Hard</option>
                        </select>
                        <div>
                            <textarea
                                className='custom-desc-input'
                                name='description'
                                required
                                placeholder='Description'
                                onChange={handleAddFormChange}
                                value={addFormData.description}
                            />
                        </div>
                        <div>
                            <button id='addButton' type='submit'>
                                Add
                            </button>
                        </div>
                    </form>
                    {storeQuestionMutation.isError && (
                        <AlertMessage variant='error'>
                            <h4>Oops! {storeQuestionMutation.error.detail}</h4>
                        </AlertMessage>
                    )}
                </>
            )}
        </div>
    )
}

export default QuestionTable
