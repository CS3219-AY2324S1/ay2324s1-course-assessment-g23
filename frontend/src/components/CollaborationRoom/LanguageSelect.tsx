import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import React, { useState } from 'react'
import '../../styles/Room.css'

const options = ['Javascript', 'Java', 'Python']

interface LanguageSelectProps {
    onLanguageChange: (language: string) => void
}

const LanguageSelect: React.FC<LanguageSelectProps> = ({ onLanguageChange }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selection, setSelection] = useState('')

    return (
        <div className='dropdown-wrapper'>
            <button className={`toggle-button`} onClick={() => setIsOpen(!isOpen)}>
                {!selection ? 'Javascript' : selection}
                <KeyboardArrowDownIcon />
            </button>
            <ul id='custom-listbox' className={`listbox ${isOpen ? 'isOpen' : ''}`}>
                {options.map((option) => (
                    <li
                        role='option'
                        onClick={() => {
                            setSelection(option)
                            setIsOpen(false)
                            onLanguageChange(option) // <- use the prop here
                        }}
                        key={option}
                        className={'list-option'}
                    >
                        {option}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default LanguageSelect
