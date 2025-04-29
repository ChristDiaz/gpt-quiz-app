// /home/christian/gpt-quiz-app/client/src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'; // 1. Import AuthProvider
// Removed index.css import if you are not using it globally anymore
// import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* Router should be outside or inside AuthProvider, usually outside */}
      <AuthProvider> {/* 2. Wrap App with AuthProvider */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
