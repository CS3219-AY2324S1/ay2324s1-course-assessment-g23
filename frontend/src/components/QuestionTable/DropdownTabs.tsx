import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useState } from 'react'
import '../../styles/Dropdown.css'
import CategoryTab from './CategoryTab.tsx'

interface DropdownTabsProps {
    options: string[]
    onOptionChange: (selectedOption: string) => void
    defaultOption?: string
    label?: string
}

const DropdownTabs: React.FC<DropdownTabsProps> = ({
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
            <div id='custom-tab-box' className={`tab-box ${isOpen ? 'isOpen' : ''}`}>
                {options.map((option) => (
                    <CategoryTab
                        key={option}
                        name={option}
                        onClick={() => {
                            setIsOpen(false)
                            onOptionChange(option)
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

export default DropdownTabs
