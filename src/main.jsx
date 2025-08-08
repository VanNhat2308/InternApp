import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SidebarProvider } from './context/sidebarContext.jsx'
import { DialogProvider } from './context/dialogContext.jsx'
import { ToastProvider } from './context/toastContext.jsx'
import { FilterProvider } from './context/filteContext.jsx'
import { UserProvider } from './context/userContext.jsx'
import CustomDialog from './components/customDialog.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NotificationProvider from './context/NotificationProvider.jsx'
const queryClient = new QueryClient();
createRoot(document.getElementById('root')).render(
  <StrictMode>
   <QueryClientProvider client={queryClient}>
     <SidebarProvider>
       <DialogProvider>
      <ToastProvider>
        <FilterProvider>
          <CustomDialog/>
          <UserProvider>
            {/* <NotificationProvider> */}
              <App />
            {/* </NotificationProvider> */}
          </UserProvider>
        </FilterProvider>
      </ToastProvider>
       </DialogProvider>
     </SidebarProvider>
   </QueryClientProvider>
</StrictMode>
)
