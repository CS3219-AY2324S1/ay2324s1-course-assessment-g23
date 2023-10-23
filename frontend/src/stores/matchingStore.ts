import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ApiError } from '../api/error'
import { cancelMatch, getMatch } from '../api/matching'
import { Complexity } from '../api/questions'
import { useSessionDetails } from './sessionStore'

/**
 * Hook for getting the currently matched user's ID.
 *
 * If not currently matched, the data is `null`.
 *
 * @example
 * ```ts
 * const MyComponent: React.FC = () => {
 *     const { data: matchedUserId } = useMatch()
 *     // where `matchedUserId: string | null`
 *     // ... rest of the code ...
 * }
 * ```
 */
export function useMatch() {
    return useQuery<string | null, ApiError>({
        queryKey: ['matching'],
        initialData: null,
        enabled: false,
    })
}

/**
 * Mutation-hook for joining the matchmaking queue.
 *
 * - When in the queue, `isLoading` will be `true`. When not, it's `false`.
 * - Upon successful match, `isSuccess` will be `true`.
 * - Upon queue-timeout, cancellation or connection loss, `isError` will be `true`.
 *
 * @example
 * ```ts
 * const MyComponent: React.FC = () => {
 *     const joinQueueMutation = useJoinQueue()
 *     const {
 *         isLoading: isFindingMatch,
 *         isSuccess: isMatchSuccess,
 *         isError: isMatchFail,
 *     } = joinQueueMutation
 *
 *     const startFindMatch = (difficulty: Complexity) => {
 *         joinQueueMutation.mutateAsync(difficulty)
 *         // ... rest of the code ...
 *     }
 *     // ... rest of the code ...
 * }
 * ```
 */
export function useJoinQueue() {
    const { data: session } = useSessionDetails()
    const queryClient = useQueryClient()
    return useMutation(
        async (complexity: Complexity) => {
            if (!session) return null
            return await getMatch({ user_id: session.user_id, complexity })
        },
        {
            onSuccess: (data) => {
                queryClient.setQueryData(['matching'], data)
            },
            onError: (error: ApiError) => {},
        }
    )
}

/**
 * Mutation-hook for cancelling the ongoing matchmaking queue.
 *
 * - Only time when `isError` is `true` is when you try to cancel when there's
 *   no ongoing queue.
 *
 * @example
 * ```ts
 * const MyComponent: React.FC = () => {
 *     const cancelQueueMutation = useCancelQueue()
 *
 *     const stopFindMatch = () => {
 *         cancelQueueMutation.mutateAsync()
 *     }
 *     // ... rest of the code ...
 * }
 * ```
 */
export function useCancelQueue() {
    const { data: session } = useSessionDetails()
    const queryClient = useQueryClient()
    return useMutation(
        async () => {
            if (!session) return null
            return await cancelMatch(session.user_id)
        },
        {
            onSuccess: () => {
                queryClient.setQueryData(['matching'], null)
            },
            onError: (error: ApiError) => {},
        }
    )
}
