
/**
 * The normalized error shape every component receives:
 * @typedef {Object} ApiError
 * @property {'network'|'validation'|'auth'|'notfound'|'ratelimit'|'server'|'unknown'} type
 * @property {string|null} message   - human-readable top-level message
 * @property {Object} fields         - field-level errors { fieldName: "message" }
 */

export function parseApiError(error) {

    // ── No response: network/timeout error ──────────────────────────────────
    // This happens when Django isn't running, the user is offline,
    // or the request timed out (client.js sets a 15s timeout).
    if (!error.response) {
        return {
            type: 'network',
            message: navigator.onLine
                ? 'Request timed out. The server may be down.'
                : 'No internet connection.',
            fields: {},
        }
    }

    const { status, data } = error.response

    // ── 400 Bad Request: validation errors ──────────────────────────────────
    // DRF sends field errors as { fieldName: ["message"] }
    // and non-field errors as { non_field_errors: ["message"] }
    if (status === 400) {
        const fields = {}

        Object.entries(data || {}).forEach(([key, value]) => {
            if (key === 'non_field_errors') return // handled separately below
            // DRF wraps each message in an array — take the first one
            fields[key] = Array.isArray(value) ? value[0] : value
        })

        return {
            type: 'validation',
            // non_field_errors shows as the top banner; field errors show inline
            message: data?.non_field_errors?.[0] ?? null,
            fields,
        }
    }

    // ── 401 Unauthorized: not logged in or token expired ────────────────────
    // The response interceptor already tried to refresh the token.
    // If we reach here, the refresh also failed — user must log in.
    if (status === 401) {
        return {
            type: 'auth',
            message: 'Your session has expired. Please log in again.',
            fields: {},
        }
    }

    // ── 403 Forbidden: logged in but not allowed ─────────────────────────────
    if (status === 403) {
        return {
            type: 'auth',
            message: data?.detail ?? 'You do not have permission to do this.',
            fields: {},
        }
    }

    // ── 404 Not Found ────────────────────────────────────────────────────────
    if (status === 404) {
        return {
            type: 'notfound',
            message: 'The requested resource was not found.',
            fields: {},
        }
    }

    // ── 429 Too Many Requests ────────────────────────────────────────────────
    if (status === 429) {
        return {
            type: 'ratelimit',
            message: 'Too many attempts. Please wait a moment and try again.',
            fields: {},
        }
    }

    // ── 500+ Server Error ────────────────────────────────────────────────────
    if (status >= 500) {
        return {
            type: 'server',
            message: 'Something went wrong on our end. Try again in a moment.',
            fields: {},
        }
    }

    // ── Fallback ─────────────────────────────────────────────────────────────
    return {
        type: 'unknown',
        message: data?.detail ?? 'An unexpected error occurred.',
        fields: {},
    }
}


/**
 * isAuthError
 * -----------
 * Quick check used in components to decide whether to redirect to login.
 *
 * Usage:
 *   if (isAuthError(error)) navigate('/login')
 */
export function isAuthError(parsedError) {
    return parsedError?.type === 'auth'
}

/**
 * hasFieldErrors
 * --------------
 * Quick check to know if there are any inline field errors to display.
 *
 * Usage:
 *   if (hasFieldErrors(error)) scrollToFirstError()
 */
export function hasFieldErrors(parsedError) {
    return Object.keys(parsedError?.fields ?? {}).length > 0
}