import api from '@/api/client'

export async function isSessionValid(params) {
    try {
        console.log("here")
        const response = await api.get('/auth/admin/me/')
        console.log(response.data)
        return response.data
    } catch {
        return null
    }
}