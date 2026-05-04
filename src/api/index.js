

// The axios instance — only import this in service files, not components
export { default as api } from './client'

// Auth helpers — which ones you use depends on JWT vs session
export { getAccessToken, setAccessToken, clearTokens, initializeAuth } from './tokenStore' // JWT only
export { isSessionValid } from './sessionHandler'  // Session only
export { getCsrfToken, ensureCsrfCookie } from './csrf'

// Error utilities — used in every component's catch block
export { parseApiError, isAuthError, hasFieldErrors } from './errorHandler'

// Services — components import from here, never from client.js directly
// (add each one as you build it)
// export { authService } from './services/authService'
// export { userService } from './services/userService's