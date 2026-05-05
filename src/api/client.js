// client.js
import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 150000,
    withCredentials: true,
    headers: {
        'Accept':       'application/json',
        'Content-Type': 'application/json'
    },
})

export default api  