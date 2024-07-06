import "./ChatHeader.css"

const ChatHeader = ({ sidebarOpen }: { sidebarOpen: boolean }) => {
  return (
    <header className="header-title">
      <div className={`header-brand${sidebarOpen ? ' header-text-show' : ' header-text-hidden'}`}>
        <div className="header-inner">
          <p>Skyline</p>
        </div>
      </div>
    </header>
  )
}

export default ChatHeader