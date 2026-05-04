import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, parseApiError } from '@/api/index'

const Landing = () => {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const checkOrgStatus = async () => {
      try {
        const res = await api.get('/org/status/')
        const { is_setup } = res.data

        if(!has_sysadmin){

        }
      } catch{

      }
    }
  })
  return (
    <div>Landing</div>
  )
}

export default Landing