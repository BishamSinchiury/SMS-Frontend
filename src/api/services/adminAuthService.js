import { submitJson } from '@/api/formHandler'
import api from '@/api/client'

// Step 1 — verify credentials, trigger OTP email
export async function adminLoginStep1(email, password) {
  return submitJson('/auth/admin/login/', { email, password })
}

// Step 2 — submit OTP, receive session cookie
export async function adminVerifyOtp(email, otp) {
  return submitJson('/auth/admin/verify-otp/', { email, otp })
}

// Logout — destroy session on backend
export async function adminLogout() {
  return api.post('/auth/admin/logout/')
}