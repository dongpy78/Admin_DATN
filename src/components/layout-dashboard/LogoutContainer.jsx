import { useState } from "react";
import React, { useContext } from "react";
import { GlobalContext } from "../../contexts/GlobalProviders";
import Wrapper from "../../assets/wrappers/LogoutContainer";
import { FaUserCircle, FaCaretDown } from "react-icons/fa";
import { toast } from "react-toastify";
import axiosInstance from "../../libs/axiosInterceptor";
import { deleteFromLocalStorage } from "../../utils/localStorage";
import { keyLocalStorage } from "../../constants/keyConstant";
import { useNavigate } from "react-router-dom";

const LogoutContainer = () => {
  const { user, logoutUser } = useContext(GlobalContext);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { status } = await axiosInstance.post("/auth/logout");
      if (status === 200 || status === 201) {
        deleteFromLocalStorage(keyLocalStorage.accessToken); // Xóa token
        logoutUser();
        toast.success("Logout successful!");
        navigate("/"); // Chuyển về trang login
      } else {
        toast.error(`Unexpected status: ${status}`);
      }
    } catch (error) {
      console.log(error);
      const message =
        error.response?.data?.message || "Logout failed. Please try again.";
      toast.error(message);
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
        <FaUserCircle />
        {user?.name}
        <FaCaretDown />
      </button>
      <div className={showLogout ? "dropdown show-dropdown" : "dropdown"}>
        <button type="button" className="dropdown-btn" onClick={handleLogout}>
          logout
        </button>
      </div>
    </Wrapper>
  );
};

export default LogoutContainer;
