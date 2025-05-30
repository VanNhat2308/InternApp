// src/context/SidebarContext.js
import { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const[isMiniBar,setMiniBar] = useState(false)

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const toggleMiniBar = () => setMiniBar(prev => !prev);

  return (
    <SidebarContext.Provider value={{ setMiniBar,isSidebarOpen, toggleSidebar,setSidebarOpen,isMiniBar,toggleMiniBar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
