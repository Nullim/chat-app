import { useState } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

import { PENDING_MESSAGE } from "../../../utils/constants"
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { login } from "../../../redux/thunks/authThunk"
import { ResetPassProps } from "../../../pages/home/Home"
import { LoginUser, LoginUserSchema } from "../../../utils/zod/User"

const Login: React.FC<ResetPassProps> = ({ setReset }) => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const auth = useAppSelector(state => state.auth)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const payload: LoginUser = {
      username: username,
      password: password
    }

    try {
      LoginUserSchema.parse(payload)
      console.log('Valid')
    } catch (err) {
      return toast.error(err.issues[0].message)
    }

    toast.promise(
      dispatch(login(payload)).unwrap(),
      {
        success: {
          render() {
            navigate('/chat')
            return "Success! Redirecting..."
          }
        },
        error: {
          render({ data }) {
            return data as string
          }
        }
      }
    )
  }

  return (
    <div className="form-container">
      <h3>Log back in</h3>
      <form className="form-body" onSubmit={handleSubmit}>
        <div className="form-wrapper">
          <label className="form-label" htmlFor="username">Username</label>
          <input
            className="form-input"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-wrapper">
          <label className="form-label" htmlFor="pass">Password</label>
          <input
            className="form-input"
            name="pass"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <p className="form-utilities" onClick={() => setReset(true)}>Forgot your password?</p>
        <div className="form-button-container">
          <button
            type="submit"
            className={`form-button ${auth.loginStatus === PENDING_MESSAGE ? 'form-button-loading' : ''}`}
            disabled={auth.loginStatus === PENDING_MESSAGE}
          >
            {auth.loginStatus === PENDING_MESSAGE ? <div className="loading">Loading</div> : <div>Sign in</div>}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login