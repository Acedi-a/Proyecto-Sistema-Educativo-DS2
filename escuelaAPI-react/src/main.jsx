import React,{StrictMode  } from 'react'

import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MisRoutes from './Routes.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MisRoutes></MisRoutes>
  </React.StrictMode>,
)
