import React, { useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import '../../styles/QuestionForm.css'
import CategoryButton from './CategoryButton.tsx'

export interface Question {
    question_id: string
    title: string
    description: string
    category: string
    complexity: Complexity
}

type Complexity = 'Easy' | 'Medium' | 'Hard'

type FormData = Omit<Question, 'question_id'>

const categoriesList: string[] = [
    'Algorithms',
    'Arrays',
    'Bit Manipulation',
    'Brainteaser',
    'Databases',
    'Data Structures',
    'Dynamic Programming',
    'Recursion',
    'Sorting',
    'Strings',
]

interface QuestionFormProps {
    initialData: FormData
    onFormChange: (data: FormData) => void
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
    onClose: () => void
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
    initialData,
    onFormChange,
    onSubmit,
    onClose,
}) => {
    const [formData, setFormData] = useState<FormData>(initialData)
    const [isWrite, setIsWrite] = useState(true)

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target
        const updatedData = {
            ...formData,
            [name]: value,
        }
        setFormData(updatedData)
        onFormChange(updatedData)
    }

    const handleCategoryClick = (category: string) => {
        const currentCategories = formData.category.split(', ').filter(Boolean) // filter(Boolean) ensures no empty strings in array

        if (currentCategories.includes(category)) {
            const index = currentCategories.indexOf(category)
            currentCategories.splice(index, 1)
        } else {
            currentCategories.push(category)
        }

        const newCategory = currentCategories.join(', ')

        const updatedData = {
            ...formData,
            category: newCategory,
        }
        setFormData(updatedData)
        onFormChange(updatedData)
    }

    return (
        <div className='dark-overlay' style={{ zIndex: 2 }}>
            <div className='question-form-container'>
                <h2>Add a question</h2>
                <form onSubmit={onSubmit}>
                    <div className='split-container'>
                        <div className='form-pane'>
                            <p>Title</p>
                            <input
                                name='title'
                                required
                                placeholder='Title'
                                value={formData.title}
                                onChange={handleInputChange}
                            />

                            <p>Complexity</p>
                            <select
                                name='complexity'
                                value={formData.complexity}
                                onChange={handleInputChange}
                            >
                                <option value='Easy'>Easy</option>
                                <option value='Medium'>Medium</option>
                                <option value='Hard'>Hard</option>
                            </select>
                        </div>
                        <div className='form-pane'>
                            <div>
                                <p>Category</p>
                                <input
                                    style={{ display: 'none' }}
                                    name='category'
                                    required
                                    placeholder='Category'
                                    value={formData.category}
                                    onChange={handleInputChange}
                                />
                                <div
                                    style={{
                                        height: '100%',
                                        maxHeight: '130px',
                                        overflow: 'scroll',
                                    }}
                                >
                                    {categoriesList.map((category) => (
                                        <CategoryButton
                                            key={category}
                                            category={category}
                                            isSelected={formData.category
                                                .split(', ')
                                                .includes(category)}
                                            onSelect={(selectedCategory) =>
                                                handleCategoryClick(selectedCategory)
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='description-header'>
                        <p>Description</p>
                        <button
                            onClick={() => setIsWrite(true)}
                            className={`write-button${isWrite ? '-active' : ''}`}
                            style={{ marginLeft: 'auto' }}
                            type='button'
                        >
                            Write
                        </button>
                        <button
                            onClick={() => setIsWrite(false)}
                            className={`preview-button${!isWrite ? '-active' : ''}`}
                            type='button'
                        >
                            Preview
                        </button>
                    </div>
                    {isWrite ? (
                        <textarea
                            className='description-text'
                            name='description'
                            required
                            placeholder='Description'
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <div className='markdown-container'>
                            <Markdown className='markdown' remarkPlugins={[remarkGfm]}>
                                {formData.description}
                            </Markdown>
                        </div>
                    )}
                    <span className='submit-button-container'>
                        <button
                            style={{ backgroundColor: '#00b8a2', marginRight: '5px' }}
                            type='submit'
                        >
                            Add
                        </button>
                        <button
                            style={{ backgroundColor: 'transparent' }}
                            type='button'
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </span>
                </form>
            </div>
        </div>
    )
}
