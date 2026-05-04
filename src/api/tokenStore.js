import axios from 'axios'

let _accessToken = null

export const getAccessToken = () => _accessToken

export const setAccessToken = (token) => { _accessToken = token}

export const clearTokens = () => { _accessToken = null }


export async function refreshAccessToken() {
  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/auth/token/refresh/`,
    {},
    { withCredentials: true }
  )
  setAccessToken(response.data.access)
  return response.data.access
}

export async function initializeAuth() {
  try {
    await refreshAccessToken()
    return true
  } catch {
    clearTokens()
    return false
  }
}