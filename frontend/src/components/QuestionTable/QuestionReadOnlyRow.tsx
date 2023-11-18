import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { Dialog, DialogContent, DialogTitle, IconButton, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { type Question } from '../../api/questions.ts'
import { useUpdateQuestion } from '../../stores/questionStore.ts'
import '../../styles/QuestionTable.css'
import AlertMessage from '../AlertMessage.tsx'

interface ReadOnlyRowProps {
    question: Question
    handleEditClick: (event: React.MouseEvent<HTMLButtonElement>, question: Question) => void
    handleDeleteClick: (id: string) => void
    hasActions: boolean
}

const QuestionReadOnlyRow: React.FC<ReadOnlyRowProps> = ({
    question,
    handleEditClick,
    handleDeleteClick,
    hasActions,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editedDescription, setEditedDescription] = useState(question.description)
    const updateQuestionMutation = useUpdateQuestion()

    const openModal = () => {
        setEditedDescription(question.description)
        setIsModalOpen(true)
    }

    const handleClose = () => {
        setIsModalOpen(false)
    }

    return (
        <>
            <tr>
                <td className='id-column'>
                    <Tooltip
                        title={<p>{question.question_id}</p>}
                        placement='bottom-start'
                        componentsProps={{
                            tooltip: {
                                sx: {
                                    backgroundColor: '#c2c2c2',
                                    color: '#242424',
                                    fontSize: '15px',
                                    maxWidth: '100%',
                                },
                            },
                        }}
                    >
                        <Typography
                            style={{
                                cursor: 'pointer',
                                maxWidth: '8ch', // Adjust the maximum width as needed
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {question.question_id}
                        </Typography>
                    </Tooltip>
                </td>
                <td onClick={openModal} className='title-column'>
                    <p>{question.title}</p>
                </td>
                <td>{question.category}</td>
                <td className={`complexity-color-${question.complexity}`}>{question.complexity}</td>
                {hasActions && (
                    <td className='action-column'>
                        <IconButton
                            sx={{ color: '#c2c2c2', padding: '0' }}
                            onClick={(event) => handleEditClick(event, question)}
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            sx={{ color: '#c2c2c2', padding: '0 0 0 10px' }}
                            onClick={() => handleDeleteClick(question.question_id)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </td>
                )}
            </tr>

            <Dialog
                open={isModalOpen}
                onClose={handleClose}
                maxWidth='md'
                PaperProps={{
                    sx: { borderRadius: '1rem', backgroundColor: '#242424', padding: '2rem 1rem' },
                }}
            >
                <DialogTitle style={{ color: 'white', padding: ' 0 24px 10px 24px' }}>
                    {question.title}
                </DialogTitle>
                <DialogContent style={{ backgroundColor: '#242424' }}>
                    <Markdown className='markdown' remarkPlugins={[remarkGfm]}>
                        {editedDescription}
                    </Markdown>
                </DialogContent>

                {updateQuestionMutation.isError && (
                    <AlertMessage variant='error'>
                        <h4>Oops! {updateQuestionMutation.error.detail}</h4>
                    </AlertMessage>
                )}
            </Dialog>
        </>
    )
}

export default QuestionReadOnlyRow
