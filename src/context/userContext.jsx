// src/context/SidebarContext.js
import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [User, setUser] = useState(null); // null hoặc { title, content, onConfirm, onCancel, confirmText, cancelText }
      // Tải user từ localStorage nếu có
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    console.log(savedUser);
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);
  


  return (
    <UserContext.Provider value={{User,setUser}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
