// src/context/SidebarContext.js
import { createContext, useContext, useState } from 'react';

const DialogContext = createContext();

export const DialogProvider = ({ children }) => {
    const [isShowDialog,setShowDialog] = useState(false)

  const toggleDialog = () => setShowDialog(prev => !prev);

  return (
    <DialogContext.Provider value={{ isShowDialog,toggleDialog,setShowDialog}}>
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = () => useContext(DialogContext);
