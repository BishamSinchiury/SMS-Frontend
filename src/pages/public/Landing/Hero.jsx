import styles from './Hero.module.css'
import { useNavigate } from 'react-router-dom'

export default function Hero({ org }) {
  const navigate = useNavigate()

  if (!org) return null   // still loading, render nothing

  return (
    <section className={styles.hero}>
      {org.background_pic && (
        <img src={org.background_pic} alt="" className={styles.heroBg} />
      )}
      <div className={styles.heroOverlay} />
      <div className={styles.heroShape1} />
      <div className={styles.heroShape2} />
      <div className={styles.heroShape3} />

      <div className={styles.heroContent}>
        <div className={styles.logoWrap}>
          {org.logo
            ? <img src={org.logo} alt={org.name} className={styles.logo} />
            : <div className={styles.logoFallback}><span>{org.name?.[0] ?? 'S'}</span></div>
          }
        </div>
        {org.moto && <p className={styles.moto}>{org.moto}</p>}
        <h1 className={styles.schoolName}>{org.name}</h1>
        {org.tagline && <p className={styles.tagline}>{org.tagline}</p>}
        <div className={styles.divider} />
        <div className={styles.scrollCue}>
          <span className={styles.scrollLabel}>Scroll to explore</span>
          <div className={styles.scrollLine} />
        </div>
      </div>

      <button
        className={styles.cornerAdmin}
        onClick={() => navigate('/admin/login')}
      >
        Admin
      </button>
    </section>
  )
}