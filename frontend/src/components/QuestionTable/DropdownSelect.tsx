import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useState } from 'react'
import '../../styles/Room.css'

interface DropdownSelectProps {
    type: string
    options: string[]
    onOptionChange: (selectedOption: string) => void
    defaultOption?: string
    label?: string
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({
    type,
    options,
    onOptionChange,
    defaultOption,
    label,
}) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className='dropdown-wrapper-question'>
            {label && <label>{label}: </label>}
            <button className='toggle-button' onClick={() => setIsOpen(!isOpen)}>
                {defaultOption}
                <KeyboardArrowDownIcon />
            </button>
            <ul id='custom-listbox' className={`listbox ${isOpen ? 'isOpen' : ''}`}>
                {options.map((option) => (
                    <li
                        id={`${type}-${option}`}
                        role='option'
                        onClick={() => {
                            setIsOpen(false)
                            onOptionChange(option)
                        }}
                        key={option}
                        className='list-option'
                    >
                        {option}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default DropdownSelect
