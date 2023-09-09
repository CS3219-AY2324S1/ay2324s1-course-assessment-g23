import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getAllQuestions,
    getQuestion,
    storeQuestion,
    updateQuestion,
    deleteQuestion,
    deleteAllQuestions,
    Question,
} from '../services/questionBank'

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
    return useQuery({
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
    return useQuery({
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
        onMutate: async (newQuestion) => {
            // Based on:
            // https://tanstack.com/query/v4/docs/react/guides/optimistic-updates#updating-a-list-of-todos-when-adding-a-new-todo
            await queryClient.cancelQueries({ queryKey: ['question'] })
            const previousQuestions = queryClient.getQueryData<Question[]>(['question'])!
            const insertNewQuestion = (old: Question[] | undefined) => [
                ...old!,
                { question_id: '...', ...newQuestion },
            ]
            queryClient.setQueryData(['question'], insertNewQuestion)
            return { previousQuestions }
        },
        onError: (err, newQuestion, context) => {
            queryClient.setQueryData(['question'], context!.previousQuestions)
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['question'] })
        },
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
        onMutate: async (updatedQuestion) => {
            // Based on:
            // https://tanstack.com/query/v4/docs/react/guides/optimistic-updates#updating-a-list-of-todos-when-adding-a-new-todo
            await queryClient.cancelQueries({ queryKey: ['question'] })
            const previousQuestions = queryClient.getQueryData<Question[]>(['question'])!
            const updateQuestionInList = (old: Question[] | undefined) =>
                old!.map((q) =>
                    q.question_id === updatedQuestion.question_id ? { ...q, ...updatedQuestion } : q
                )
            queryClient.setQueryData(['question'], updateQuestionInList)
            return { previousQuestions }
        },
        onError: (err, updatedQuestion, context) => {
            queryClient.setQueryData(['question'], context!.previousQuestions)
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['question'] })
        },
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
        onMutate: async (id: string) => {
            // Based on:
            // https://tanstack.com/query/v4/docs/react/guides/optimistic-updates#updating-a-list-of-todos-when-adding-a-new-todo
            await queryClient.cancelQueries({ queryKey: ['question'] })
            const previousQuestions = queryClient.getQueryData<Question[]>(['question'])!
            const removeQuestionFromList = (old: Question[] | undefined) =>
                old!.filter((q) => q.question_id !== id)
            queryClient.setQueryData(['question'], removeQuestionFromList)
            return { previousQuestions }
        },
        onError: (err, id, context) => {
            queryClient.setQueryData(['question'], context!.previousQuestions)
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['question'] })
        },
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
        onMutate: async () => {
            // Based on:
            // https://tanstack.com/query/v4/docs/react/guides/optimistic-updates#updating-a-list-of-todos-when-adding-a-new-todo
            await queryClient.cancelQueries({ queryKey: ['question'] })
            const previousQuestions = queryClient.getQueryData<Question[]>(['question'])!
            queryClient.setQueryData(['question'], [])
            return { previousQuestions }
        },
        onError: (err, variables, context) => {
            queryClient.setQueryData(['question'], context!.previousQuestions)
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['question'] })
        },
    })
}
