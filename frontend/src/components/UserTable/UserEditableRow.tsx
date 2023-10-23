import React, { ChangeEvent } from 'react'
import type { UpdatedUser } from '../../api/users.ts'
import '../../styles/UserTable.css'
import { IconButton } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'

// Define a TypeScript interface for the props
interface EditableRowProps {
    editFormData: UpdatedUser
    handleEditFormChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    handleCancelClick: () => void
}

const UserEditableRow: React.FC<EditableRowProps> = ({
    editFormData,
    handleEditFormChange,
    handleCancelClick,
}) => {
    return (
        <tr className='user-container'>
            <td>
                <input required placeholder='ID' name='id' value={editFormData.user_id} disabled />
            </td>
            <td>
                <input
                    required
                    placeholder='Username'
                    name='username'
                    value={editFormData.username}
                    onChange={handleEditFormChange}
                />
            </td>
            <td>
                <input
                    required
                    placeholder='Email'
                    name='email'
                    value={editFormData.email}
                    onChange={handleEditFormChange}
                />
            </td>
            <td>
                <select
                    name='role'
                    required
                    value={editFormData.role}
                    onChange={handleEditFormChange}
                >
                    <option value='normal'>normal</option>
                    <option value='maintainer'>maintainer</option>
                </select>
            </td>
            <td>
                <IconButton type='submit' sx={{ color: '#c2c2c2', paddingLeft: '0' }}>
                    <SaveIcon />
                </IconButton>
                <IconButton type='button' onClick={handleCancelClick} sx={{ color: '#c2c2c2' }}>
                    <CancelIcon />
                </IconButton>
            </td>
        </tr>
    )
}

export default UserEditableRow
