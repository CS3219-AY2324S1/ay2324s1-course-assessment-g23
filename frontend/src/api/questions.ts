import { ApiError } from './error'

/** URL for question bank API. */
const QUESTION_API_URL = '/api/questions'

/** HTTP request headers for question bank API. */
const QUESTION_API_HEADER = { 'Content-Type': 'application/json' }

export type Complexity = 'Easy' | 'Medium' | 'Hard'

/** Represents a question in the question bank. */
export interface Question {
    question_id: string
    title: string
    description: string
    category: string
    complexity: Complexity
}

/**
 * Stores a new question.
 *
 * @param question - The question to store. All fields except ID are required.
 * @returns Resolves with the UUID for the stored question.
 * @throws {ApiError} Throws an ApiError if the API response indicates an error.
 */
export async function storeQuestion(question: Omit<Question, 'question_id'>): Promise<string> {
    const response = await fetch(QUESTION_API_URL + '/questions', {
        method: 'POST',
        headers: QUESTION_API_HEADER,
        body: JSON.stringify(question),
        credentials: 'include',
    })

    if (!response.ok) throw await ApiError.parseResponse(response)

    const data: Pick<Question, 'question_id'> = await response.json()
    return data.question_id
}

/**
 * Retrieves a question by its ID.
 *
 * @param id - The ID of the question to retrieve.
 * @returns Resolves with the Question object if found.
 * @throws {ApiError} Throws an ApiError if the API response indicates an error.
 */
export async function getQuestion(id: string): Promise<Question> {
    const response = await fetch(QUESTION_API_URL + `/questions/${id}`, {
        method: 'GET',
        headers: QUESTION_API_HEADER,
        credentials: 'include',
    })

    if (!response.ok) throw await ApiError.parseResponse(response)

    const data: Question = await response.json()
    return data
}

/**
 * Retrieves all questions.
 *
 * @returns An array of questions.
 * @throws {ApiError} Throws an ApiError if the API response indicates an error.
 */
export async function getAllQuestions(): Promise<Question[]> {
    const response = await fetch(QUESTION_API_URL + `/questions_all`, {
        method: 'GET',
        headers: QUESTION_API_HEADER,
        credentials: 'include',
    })

    if (!response.ok) throw await ApiError.parseResponse(response)

    const data: Question[] = await response.json()
    return data
}

/**
 * Updates an existing question by its ID.
 *
 * @param updatedQuestion - Question with the fields to update. All fields except `id` are optional.
 * @returns Resolves when the question is successfully updated.
 * @throws {ApiError} Throws an ApiError if the API response indicates an error.
 */
export async function updateQuestion(
    updatedQuestion: Pick<Question, 'question_id'> & Partial<Omit<Question, 'question_id'>>
): Promise<void> {
    const response = await fetch(QUESTION_API_URL + '/questions', {
        method: 'PUT',
        headers: QUESTION_API_HEADER,
        body: JSON.stringify(updatedQuestion),
        credentials: 'include',
    })

    if (!response.ok) throw await ApiError.parseResponse(response)
}

/**
 * Deletes a question by its ID.
 *
 * @param id - The ID of the question to be deleted.
 * @returns Resolves when the question is successfully deleted.
 * @throws {ApiError} Throws an ApiError if the API response indicates an error.
 */
export async function deleteQuestion(id: string): Promise<void> {
    const response = await fetch(QUESTION_API_URL + `/questions/${id}`, {
        method: 'DELETE',
        headers: QUESTION_API_HEADER,
        credentials: 'include',
    })

    if (!response.ok) throw await ApiError.parseResponse(response)
}

/**
 * Deletes all questions.
 *
 * @returns Resolves when all questions are successfully deleted.
 * @throws {ApiError} Throws an ApiError if the API response indicates an error.
 */
export async function deleteAllQuestions(): Promise<void> {
    const response = await fetch(QUESTION_API_URL + '/questions_all', {
        method: 'DELETE',
        headers: QUESTION_API_HEADER,
        credentials: 'include',
    })

    if (!response.ok) throw await ApiError.parseResponse(response)
}
