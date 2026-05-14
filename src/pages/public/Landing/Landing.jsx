import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, parseApiError } from '@/api/index'
import { Modal, ModalActions } from '@/components/Modal/Modal'
import { getOrgProfile } from '@/api/services/orgService'
import Hero from './Hero'
import styles from './Landing.module.css'

const DEMO_ORG = {
  name:            'Everest Academy',
  tagline:         'Shaping Minds, Building Futures',
  moto:            'Excellence in Education, Character in Life',
  logo:            null,
  background_pic:  null,
  primary_color:   '#8B1A1A',
  secondary_color: '#C8962A',
}

export default function Landing() {
  const navigate = useNavigate()
  const [org, setOrg]               = useState(null)
  const [isSetup, setIsSetup]       = useState(null)
  const [error, setError]           = useState(null)
  const [navVisible, setNavVisible] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    const init = async () => {
      try {
        const [statusRes, orgData] = await Promise.all([
          api.get('/org/status/'),
          getOrgProfile(),
        ])
        setIsSetup(statusRes.data.is_setup)
        setOrg(orgData)
      } catch (err) {
        const parsed = parseApiError(err)
        if (parsed.type === 'network' || parsed.type === 'server') {
          navigate('/server-down')
        } else if (parsed.type === 'notfound') {
          setIsSetup(false)
          setOrg(DEMO_ORG)
        } else {
          setError(parsed)
          setOrg(DEMO_ORG)
        }
      }
    }
    init()
  }, [])

  // Apply brand colors
  useEffect(() => {
    if (!org) return
    const root = document.documentElement
    root.style.setProperty('--color-primary',   org.primary_color   || '#8B1A1A')
    root.style.setProperty('--color-secondary', org.secondary_color || '#C8962A')
  }, [org])

  // Navbar observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setNavVisible(!entry.isIntersecting),
      { threshold: 0.1 }
    )
    if (heroRef.current) observer.observe(heroRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* Navbar */}
      <nav className={`${styles.navbar} ${navVisible ? styles.navbarVisible : ''}`}>
        <div className={styles.navInner}>
          <div className={styles.navBrand}>
            {org?.logo
              ? <img src={org.logo} alt={org.name} className={styles.navLogo} />
              : <span className={styles.navLogoText}>{org?.name?.[0] ?? 'S'}</span>
            }
            <span className={styles.navName}>{org?.name}</span>
          </div>
          <button
            className={styles.navAdminBtn}
            onClick={() => navigate('/admin/login')}
          >
            Admin Login
          </button>
        </div>
      </nav>

      {/* Hero — pass ref so navbar observer can watch it */}
      <div ref={heroRef}>
        <Hero org={org} />
      </div>

      {/* Future sections go here as separate components */}
      {/* <AboutSection org={org} /> */}
      {/* <StatsSection /> */}

      <Modal
        isOpen={!!error}
        title="Something went wrong"
        onClose={() => setError(null)}
        actions={<ModalActions onOk={() => setError(null)} />}
      >
        <p>{error?.message}</p>
      </Modal>

      <Modal
        isOpen={isSetup === false}
        title="Organization Not Setup"
        onClose={() => navigate('/admin/login')}
        actions={
          <ModalActions onOk={() => navigate('/admin/login')} okLabel="Go to Setup" />
        }
      >
        <p>Looks like your organization is not set up yet. Please complete setup first.</p>
      </Modal>
    </>
  )
}