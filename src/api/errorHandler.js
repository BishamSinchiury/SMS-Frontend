/**
 * The normalized error shape every component receives:
 * @typedef {Object} ApiError
 * @property {'network'|'validation'|'auth'|'notfound'|'ratelimit'|'server'|'unknown'} type
 * @property {string|null} message  
 * @property {Object} fields  
 */

export function parseApiError(error) {

    if(!error.response) {
        return {
            type: 'network',
            message: navigator.onLine
            ? 'Request time out. The servermay be down.'
            : 'No internet connection.',
            fields: {},
        }
    }
}

const { status, data } = error.response

if (status===400) {
    const fields = {}

    Object.entries(data || {}).forEach(([key, value]) => {
        if (key === 'non_field_errors') return
        fields[key] = Array.isArray(value) ? value[0] : value
    })
    return {
        type: 'validation',
        message: data?.non_field_errors?.[0] ?? null,
        fields,
    }

}