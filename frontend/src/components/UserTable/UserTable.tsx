import React, { ChangeEvent, FormEvent, Fragment, useEffect, useState } from 'react'
import type { UpdatedUser, User } from '../../api/users.ts'
import { useAllUsers, useDeleteUser, useUpdateUser } from '../../stores/userStore.ts'
import '../../styles/AlertMessage.css'
import '../../styles/UserTable.css'
import AlertMessage from '../AlertMessage.tsx'
import UserEditableRow from './UserEditableRow.tsx'
import UserReadOnlyRow from './UserReadOnlyRow.tsx'

export const UserTable: React.FC = () => {
    const { data: users } = useAllUsers()
    const updateUserMutation = useUpdateUser()
    const deleteUserMutation = useDeleteUser()
    const [editFormData, setEditFormData] = useState<UpdatedUser | null>(null)
    const [submitCounter, setSubmitCounter] = useState(0)
    const [emailError, setEmailError] = useState('')
    const validEmailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    const handleEditFormChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target
        // @ts-ignore
        setEditFormData({
            ...editFormData,
            [name]: value,
        })
    }

    const handleEditFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSubmitCounter((c) => c + 1) // Increment the counter

        if (!editFormData) return

        const cleanedData = Object.fromEntries(
            Object.entries(editFormData).filter(([_, value]) => value !== '')
        ) as UpdatedUser

        if (!validEmailRegex.test(editFormData?.email as string)) {
            setEmailError('Invalid email format')
            return
        }

        await updateUserMutation.mutateAsync(cleanedData)
        setEditFormData(null)
        setEmailError('')
    }

    useEffect(() => {
        // Reset the emailError state whenever editFormData changes
        setEmailError('')
    }, [editFormData])

    const handleEditClick = (event: React.MouseEvent<HTMLButtonElement>, user: User) => {
        event.preventDefault()
        setEditFormData(user)
    }

    const handleCancelClick = () => {
        setEditFormData(null)
    }

    const handleDeleteClick = (userId: string) => deleteUserMutation.mutateAsync(userId)

    return (
        <div className='user-container'>
            <h2>Users</h2>
            <form onSubmit={handleEditFormSubmit}>
                <table className='user-table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <Fragment key={user.user_id}>
                                {editFormData && editFormData.user_id === user.user_id ? (
                                    <UserEditableRow
                                        editFormData={editFormData}
                                        handleEditFormChange={handleEditFormChange}
                                        handleCancelClick={handleCancelClick}
                                    />
                                ) : (
                                    <UserReadOnlyRow
                                        user={user}
                                        handleEditClick={handleEditClick}
                                        handleDeleteClick={handleDeleteClick}
                                    />
                                )}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </form>
            {updateUserMutation.isError && (
                <AlertMessage variant='error'>
                    <h4>Oops! {updateUserMutation.error.detail}</h4>
                </AlertMessage>
            )}
            {deleteUserMutation.isError && (
                <AlertMessage variant='error'>
                    <h4>Oops! {deleteUserMutation.error.detail}</h4>
                </AlertMessage>
            )}
            {updateUserMutation.isSuccess && (
                <AlertMessage variant='success'>
                    <h4>User details successfully updated!</h4>
                </AlertMessage>
            )}
            {deleteUserMutation.isSuccess && (
                <AlertMessage variant='success'>
                    <h4>User successfully deleted!</h4>
                </AlertMessage>
            )}
            {emailError && (
                <AlertMessage key={submitCounter} variant='error'>
                    <h4>{emailError}</h4>
                </AlertMessage>
            )}
        </div>
    )
}

export default UserTable
