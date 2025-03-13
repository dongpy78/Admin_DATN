import React, { useState } from "react";
import RejectReasonModal from "../components/layout-dashboard/RejectReasonModal"; // Import modal

export const GlobalContext = React.createContext();

const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Khôi phục user từ localStorage nếu có
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : { name: "" };
  });
  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false); // Trạng thái modal
  const [rejectCallback, setRejectCallback] = useState(null); // Callback để xử lý lý do từ chối

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

  // Hàm mở modal từ chối
  const openRejectModal = (callback) => {
    setIsRejectModalOpen(true);
    setRejectCallback(() => callback); // Lưu callback để xử lý lý do từ chối
  };

  // Hàm đóng modal từ chối
  const closeRejectModal = () => {
    setIsRejectModalOpen(false);
    setRejectCallback(null);
  };

  // Hàm xử lý khi người dùng nhập lý do từ chối
  const handleRejectReasonSubmit = (reason) => {
    if (rejectCallback) {
      rejectCallback(reason); // Gọi callback với lý do từ chối
    }
    closeRejectModal();
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
    openRejectModal,
  };

  return (
    <GlobalContext.Provider value={data}>
      {children}

      {/* Hiển thị modal từ chối */}
      <RejectReasonModal
        isOpen={isRejectModalOpen}
        onClose={closeRejectModal}
        onSubmit={handleRejectReasonSubmit}
      />
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
