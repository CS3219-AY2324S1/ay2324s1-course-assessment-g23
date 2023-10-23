import { ApiError } from './error'

/** URL for authentication API. */
const AUTH_API_URL = 'http://localhost:8000/sessions'

/** HTTP request headers for authentication API. */
const AUTH_API_HEADER = { 'Content-Type': 'application/json' }

/** Represents a session's details. */
export interface SessionDetails {
    session_id: string
    user_id: string
    role: 'normal' | 'maintainer'
    creation_time: string
    expiration_time: string
}

/** Represents user login details. */
export interface UserLoginDetails {
    username: string
    password: string
}

/**
 * Gets current session details.
 *
 * @returns {Promise<SessionDetails | null>} Resolves with the session details or null if no valid session is found.
 * @throws {ApiError} Throws an ApiError if the API response indicates an error.
 */
export async function getSession(): Promise<SessionDetails | null> {
    const response = await fetch(AUTH_API_URL, {
        method: 'GET',
        headers: AUTH_API_HEADER,
        credentials: 'include',
    })

    // Stale session.
    if (response.status === 401) return null

    if (!response.ok) throw await ApiError.parseResponse(response)

    const data: SessionDetails = await response.json()
    return data
}

/**
 * Logs in a user. The session ID is expected be set as a cookie by the response
 * request's `Set-Cookie` header.
 *
 * @param {UserLoginDetails} loginDetails The user's login details, containing username and password.
 * @returns {Promise<{ user_details: SessionDetails, message: string }>}
 * Resolves with the user session details and message.
 * @throws {ApiError} Throws an ApiError if the API response indicates an error.
 */
export async function userLogin(
    loginDetails: UserLoginDetails
): Promise<{ user_details: SessionDetails; message: string }> {
    const response = await fetch(AUTH_API_URL, {
        method: 'POST',
        headers: AUTH_API_HEADER,
        body: JSON.stringify(loginDetails),
        credentials: 'include',
    })

    if (!response.ok) throw await ApiError.parseResponse(response)

    const data: { user_details: SessionDetails; message: string } = await response.json()
    return data
}

/**
 * Logs out a user.
 *
 * @returns {Promise<string>} Resolves with the logout message.
 * @throws {ApiError} Throws an ApiError if the API response indicates an error.
 */
export async function userLogout(): Promise<string> {
    const response = await fetch(`${AUTH_API_URL}`, {
        method: 'DELETE',
        headers: AUTH_API_HEADER,
        credentials: 'include',
    })

    if (!response.ok) throw await ApiError.parseResponse(response)

    const data: { message: string } = await response.json()
    return data.message
}
