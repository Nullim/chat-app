import { useState } from "react"

const Login = () => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  return (
    <div className="form-container">
      <h3>Log back in</h3>
      <form className="form-body">
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
        <div className="form-button-container">
          <button className="form-button">Sign in</button>
        </div>
      </form>
    </div>
  )
}

export default Login