import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { setUser } from '../redux/slices/authSlice'
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';

const Protected = () => {
  const [loading, setLoading] = useState(true)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector(state => state.auth.user)

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axiosInstance.post('/auth/verify')

        if(response.status === 200) {
          const user = response.data
          if (user) {
            dispatch(setUser(user))
          }
        }
      } catch(err) {
        console.error('Unexpected authorization error')
      } finally {
        setLoading(false)
      }
    }
    verifyUser()
  }, [dispatch, navigate])

  if(loading) {
    return null
  }

  if(user) {
    return <Outlet />
  } else {
    toast.error('Please log in to view this page.', {
      toastId: 1
    })
    return <Navigate to="/" replace />
  }
}

export default Protected