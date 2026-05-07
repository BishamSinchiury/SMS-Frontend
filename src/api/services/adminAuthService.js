import { submitJson } from '@/api/formHandler'
import { ensureCsrfCookie } from '@/api/csrf'
import api from '@/api/client'

// Step 1 — verify credentials, trigger OTP email
export async function adminLoginStep1(email, password) {
  await ensureCsrfCookie()
  return submitJson('/admin/auth/login/', { email, password })
}

// Step 2 — submit OTP, receive session cookie
export async function adminVerifyOtp(email, otp) {
  await ensureCsrfCookie()
  return submitJson('/admin/auth/verify-otp/', { email, otp })
}

// Logout — destroy session on backend
export async function adminLogout() {
  await ensureCsrfCookie()
  return api.post('/admin/auth/logout/')
}