import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert } from '@/components/Alert/Alert'
import { Button } from '@/components/Button/Button'
import { useSysadmin } from '@/context/SysadminAuthContext'
import { adminLoginStep1, adminVerifyOtp } from '@/api/services/adminAuthService'
import { parseApiError } from '@/api/errorHandler'
import styles from './AdminLogin.module.css'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { setSysadmin } = useSysadmin()

  const [step, setStep]             = useState('credentials')
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [otp, setOtp]               = useState('')
  const [error, setError]           = useState(null)
  const [loading, setLoading]       = useState(false)
  const [showPassword, setShowPassword] = useState(false)   // ← new

  async function handleCredentials(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await adminLoginStep1(email, password)
      setStep('otp')
    } catch (err) {
      setError(parseApiError(err))
    } finally {
      setLoading(false)
    }
  }

  async function handleOtp(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await adminVerifyOtp(email, otp)
      setSysadmin(res.data.user)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(parseApiError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* ── Left panel — branding ─────────────────────────────── */}
        <div className={styles.brand}>
          <div className={styles.logoWrap}>
            {/* Replace with your actual <img> once you have a logo */}
            <div className={styles.logoPlaceholder}>S</div>
          </div>
          <h2 className={styles.orgName}>SchoolMS</h2>
          <p className={styles.orgTagline}>
            System Administrator Portal
          </p>
          <ul className={styles.featureList}>
            <li>Manage schools &amp; branches</li>
            <li>Control user access</li>
            <li>Monitor system health</li>
          </ul>
        </div>

        {/* ── Right panel — form ────────────────────────────────── */}
        <div className={styles.formPanel}>

          <div className={styles.header}>
            <h1 className={styles.title}>
              {step === 'credentials' ? 'Admin Login' : 'Verify OTP'}
            </h1>
            <p className={styles.subtitle}>
              {step === 'credentials'
                ? 'Sign in to the system administrator panel'
                : `Enter the 6-digit code sent to ${email}`}
            </p>
          </div>

          {error?.message && (
            <Alert type="error" message={error.message} />
          )}

          {step === 'credentials' ? (
            <form onSubmit={handleCredentials} className={styles.form}>

              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input
                  className={`${styles.input} ${error?.fields?.email ? styles.inputError : ''}`}
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  autoFocus
                />
                {error?.fields?.email && (
                  <span className={styles.fieldError}>{error.fields.email}</span>
                )}
              </div>

              <div className={styles.field}>
                {/* Label row — label on left, forgot password on right */}
                <div className={styles.labelRow}>
                  <label className={styles.label}>Password</label>
                  <button
                    type="button"
                    className={styles.forgotLink}
                    onClick={() => alert('Forgot password flow — coming soon')}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Password input with show/hide toggle inside */}
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${error?.fields?.password ? styles.inputError : ''}`}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowPassword(p => !p)}
                    tabIndex={-1}          // don't tab-focus this, focus the input
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>

                {error?.fields?.password && (
                  <span className={styles.fieldError}>{error.fields.password}</span>
                )}
              </div>

              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Verifying...' : 'Continue'}
              </Button>

            </form>

          ) : (

            <form onSubmit={handleOtp} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>One-Time Password</label>
                <input
                  className={`${styles.input} ${styles.otpInput} ${error?.fields?.otp ? styles.inputError : ''}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  required
                  autoFocus
                />
                {error?.fields?.otp && (
                  <span className={styles.fieldError}>{error.fields.otp}</span>
                )}
              </div>

              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Sign In'}
              </Button>

              <button
                type="button"
                className={styles.backLink}
                onClick={() => { setStep('credentials'); setError(null); setOtp('') }}
              >
                ← Back
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  )
}