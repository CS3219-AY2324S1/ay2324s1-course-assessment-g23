import React, { ChangeEvent, FormEvent, Fragment, useState } from 'react'
import UserEditableRow from './UserEditableRow.tsx'
import type { UpdatedUser, User, UserSignupDetails } from '../../api/users.ts'
import { useAllUsers, useDeleteUser, useStoreUser, useUpdateUser } from '../../stores/userStore.ts'
import UserReadOnlyRow from './UserReadOnlyRow.tsx'
import '../../styles/UserTable.css'
import AlertMessage from '../AlertMessage.tsx'
import '../../styles/AlertMessage.css'

export const UserTable: React.FC = () => {
    const { data: users } = useAllUsers()
    const storeUserMutation = useStoreUser()
    const updateUserMutation = useUpdateUser()
    const deleteUserMutation = useDeleteUser()
    const [addFormData, setAddFormData] = useState<UserSignupDetails>({
        username: '',
        password: '',
        email: '',
    })
    const [editFormData, setEditFormData] = useState<UpdatedUser | null>(null)

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
        await storeUserMutation.mutateAsync(addFormData)
        setAddFormData({
            username: '',
            password: '',
            email: '',
        })
    }

    const handleEditFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!editFormData) return

        const cleanedData = Object.fromEntries(
            Object.entries(editFormData).filter(([_, value]) => value !== '')
        ) as UpdatedUser

        await updateUserMutation.mutateAsync(cleanedData)
        setEditFormData(null)
    }

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
            <h2>Add a User</h2>
            <form className='userForm' onSubmit={handleAddFormSubmit}>
                <input
                    name='id'
                    disabled
                    placeholder='ID'
                    onChange={handleAddFormChange}
                    value={'—'}
                />
                <input
                    name='username'
                    required
                    placeholder='Username'
                    onChange={handleAddFormChange}
                    value={addFormData.username}
                />
                <input
                    name='password'
                    required
                    placeholder='Password'
                    onChange={handleAddFormChange}
                    value={addFormData.password}
                />
                <input
                    name='email'
                    required
                    placeholder='Email'
                    onChange={handleAddFormChange}
                    value={addFormData.email}
                />
                <div>
                    <button type='submit'>Add</button>
                </div>
            </form>
            {storeUserMutation.isError && (
                <AlertMessage variant='error'>
                    <h4>Oops! {storeUserMutation.error.detail}</h4>
                </AlertMessage>
            )}
        </div>
    )
}

export default UserTable
