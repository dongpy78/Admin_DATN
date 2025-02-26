import React from "react";
import { useState } from "react";

export const GlobalContext = React.createContext();

const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Khôi phục user từ localStorage nếu có
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : { name: "" };
  });
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
    setUser({ name: "" }); // Reset user về giá trị mặc định
    localStorage.removeItem("user"); // Xóa user khỏi localStorage
  };

  const data = {
    user,
    setUser: (newUser) => {
      setUser(newUser);
      if (newUser) {
        localStorage.setItem("user", JSON.stringify(newUser)); // Lưu user vào localStorage
      } else {
        localStorage.removeItem("user");
      }
    },
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
