import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SidebarProvider } from './context/sidebarContext.jsx'
import { DialogProvider } from './context/dialogContext.jsx'
import { ToastProvider } from './context/toastContext.jsx'
import { FilterProvider } from './context/filteContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <SidebarProvider>
  <DialogProvider>
    <ToastProvider>
      <FilterProvider>
        <App />
      </FilterProvider>
    </ToastProvider>
  </DialogProvider>
</SidebarProvider>
</StrictMode>
)
