import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'

import { store } from './redux/store.ts'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <>
        <ToastContainer />
        <App />
      </>
    </Provider>
  </React.StrictMode>,
)
