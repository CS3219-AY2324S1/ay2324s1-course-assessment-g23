import React from 'react'

interface Props {
    category: string
    isSelected: boolean
    onSelect: (category: string) => void
}

const CategoryButton: React.FC<Props> = ({ category, isSelected, onSelect }) => {
    return (
        <button
            className={`category-button ${isSelected ? 'selected' : ''}`} // Add a 'selected' class if the category is selected
            type='button'
            onClick={() => onSelect(category)}
        >
            {category}
        </button>
    )
}

export default CategoryButton
