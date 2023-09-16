import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getAllQuestions,
    getQuestion,
    storeQuestion,
    updateQuestion,
    deleteQuestion,
    deleteAllQuestions,
    Question,
} from '../api/questions'
import { ApiError } from '../api/error'

/**
 * Hook for getting questions state from backend.
 *
 * The (re-)fetching of the questions from the backend is done automatically.
 *
 * @example
 * ```ts
 * const MyComponent: React.FC = () => {
 *     const { data: questions } = useAllQuestions()
 *     // where `questions: Question[]`
 *     // ... rest of the code ...
 * }
 * ```
 */
export function useAllQuestions() {
    return useQuery<Question[], ApiError>({
        queryKey: ['question'],
        queryFn: getAllQuestions,
        initialData: [],
    })
}

/**
 * Hook for getting a specific question's state from the backend using its ID.
 *
 * The fetching of the question from the backend is done automatically.
 *
 * @param id The ID of the question to fetch.
 *
 * @example
 * ```ts
 * const MyComponent: React.FC = () => {
 *     const { data: question } = useQuestion('QUESTION_ID')
 *     // where `question: Question`
 *     // ... rest of the code ...
 * }
 * ```
 */
export function useQuestion(id: string) {
    return useQuery<Question, ApiError>({
        queryKey: ['question', id],
        queryFn: () => getQuestion(id),
    })
}

/**
 * Mutation-hook for storing a new question in the backend.
 *
 * Automatically refetches and updates the questions state from the
 * `useAllQuestions` hook.
 *
 * @example
 * ```ts
 * const MyComponent: React.FC = () => {
 *     const storeQuestionMutation = useStoreQuestion()
 *
 *     const handleStoreQuestion = (newQuestion: Omit<Question, 'question_id'>) => {
 *         storeQuestionMutation.mutate(newQuestion)
 *         // ... rest of the code ...
 *     }
 *     // ... rest of the code ...
 * }
 * ```
 */
export function useStoreQuestion() {
    const queryClient = useQueryClient()
    return useMutation(storeQuestion, {
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['question'] })
        },
        onError: (error: ApiError) => {},
    })
}

/**
 * Mutation-hook for updating an existing in the backend.
 *
 * Automatically refetches and updates the questions state from the
 * `useAllQuestions` hook.
 *
 * @example
 * ```ts
 * const MyComponent: React.FC = () => {
 *     const updateQuestionMutation = useUpdateQuestion()
 *
 *     const handleUpdateQuestion = (updatedQuestion: Question) => {
 *         updateQuestionMutation.mutate(updatedQuestion)
 *         // ... rest of the code ...
 *     }
 *     // ... rest of the code ...
 * }
 * ```
 */
export function useUpdateQuestion() {
    const queryClient = useQueryClient()
    return useMutation(updateQuestion, {
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['question'] })
        },
        onError: (error: ApiError) => {},
    })
}

/**
 * Mutation-hook for deleting a specific question from the backend using its ID.
 *
 * Automatically refetches and updates the questions state from the
 * `useAllQuestions` hook.
 *
 * @example
 * ```ts
 * const MyComponent: React.FC = () => {
 *     const deleteQuestionMutation = useDeleteQuestion()
 *
 *     const handleDeleteQuestion = (questionId: string) => {
 *         deleteQuestionMutation.mutate(questionId)
 *         // ... rest of the code ...
 *     }
 *     // ... rest of the code ...
 * }
 * ```
 */
export function useDeleteQuestion() {
    const queryClient = useQueryClient()
    return useMutation(deleteQuestion, {
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['question'] })
        },
        onError: (error: ApiError) => {},
    })
}

/**
 * Mutation-hook for deleting all questions from the backend.
 *
 * Automatically refetches and updates the questions state from the
 * `useAllQuestions` hook.
 *
 * @example
 * ```ts
 * const MyComponent: React.FC = () => {
 *     const deleteAllQuestionsMutation = useDeleteAllQuestions()
 *
 *     const handleDeleteAllQuestions = () => {
 *         deleteAllQuestionsMutation.mutate()
 *         // ... rest of the code ...
 *     }
 *     // ... rest of the code ...
 * }
 * ```
 */
export function useDeleteAllQuestions() {
    const queryClient = useQueryClient()
    return useMutation(deleteAllQuestions, {
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['question'] })
        },
        onError: (error: ApiError) => {},
    })
}
