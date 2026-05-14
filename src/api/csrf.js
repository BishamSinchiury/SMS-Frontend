export function getCsrfToken() {
  if (typeof document === 'undefined') return null

  return (
    document.cookie
      .split(';')
      .map(c => c.trim())
      .find(c => c.startsWith('csrftoken'))
      ?.split('=')[1] ?? null
  )
}

export async function ensureCsrfCookie() {
  const already = getCsrfToken()
  if (already) return
  await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/auth/csrf/`,
    { credentials: 'include' }
  )
}