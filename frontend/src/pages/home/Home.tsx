import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { setUser } from "../../redux/auth/authSlice"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import Login from "../../components/Form/Login/Login"
import Register from "../../components/Form/Register/Register"
import ResetPass from "../../components/Form/ResetPassword/ResetPass"

import "./Home.css"
import "../../components/Form/Form.css"
import axiosInstance from "../../api/axiosInstance"

export type ResetPassProps = {
  setReset: React.Dispatch<React.SetStateAction<boolean>>
}

const Home = () => {
  const [reset, setReset] = useState<boolean>(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axiosInstance.post('auth/verify')

        if(response.status === 200) {
          const user = response.data
          if (user) {
            dispatch(setUser(user))
            toast.info('Already Logged in, redirecting...', {
              toastId: 1,
              autoClose: 1500
            })
            navigate('/chat')
          }
        }
      // eslint-disable-next-line no-empty
      } catch {}
    }
    verifyUser()
  }, [dispatch, navigate])


  return (
    <div className="home-container">
      <div style={{ height: "20vh"}}>
        <h1>Welcome to Skyline!</h1>
        <h2>Connecting you with all others under the sky.</h2>
      </div>
      <div className="home-form">
        {reset ? <ResetPass setReset={setReset} /> : <Login setReset={setReset} />}
        <Register />
      </div>
      <div className="links">
        <a href="https://www.vecteezy.com/free-photos/background">Background Stock photos by Vecteezy</a>
      </div>
    </div>
  )
}

export default Home