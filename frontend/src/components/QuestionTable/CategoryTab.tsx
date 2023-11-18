import React from 'react'

interface CategoryTabProps {
    name: string
    onClick: () => void
}

const CategoryTab: React.FC<CategoryTabProps> = ({ name, onClick }) => {
    return (
        <div className='category-tab' onClick={onClick}>
            {name}
        </div>
    )
}

export default CategoryTab
