import { useEffect, useState } from "react";
import React, { useContext } from "react";
import { GlobalContext } from "../../contexts/GlobalProviders";
import Wrapper from "../../assets/wrappers/LogoutContainer";
import { FaUserCircle, FaCaretDown } from "react-icons/fa";
import { toast } from "react-toastify";
import axiosInstance from "../../libs/axiosInterceptor";
import {
  deleteFromLocalStorage,
  getFromLocalStorage,
} from "../../utils/localStorage";
import { keyLocalStorage } from "../../constants/keyConstant";
import { useNavigate } from "react-router-dom";
import {
  showSuccessToast,
  showErrorToast,
} from "../../utils/toastNotifications";

const LogoutContainer = () => {
  const { admin, setAdmin, logoutUser } = useContext(GlobalContext);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy thông tin từ localStorage khi component mount lần đầu
    const userStorage = getFromLocalStorage("user"); // Lấy từ "user" thay vì "company"
    if (userStorage && !admin) {
      setAdmin({
        ...userStorage,
        name: `${userStorage.firstName} ${userStorage.lastName}`.trim(),
        avatar: userStorage.image,
      });
    }
  }, [setAdmin, admin]);

  const handleLogout = async () => {
    try {
      const { status } = await axiosInstance.post("/auth/logout");
      if (status === 200 || status === 201) {
        deleteFromLocalStorage(keyLocalStorage.accessToken); // Xóa token
        logoutUser();
        showSuccessToast("Logout successful!");
        navigate("/"); // Chuyển về trang login
      } else {
        showErrorToast(`Unexpected status: ${status}`);
      }
    } catch (error) {
      console.log(error);
      const message =
        error.response?.data?.message || "Logout failed. Please try again.";
      showErrorToast(message);
      if (error.response?.status === 401) {
        // Token có thể đã hết hạn, vẫn xóa và chuyển hướng
        deleteFromLocalStorage(keyLocalStorage.accessToken);
        navigate("/auth/login");
      }
    } finally {
      setShowLogout(false); // Ẩn dropdown sau khi logout
    }
  };

  return (
    <Wrapper>
      <button
        type="button"
        className="btn logout-btn"
        onClick={() => setShowLogout(!showLogout)}
      >
        {admin?.avatar ? (
          <img
            src={admin.avatar}
            alt="Avatar"
            className="avatar"
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              marginRight: "8px",
            }}
          />
        ) : (
          <FaUserCircle />
        )}
        {admin?.name}
        <FaCaretDown />
      </button>
      <div className={showLogout ? "dropdown show-dropdown" : "dropdown"}>
        <button type="button" className="dropdown-btn" onClick={logoutUser}>
          logout
        </button>
      </div>
    </Wrapper>
  );
};

export default LogoutContainer;
