import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userLogin, userLogout } from '../api/auth'
import { ApiError } from '../api/error'
import { storeUser } from '../api/users'

export const ACCESS_TOKEN_COOKIE_NAME = 'access_token'
export const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token'

/**
 * Mutation-hook for logging in a user.
 *
 * Automatically refetches and updates the current-user state from the
 * `useCurrentUser` hook.
 *
 * @example
 * ```ts
 * const MyComponent: React.FC = () => {
 *     const loginUserMutation = useLoginUser()
 *
 *     const handleLogin = (
 *         credentials: { username: string, password: string }
 *     ) => {
 *         loginUserMutation.mutate(credentials)
 *         // ... rest of the code ...
 *     }
 *     // ... rest of the code ...
 * }
 * ```
 */
export function useLoginUser() {
    const queryClient = useQueryClient()

    return useMutation(userLogin, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', 'me'] })
        },
        onError: (error: ApiError) => {},
    })
}

/**
 * Mutation-hook for logging out a user.
 *
 * Automatically refetches and updates the current-user state from the
 * `useCurrentUser` hook.
 *
 * @example
 * ```ts
 * const MyComponent: React.FC = () => {
 *     const logoutUserMutation = useLogoutUser()
 *
 *     const handleLogout = () => {
 *         logoutUserMutation.mutate()
 *         // ... rest of the code ...
 *     }
 *     // ... rest of the code ...
 * }
 * ```
 */
export function useLogoutUser() {
    const queryClient = useQueryClient()

    return useMutation(userLogout, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', 'me'] })
        },
        onError: (error: ApiError) => {},
    })
}

/**
 * Mutation-hook for signing up a new user.
 *
 * @example
 * ```tsx
 * const MyComponent: React.FC = () => {
 *     const signupUserMutation = useSignupUser()
 *
 *     const handleSignup = (signupDetails: UserSignupDetails) => {
 *         signupUserMutation.mutate(signupDetails)
 *         // ... rest of the code ...
 *     }
 *     // ... rest of the code ...
 * }
 * ```
 */
export function useSignupUser() {
    return useMutation(storeUser, {
        onError: (error: ApiError) => {},
    })
}
