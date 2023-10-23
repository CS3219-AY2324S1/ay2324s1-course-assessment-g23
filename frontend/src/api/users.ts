import { ApiError } from './error'

/** URL for users API. */
const USERS_API_URL = 'http://localhost:8000/users'

/** HTTP request headers for users API. */
const USERS_API_HEADER = { 'Content-Type': 'application/json' }

/** Represents the details needed for signing up as a new user. */
export interface UserSignupDetails {
    username: string
    email: string
    password: string
}

/** Represents a user. */
export interface User {
    user_id: string
    username: string
    email: string
    role: string
}

export interface UpdatedUser {
    user_id: string
    username?: string
    password?: string
    email?: string
    role?: string
}

/**
 * Stores a new user.
 *
 * @param signupDetails - The signup details for creating a new user.
 * @returns Resolves with the UUID for the stored user.
 * @throws {ApiError} Throws an ApiError if the API response indicates an error.
 */
export async function storeUser(signupDetails: UserSignupDetails): Promise<string> {
    const response = await fetch(USERS_API_URL, {
        method: 'POST',
        headers: USERS_API_HEADER,
        body: JSON.stringify(signupDetails),
        credentials: 'include',
    })

    if (!response.ok) throw await ApiError.parseResponse(response)

    const data: Pick<User, 'user_id'> = await response.json()
    return data.user_id
}

/**
 * Retrieves a user by its ID.
 *
 * @param id - The ID of the user to retrieve.
 * @returns Resolves with the User object if found.
 * @throws {ApiError} Throws an ApiError if the API response indicates an error.
 */
export async function getUser(id: string): Promise<User> {
    const response = await fetch(`${USERS_API_URL}/${id}`, {
        method: 'GET',
        headers: USERS_API_HEADER,
        credentials: 'include',
    })

    if (!response.ok) throw await ApiError.parseResponse(response)

    const data: User = await response.json()
    return data
}

/**
 * Retrieves all users.
 *
 * @returns An array of users.
 * @throws {ApiError} Throws an ApiError if the API response indicates an error.
 */
export async function getAllUsers(): Promise<User[]> {
    const response = await fetch(`${USERS_API_URL}_all`, {
        method: 'GET',
        headers: USERS_API_HEADER,
        credentials: 'include',
    })

    if (!response.ok) throw await ApiError.parseResponse(response)

    const data: User[] = await response.json()
    return data
}

/**
 * Updates an existing user by its ID.
 *
 * @param updatedUser - User with the fields to update. All fields except `user_id` are optional.
 * @returns Resolves when the user is successfully updated.
 * @throws {ApiError} Throws an ApiError if the API response indicates an error.
 */
export async function updateUser(updatedUser: UpdatedUser): Promise<void> {
    // Split "role" from the rest, as it uses a different API.
    const { user_id, role, ...rolelessUpdatedUser } = updatedUser

    // Attempt to update "role" first, as it requires a higher permission.
    // (ie. if fail to update role, it will fail to update everything)
    if (role) {
        const response = await fetch(`${USERS_API_URL}_role/${user_id}`, {
            method: 'PUT',
            headers: USERS_API_HEADER,
            body: JSON.stringify({ role }),
            credentials: 'include',
        })

        if (!response.ok) throw await ApiError.parseResponse(response)
    }

    const hasNoValues = Object.values(rolelessUpdatedUser).every((x) => x === undefined)
    if (hasNoValues) return

    const response = await fetch(`${USERS_API_URL}/${user_id}`, {
        method: 'PUT',
        headers: USERS_API_HEADER,
        body: JSON.stringify(rolelessUpdatedUser),
        credentials: 'include',
    })

    if (!response.ok) throw await ApiError.parseResponse(response)
}

/**
 * Deletes a user by its ID.
 *
 * @param id - The ID of the user to be deleted.
 * @returns Resolves when the user is successfully deleted.
 * @throws {ApiError} Throws an ApiError if the API response indicates an error.
 */
export async function deleteUser(id: string): Promise<void> {
    const response = await fetch(`${USERS_API_URL}/${id}`, {
        method: 'DELETE',
        headers: USERS_API_HEADER,
        credentials: 'include',
    })

    if (!response.ok) throw await ApiError.parseResponse(response)
}

/**
 * Deletes all users.
 *
 * @returns Resolves when all users are successfully deleted.
 * @throws {ApiError} Throws an ApiError if the API response indicates an error.
 */
export async function deleteAllUsers(): Promise<void> {
    const response = await fetch(`${USERS_API_URL}_all`, {
        method: 'DELETE',
        headers: USERS_API_HEADER,
        credentials: 'include',
    })

    if (!response.ok) throw await ApiError.parseResponse(response)
}
