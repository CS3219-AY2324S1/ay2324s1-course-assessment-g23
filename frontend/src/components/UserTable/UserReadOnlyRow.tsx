import { User } from '../../api/users.ts'
import { IconButton, Tooltip, Typography } from '@mui/material'
import React from 'react'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

interface ReadOnlyRowProps {
    user: User
    handleEditClick: (event: React.MouseEvent<HTMLButtonElement>, user: User) => void
    handleDeleteClick: (id: string) => void
}

const UserReadOnlyRow: React.FC<ReadOnlyRowProps> = ({
    user,
    handleEditClick,
    handleDeleteClick,
}) => {
    return (
        <tr>
            <td>
                <Tooltip title={<p>{user.user_id}</p>} arrow>
                    <Typography
                        style={{
                            cursor: 'pointer',
                            maxWidth: '10ch', // Adjust the maximum width as needed
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {user.user_id}
                    </Typography>
                </Tooltip>
            </td>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
                <IconButton
                    sx={{ color: '#c2c2c2', paddingLeft: '0' }}
                    onClick={(event) => handleEditClick(event, user)}
                >
                    <EditIcon />
                </IconButton>
                <IconButton
                    sx={{ color: '#c2c2c2' }}
                    onClick={() => handleDeleteClick(user.user_id)}
                >
                    <DeleteIcon />
                </IconButton>
            </td>
        </tr>
    )
}

export default UserReadOnlyRow
