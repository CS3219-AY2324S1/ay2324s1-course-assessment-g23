import { ApiError } from './error'

/** URL for authentication API. */
const AUTH_API_URL = '/api/users'

/** HTTP request headers for authentication API. */
const AUTH_API_HEADER = { 'Content-Type': 'application/json' }

/** Represents user login details. */
export interface UserLoginDetails {
    username: string
    password: string
}

/**
 * Logs in a user. The access/refresh tokens are expected be set as a cookie by
 * the response's `Set-Cookie` headers.
 *
 * @param loginDetails - The user's login details, containing username and password.
 * @returns Resolves with the login message.
 * @throws {ApiError} Throws an ApiError if the API response indicates an error.
 */
export async function userLogin(loginDetails: UserLoginDetails): Promise<string> {
    const response = await fetch(AUTH_API_URL + '/token', {
        method: 'POST',
        headers: AUTH_API_HEADER,
        body: JSON.stringify(loginDetails),
        credentials: 'include',
    })

    if (!response.ok) throw await ApiError.parseResponse(response)

    const data: { message: string } = await response.json()
    return data.message
}

/**
 * Logs out a user.
 *
 * @returns Resolves with nothing.
 * @throws {ApiError} Throws an ApiError if the API response indicates an error.
 */
export async function userLogout(): Promise<void> {
    const response = await fetch(AUTH_API_URL + '/token', {
        method: 'DELETE',
        headers: AUTH_API_HEADER,
        credentials: 'include',
    })

    if (!response.ok) throw await ApiError.parseResponse(response)
}

/**
 * Refresh JWT `access_token` cookie using `refresh_token` cookie.
 *
 * @returns Resolves with nothing.
 * @throws {ApiError} Throws an ApiError if the API response indicates an error.
 */
export async function refreshAccessToken(): Promise<void> {
    const response = await fetch(AUTH_API_URL + '/refresh', {
        method: 'GET',
        headers: AUTH_API_HEADER,
        credentials: 'include',
    })

    if (!response.ok) throw await ApiError.parseResponse(response)
}
