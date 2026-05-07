import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ServerDown.module.css'
import { api } from '@/api/index'
import { parseApiError } from '@/api/index'

const MESSAGES = [
  "The hamsters powering our servers are on a coffee break.",
  "Our server is doing some deep thinking. Very deep.",
  "Tech team is staring at the screen hoping it fixes itself.",
  "Server.exe has stopped working. Have you tried turning it off and on?",
  "Even servers need a nap sometimes.",
]

export default function ServerDown() {
  const navigate  = useNavigate()
  const [msg]     = useState(() => MESSAGES[Math.floor(Math.random() * MESSAGES.length)])
  const [dots, setDots]       = useState('')
  const [retrying, setRetrying] = useState(false)
  const [count, setCount]     = useState(30)   // countdown to auto-retry

  // Animate the "..." dots
  useEffect(() => {
    const id = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.')
    }, 500)
    return () => clearInterval(id)
  }, [])

  // Countdown timer
  useEffect(() => {
    if (count <= 0) { handleRetry(); return }
    const id = setTimeout(() => setCount(c => c - 1), 1000)
    return () => clearTimeout(id)
  }, [count])

  async function handleRetry() {
  setRetrying(true)
  try {
    await api.get('/org/status/')
    // If we get here, server responded with 2xx — go home
    navigate('/')
  } catch (err) {
    const parsed = parseApiError(err)
    if (parsed.type === 'network') {
      // Still no response — server still down, reset countdown
      setCount(30)
    } else {
      // Server responded with an error (4xx, 5xx) but it IS up
      // Go back to landing and let it handle the error properly
      navigate('/')
    }
  } finally {
    setRetrying(false)
  }
}

  return (
    <div className={styles.page}>

      {/* Animated coffee cup */}
      <div className={styles.scene}>
        <div className={styles.monitor}>
          <div className={styles.screen}>
            <span className={styles.errorCode}>503</span>
            <span className={styles.errorLabel}>Service Unavailable</span>
          </div>
          <div className={styles.stand} />
          <div className={styles.base} />
        </div>

        <div className={styles.coffeeWrap}>
          <div className={styles.cup}>
            <div className={styles.liquid} />
            <div className={styles.handle} />
          </div>
          <div className={styles.steam}>
            <span className={styles.steamLine} style={{ animationDelay: '0s' }} />
            <span className={styles.steamLine} style={{ animationDelay: '0.3s' }} />
            <span className={styles.steamLine} style={{ animationDelay: '0.6s' }} />
          </div>
        </div>
      </div>

      {/* Text */}
      <h1 className={styles.title}>Server is taking a break{dots}</h1>
      <p className={styles.subtitle}>{msg}</p>

      {/* Retry */}
      <div className={styles.actions}>
        <button
          className={styles.retryBtn}
          onClick={() => { setCount(30); handleRetry() }}
          disabled={retrying}
        >
          {retrying ? 'Checking...' : 'Retry Now'}
        </button>
        <span className={styles.countdown}>
          Auto-retrying in <strong>{count}s</strong>
        </span>
      </div>

    </div>
  )
}