import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { register } from "../../../redux/thunks/authThunk"
import { PENDING_MESSAGE } from "../../../utils/constants"
import { toast } from "react-toastify"

const Register = () => {
  const [email, setEmail] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const dispatch = useAppDispatch()
  const auth = useAppSelector(state => state.auth)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const payload = {
      email: email,
      username: username,
      password: password
    }

    toast.promise(dispatch(register(payload)).unwrap(), {
      success: "Success! Try logging in.",
      error: {
        render({ data }: { data: string}) {
          return data
        }
      }
    })
  }

  return (
    <div className="form-container">
      <h3 className="register-header">...Or join the conversation!</h3>
      <form className="form-body" onSubmit={handleSubmit}>
        <div className="form-wrapper form-wrapper-email">
          <label className="form-label" htmlFor="email">Email</label>
          <input
            className="form-input"
            autoComplete="off"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-wrapper">
          <label className="form-label" htmlFor="username">Username</label>
          <input
            className="form-input"
            autoComplete="off"
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
        <div className="form-button-container">
          <button 
            type="submit" 
            className={`form-button ${auth.registerStatus === PENDING_MESSAGE ? 'form-button-loading' : ''}`}
            disabled={auth.registerStatus === PENDING_MESSAGE}
          >
            {auth.registerStatus === PENDING_MESSAGE ? <div className="loading">Loading</div> : <div>Register</div>}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Register