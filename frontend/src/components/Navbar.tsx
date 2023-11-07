import React, { useState } from 'react'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'
import { useLogoutUser } from '../stores/sessionStore.ts'
import { useCurrentUser } from '../stores/userStore.ts'
import '../styles/Navbar.css'
import EditProfile from './EditProfile.tsx'

const Navbar: React.FC = () => {
    const { data: user } = useCurrentUser()
    const logoutUserMutation = useLogoutUser()
    const [dropDownOpen, setDropDownOpen] = useState(false)
    const [editProfileOpen, setEditProfileOpen] = useState(false)

    const openEditProfile = () => {
        setEditProfileOpen(true)
        setDropDownOpen(false)
    }

    const handleSignOut = async () => {
        await logoutUserMutation.mutateAsync()
    }

    return (
        <>
            <nav className='nav'>
                <img src='../../peerprep.png' width='40' height='40' alt='PeerPrep Logo' />
                <Link to='/questions' className='site-title'>
                    PeerPrep
                </Link>
                <ul>
                    <CustomLink to='/questions'>Questions</CustomLink>
                    {user?.role === 'maintainer' && <CustomLink to='/users'>Users</CustomLink>}
                    <li
                        className={`profile-button ${dropDownOpen ? 'active' : 'inactive'}`}
                        onClick={() => setDropDownOpen(!dropDownOpen)}
                    >
                        Profile
                    </li>
                    {dropDownOpen && (
                        <div className='overlay' onClick={() => setDropDownOpen(false)}></div>
                    )}
                    <div className={`dropdown-menu ${dropDownOpen ? 'active' : 'inactive'}`}>
                        <h3>
                            {user?.username}
                            <br />
                            <span>{user?.role}</span>
                            <br />
                            <span>{user?.email}</span>
                        </h3>
                        <ul>
                            <DropdownItem text={'Edit Profile'} onClick={openEditProfile} />
                            <DropdownItem text={'Sign out'} onClick={handleSignOut} />
                        </ul>
                    </div>
                </ul>
            </nav>
            {editProfileOpen && (
                <EditProfile user={user!} onClose={() => setEditProfileOpen(false)} />
            )}
        </>
    )
}

interface CustomLinkProps {
    to: string
    children: React.ReactNode
}

function CustomLink({ to, children, ...props }: CustomLinkProps) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })
    return (
        <li className={isActive ? 'active' : ''}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    )
}

interface DropdownItemProps {
    text: string
    onClick?: () => void
}

function DropdownItem(props: DropdownItemProps) {
    const handleClick = () => {
        if (props.onClick) {
            props.onClick()
        }
    }
    return (
        <li className='dropdownItem' onClick={handleClick}>
            <a> {props.text} </a>
        </li>
    )
}

export default Navbar
