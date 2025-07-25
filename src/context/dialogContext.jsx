// src/context/SidebarContext.js
import { createContext, useContext, useState } from 'react';

const DialogContext = createContext();

export const DialogProvider = ({ children }) => {
  const [isShowDialog,setShowDialog] = useState(false)
  const [dialog, setDialog] = useState(null); // null hoặc { title, content, onConfirm, onCancel, confirmText, cancelText }

  const showDialog = (config) => setDialog(config);
  const hideDialog = () => setDialog(null);

  const toggleDialog = () => setShowDialog(prev => !prev);


  return (
    <DialogContext.Provider value={{ isShowDialog,toggleDialog,setShowDialog,dialog,setDialog,showDialog,hideDialog}}>
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = () => useContext(DialogContext);
