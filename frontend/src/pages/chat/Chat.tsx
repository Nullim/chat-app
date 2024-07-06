import { useState } from 'react'
import ChatSidebar from '../../components/ChatSidebar/ChatSidebar'
import MenuIcon from "../../components/Icons/Sidebar/Utilities/MenuIcon.svg?react"

import './Chat.css'

const Chat = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  return (
    <div className='chat-container'>
      <div className='chat-wrapper'>
        <i className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}><MenuIcon /></i>
        <ChatSidebar sidebarOpen={sidebarOpen} />
        <div className='chat-main-container'>
          <main className='chat-body'></main>
        </div>
      </div>
      <div className="links">
        <a href="https://www.vecteezy.com/free-photos/background">Background Stock photos by Vecteezy</a>
      </div>
    </div>
  )
}

export default Chat
