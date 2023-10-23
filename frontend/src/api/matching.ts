import { ApiError } from './error'
import type { Complexity } from './questions'

/** URL for matching websocket API. */
const MATCHING_API_URL = 'ws://localhost:8000/ws'

/** Details needed to join the matchmaking queue. */
export interface MatchingRequest {
    user_id: string
    complexity: Complexity
}

interface QueuePayload {
    user_id: string
    complexity: Lowercase<Complexity>
    action: 'queue'
}
interface CancelPayload {
    user_id: string
    action: 'cancel'
}

/** Payload that's accepted by the matching-service. */
type MatchingRequestPayload = QueuePayload | CancelPayload

/** Payload that's returned by the matching-service. */
interface MatchingResponsePayload {
    is_matched: boolean
    detail: string
    user_id: string | null
}

/** The websocket used for matchmaking. */
let ws: WebSocket | null = null

/**
 * Joins the matchmaking queue.
 *
 * The promise resolves with the matched user's ID upon successful match,
 * else it rejects with an `ApiError` upon queue-timeout, cancellation or
 * connection loss.
 *
 * Also rejects with `ApiError` if a match is already ongoing.
 *
 * @param matchRequest Details needed to start queuing for a match.
 * @returns Matched user's ID.
 * @throws {ApiError} Throws an ApiError if the API response indicates an error.
 */
export async function getMatch(matchRequest: MatchingRequest): Promise<string> {
    return new Promise((resolve, reject) => {
        if (ws !== null)
            return reject(
                new ApiError(ApiError.FRONTEND_ERROR_STATUS_CODE, 'A match is already ongoing.')
            )

        ws = new WebSocket(MATCHING_API_URL)

        ws.onopen = () => {
            const payload: MatchingRequestPayload = {
                user_id: matchRequest.user_id,
                complexity: matchRequest.complexity.toLowerCase() as Lowercase<Complexity>,
                action: 'queue',
            }
            ws!.send(JSON.stringify(payload))
        }

        ws.onmessage = (event) => {
            const responsePayload: MatchingResponsePayload = JSON.parse(event.data)
            if (responsePayload.is_matched) resolve(responsePayload.user_id!)
            else reject(new ApiError(ApiError.WEBSOCKET_ERROR_STATUS_CODE, responsePayload.detail))
            ws!.close()
            ws = null
        }

        ws.onclose = () => {
            reject(new ApiError(ApiError.WEBSOCKET_ERROR_STATUS_CODE, 'Connection died.'))
            ws = null
        }
    })
}

/**
 * Cancels the ongoing matchmaking queue.
 *
 * @param matchRequest Details needed to start queuing for a match.
 * @returns Matched user's ID.
 * @throws {ApiError} Throws an ApiError if there's no match currently ongoing.
 */
export async function cancelMatch(user_id: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (ws === null)
            return reject(new ApiError(ApiError.FRONTEND_ERROR_STATUS_CODE, 'No match to cancel.'))

        const payload: MatchingRequestPayload = {
            user_id,
            action: 'cancel',
        }
        ws.send(JSON.stringify(payload))
        resolve()
    })
}
