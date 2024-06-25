import { useState } from "react"

const Register = () => {
  const [email, setEmail] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  return (
    <div className="form-container">
      <h3 className="register-header">...Or join the conversation!</h3>
      <form className="form-body">
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
          <button className="form-button">Register</button>
        </div>
      </form>
    </div>
  )
}

export default Register