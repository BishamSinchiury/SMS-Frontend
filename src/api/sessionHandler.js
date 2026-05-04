export async function isSessionValid(params) {
    try {
        const response = await api.get('/auth/me/')
        return response.data
    } catch {
        return null
    }
}