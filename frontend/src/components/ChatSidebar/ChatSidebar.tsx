import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

import { logout } from "../../redux/auth/authThunk"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { PENDING_MESSAGE, SUCCESS_MESSAGE } from "../../utils/constants"


import RoomIcon from "../Icons/Sidebar/Items/RoomIcon.svg?react"
import FriendIcon from "../Icons/Sidebar/Items/FriendIcon.svg?react"
import ProfileIcon from "../Icons/Sidebar/Items/ProfileIcon.svg?react"
import LogoutIcon from "../Icons/Sidebar/Utilities/LogoutIcon.svg?react"
import ChatHeader from "../ChatHeader/ChatHeader"

import "./ChatSidebar.css"

const ChatSidebar = ({ sidebarOpen }: { sidebarOpen: boolean }) => {
  const [showDelayedContent, setShowDelayedContent] = useState<boolean>(false)

  const user = useAppSelector(state => state.auth.user)
  const logoutStatus = useAppSelector(state => state.auth.logoutStatus)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (sidebarOpen) {
      timer = setTimeout(() => {
        setShowDelayedContent(true);
      }, 500);
    } else {
      setShowDelayedContent(false);
    }
    return () => clearTimeout(timer);
  }, [sidebarOpen]);

  const handleLogout = () => {
    dispatch(logout())
    if (logoutStatus === SUCCESS_MESSAGE) {
      navigate('/')
    }
  }

  return (
    <nav className={`sidebar${sidebarOpen ? '' : ' sidebar-close'}`}>
      <ChatHeader sidebarOpen={sidebarOpen} />
      <div className="sidebar-menu">
        <div className="menu">
          <ul className="sidebar-list">
            <li className="sidebar-list-item">
              <div className='icon-container'>
                <RoomIcon />
              </div>
              <span className={`sidebar-item-name${sidebarOpen ? ' text-show' : ' text-hidden'}`}>Rooms</span>
            </li>
            <li className="sidebar-list-item">
              <div className='icon-container'>
                <FriendIcon />
              </div>
              <span className={`sidebar-item-name${sidebarOpen ? ' text-show' : ' text-hidden'}`}>Friends</span>
            </li>
            <li className="sidebar-list-item">
              <div className='icon-container'>
                <ProfileIcon />
              </div>
              <span className={`sidebar-item-name${sidebarOpen ? ' text-show' : ' text-hidden'}`}>Profile</span>
            </li>
          </ul>
        </div>
      </div>
      <footer className="sidebar-footer">
        <p
          className={showDelayedContent ? ' footer-text-show' : ' footer-text-hidden'}
        >
          Logged in as {user?.username}
        </p>
        <div className="sidebar-button-container">
          <button
            className={showDelayedContent ? 'sidebar-button' : 'no-design-button'}
            onClick={handleLogout}
            disabled={logoutStatus === PENDING_MESSAGE ? true : false}
          >
            <div className="sidebar-inner-button">
              <div className={`${showDelayedContent ? '' : ' icon-container'}`}>
                <LogoutIcon />
              </div>
              <p className={showDelayedContent ? ' footer-text-show' : ' footer-text-hidden'}>
                Log out
              </p>
            </div>
          </button>
        </div>
      </footer>
    </nav>
  )
}

export default ChatSidebar