import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, parseApiError } from '@/api/index'
import { Modal, ModalActions } from '@/components/Modal/Modal'

function applyOrgColors(primary, secondary) {
  const root = document.documentElement
  if (primary) root.style.setProperty('--color-primary', primary)
  if (secondary) root.style.setProperty('--color-secondary', secondary)
}

const Landing = () => {
  const navigate = useNavigate()

  const [isSetup, setisSetup] = useState(false)
  const [error, setError] = useState(null)
  const [parsed, setParsed] = useState({})

  useEffect(() => {
    const checkOrgStatus = async () => {
      try {
      const res = await api.get('/org/status/')
      setisSetup(res.data.is_setup)
      if (!isSetup){
        navigate("/admin/login")
      }
      
    
      } catch (err){
        const parsed = parseApiError(err)
        console.log('parsed error ->', parsed)
         setError(parsed) 
      }
    }

    checkOrgStatus()
  }, [])

  return (
    <>
    <div>Landing</div>
    <Modal
      isOpen={!!error}
      title="Something went wrong"
      onClose={() => setError(null)}
      actions={
          <ModalActions
            onOk={() => setError(null)}
          />
        }
      >
      <p>{error?.message}</p>
    </Modal>
    </>
  )
}

export default Landing