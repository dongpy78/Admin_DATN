import React from "react";
import { useState } from "react";

export const GlobalContext = React.createContext();

const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState({ name: "john" });
  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleDarkTheme = () => {
    const newDarkTheme = !isDarkTheme;
    setIsDarkTheme(newDarkTheme);
    document.body.classList.toggle("dark-theme", newDarkTheme);
    localStorage.setItem("darkTheme", newDarkTheme);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const logoutUser = () => {
    console.log("logoutUser");
    setUser(null); // Hoặc thay đổi logic đăng xuất nếu cần
  };

  const data = {
    user,
    setUser,
    showSidebar,
    setShowSidebar,
    isDarkTheme,
    setIsDarkTheme,
    toggleDarkTheme,
    toggleSidebar,
    logoutUser,
  };

  return (
    <GlobalContext.Provider value={data}>{children}</GlobalContext.Provider>
  );
};

export default GlobalProvider;
