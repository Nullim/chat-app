import Login from "../../components/Form/Login/Login"
import Register from "../../components/Form/Register/Register"
import ResetPass from "../../components/Form/ResetPassword/ResetPass"
import { useState } from "react"

import "./Home.css"
import "../../components/Form/Form.css"


export type ResetPassProps = {
  setReset: React.Dispatch<React.SetStateAction<boolean>>
}

const Home = () => {
  const [reset, setReset] = useState<boolean>(false)
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