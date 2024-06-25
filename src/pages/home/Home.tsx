import Login from "../../components/Form/Login/Login"
import Register from "../../components/Form/Register/Register"
import "./Home.css"
import "../../components/Form/Form.css"

const Home = () => {
  return (
    <div className="home-container">
      <div>
        <h1>Welcome to Skyline!</h1>
        <h2>We connect you with others all under the sky.</h2>
      </div>
      <div className="home-form">
        <Login />
        <Register />
      </div>
      <div className="links">
        <a href="https://www.vecteezy.com/free-photos/background">Background Stock photos by Vecteezy</a>
      </div>
    </div>
  )
}

export default Home