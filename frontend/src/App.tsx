import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Home from "./pages/home/Home"
import Protected from "./components/Protected"
import Chat from "./pages/chat/Chat"

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />
    },
    {
      element: <Protected />,
      children: [
        {
          path: '/chat',
          element: <Chat />
        }
      ]
    }
  ])
  return (
    <RouterProvider router={router} />
  )
}

export default App
