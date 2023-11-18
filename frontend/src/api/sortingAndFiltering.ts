import React from 'react'
import { Question } from './questions.ts'

/**
 * Configuration for sorting questions.
 * @typedef {Object} SortConfig
 * @property {keyof Question} key - The key of the question to sort by.
 * @property {'ascending' | 'descending'} direction - The direction of the sort.
 */
export type SortConfig = {
    key: keyof Question
    direction: 'ascending' | 'descending'
}

/**
 * Filters an array of questions by complexity.
 *
 * @param {Question[]} items - Array of questions to be filtered.
 * @param {'Easy' | 'Medium' | 'Hard' | null} complexityFilter - Complexity level to filter by.
 * @returns {Question[]} Filtered array of questions.
 */
export const filterByComplexity = (
    items: Question[],
    complexityFilter: null | 'Easy' | 'Medium' | 'Hard'
): Question[] => {
    return complexityFilter ? items.filter((item) => item.complexity === complexityFilter) : items
}

/**
 * Filters an array of questions by category.
 *
 * @param {Question[]} items - Array of questions to be filtered.
 * @param {string | null} categoryFilter - Category to filter by.
 * @returns {Question[]} Filtered array of questions.
 */
export const filterByCategory = (items: Question[], categoryFilter: null | string): Question[] => {
    return categoryFilter
        ? items.filter((item) =>
              item.category
                  .split(',')
                  .map((cat) => cat.trim())
                  .includes(categoryFilter)
          )
        : items
}

/**
 * Filters an array of questions by search term.
 *
 * @param {Question[]} items - Array of questions to be filtered.
 * @param {string} searchTerm - Term to search for in question titles.
 * @returns {Question[]} Filtered array of questions.
 */
export const filterBySearchTerm = (items: Question[], searchTerm: string): Question[] => {
    return searchTerm
        ? items.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
        : items
}

/**
 * Sorts an array of questions based on the provided configuration.
 *
 * @param {Question[]} items - Array of questions to be sorted.
 * @param {SortConfig | null} sortConfig - Configuration for sorting.
 * @returns {Question[]} Sorted array of questions.
 */
export const sortItems = (
    items: Question[],
    sortConfig: { key: keyof Question; direction: 'ascending' | 'descending' } | null
): Question[] => {
    if (sortConfig === null) return items

    const complexityOrder = ['Easy', 'Medium', 'Hard']
    return items.sort((a, b) => {
        if (sortConfig.key === 'complexity') {
            const orderA = complexityOrder.indexOf(a.complexity)
            const orderB = complexityOrder.indexOf(b.complexity)
            return sortConfig.direction === 'ascending' ? orderA - orderB : orderB - orderA
        }

        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
    })
}

/**
 * Creates a function that sets the sort configuration for questions.
 *
 * @param {React.Dispatch<React.SetStateAction<SortConfig | null>>} setSortConfig - State setter function for updating the sort configuration.
 * @returns {function(key: keyof Question): void} Function to invoke sort configuration update.
 */
export const createRequestSort = (
    setSortConfig: React.Dispatch<React.SetStateAction<SortConfig | null>>
) => {
    return (key: keyof Question) => {
        setSortConfig((prevSortConfig) => {
            const isAsc = prevSortConfig?.key === key && prevSortConfig.direction === 'ascending'
            return { key, direction: isAsc ? 'descending' : 'ascending' }
        })
    }
}
