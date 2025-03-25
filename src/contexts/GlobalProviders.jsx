import React, { useEffect, useState } from "react";
import RejectReasonModal from "../components/layout-dashboard/RejectReasonModal"; // Import modal
import {
  deleteFromLocalStorage,
  getFromLocalStorage,
} from "../utils/localStorage";
import { keyLocalStorage } from "../constants/keyConstant";
import { showErrorToast, showSuccessToast } from "../utils/toastNotifications";

export const GlobalContext = React.createContext();

const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Khôi phục user từ localStorage nếu có
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : { name: "" };
  });

  const [admin, setAdmin] = useState(null); // Thông tin ứng viên

  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false); // Trạng thái modal
  const [rejectCallback, setRejectCallback] = useState(null); // Callback để xử lý lý do từ chối

  useEffect(() => {
    const token = getFromLocalStorage(keyLocalStorage.accessToken);
    const storedUser = getFromLocalStorage("user");

    if (token && storedUser) {
      if (storedUser.roleCode === "Admin") {
        setAdmin({
          name: `${storedUser.firstName} ${storedUser.lastName}`.trim(),
          avatar: storedUser.image || null,
        });
      }
      // Cập nhật user nếu cần
      setUser(storedUser);
    }
  }, []);

  const toggleDarkTheme = () => {
    const newDarkTheme = !isDarkTheme;
    setIsDarkTheme(newDarkTheme);
    document.body.classList.toggle("dark-theme", newDarkTheme);
    localStorage.setItem("darkTheme", newDarkTheme);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const logoutUser = async () => {
    try {
      // Thêm kiểm tra token trước khi gọi API
      const token = getFromLocalStorage(keyLocalStorage.accessToken);
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Thêm headers Authorization nếu cần
      await axiosInstance.post("/auth/logout");

      // Xóa dữ liệu local storage
      deleteFromLocalStorage(keyLocalStorage.accessToken);
      deleteFromLocalStorage("user");
      localStorage.removeItem("userImage"); // Thêm dòng này nếu có lưu ảnh

      // Reset state
      setAdmin(null);
      setUser(null);

      // Hiển thị thông báo và chuyển hướng
      showSuccessToast("Logout success!");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);

      // Dù lỗi vẫn xóa token và chuyển hướng
      deleteFromLocalStorage(keyLocalStorage.accessToken);
      window.location.href = "/";
    }
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
    admin,
    setAdmin,
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
