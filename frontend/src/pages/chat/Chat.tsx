import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { logout } from '../../redux/thunks/authThunk'
import './Chat.css'

const Chat = () => {
  const user = useAppSelector(state => state.auth.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }
  return (
    <div>
      <div>Welcome! Your username is {user?.username || 'nonexistent! This should not happen.'}</div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Chat
