import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import React, { useState } from 'react'
import { AVAILABLE_LANGUAGES } from '../../api/codeExecution'
import { useLanguage } from '../../stores/codeStore'
import '../../styles/Room.css'

const LanguageSelect: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { language, setLanguage } = useLanguage()

    return (
        <div className='dropdown-wrapper'>
            <button className={`toggle-button`} onClick={() => setIsOpen(!isOpen)}>
                {language.name}
                <KeyboardArrowDownIcon />
            </button>
            <ul id='custom-listbox' className={`listbox ${isOpen ? 'isOpen' : ''}`}>
                {AVAILABLE_LANGUAGES.map((lang) => (
                    <li
                        role='option'
                        onClick={() => {
                            setLanguage(lang)
                            setIsOpen(false)
                        }}
                        key={lang.id}
                        className={'list-option'}
                    >
                        {lang.name}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default LanguageSelect
