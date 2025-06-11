// src/context/SidebarContext.js
import { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [isToast,setToast] = useState(false)
    const [isToastV2,setToastV2] = useState(false)

  const toggleToast = () => setToast(prev => !prev);

  return (
    <ToastContext.Provider value={{ isToast,toggleToast,setToast,isToastV2,setToastV2}}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
