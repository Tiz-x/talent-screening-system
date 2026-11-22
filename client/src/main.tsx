import React from 'react'
import ReactDOM from 'react-dom/client'
import { ToastProvider } from './components/Toast';
import App from './App.tsx'
import './styles/global.css'
import './styles/ui.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
  <ToastProvider>
    <App />
  </ToastProvider>
</React.StrictMode>,
)