import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Wrapper from "../../../assets/wrappers/RegisterAndLoginPage";
import FormRow from "../../../components/layout-dashboard/FormRow";
import SubmitBtn from "../../../components/layout-dashboard/SubmitBtn";
import Logo from "../../../components/layout-dashboard/Logo";
import { toast } from "react-toastify";
import axiosInstance from "../../../libs/axiosInterceptor";
import { saveToLocalStorage } from "../../../utils/localStorage";
import { keyLocalStorage } from "../../../constants/keyConstant";
import { validateLoginForm } from "../../../utils/loginValidation";
import { GlobalContext } from "../../../contexts/GlobalProviders";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../utils/toastNotifications";
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Tạo dấu hiệu (ref) cho ô email
  const focusRef = useRef(null);
  const { setUser } = useContext(GlobalContext);

  // Tự động focus khi trang tải
  useEffect(() => {
    focusRef.current.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateLoginForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      console.log("Response data:", response.data);

      if (response.status === 200 || response.status === 201) {
        //! Cập nhật tên Admin
        const userData = {
          ...response.data.user, // Sửa từ data.user thành response.data.user
          name: `${response.data.user.firstName} ${response.data.user.lastName}`, // Gộp tên
        };
        console.log("User Data: ", userData);
        setUser(userData);

        saveToLocalStorage(
          keyLocalStorage.accessToken,
          response.data.accessToken
        );
        showSuccessToast("Đăng nhập thành công");
        navigate("/admin");
      } else {
        showErrorToast(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      // console.log("Error response:", error.response);
      console.log(error);
      const apiErrors = {};
      if (error.response?.data?.message) {
        const errorMessage = error.response.data.message;
        if (errorMessage.includes("email")) {
          apiErrors.email = errorMessage;
        } else if (errorMessage.includes("password")) {
          apiErrors.password = errorMessage;
        } else {
          showErrorToast(errorMessage);
        }
      } else {
        showErrorToast(
          "Login failed. Please check your network or server status."
        );
      }
      if (Object.keys(apiErrors).length > 0) {
        setErrors(apiErrors);
      }
    }
  };

  return (
    <Wrapper>
      <form onSubmit={handleSubmit} className="form">
        <Logo />
        <h4>Login</h4>
        <div className="form-row-container">
          <FormRow
            type="email"
            name="email"
            labelText="Email"
            defaultValue={formData.email}
            onChange={handleChange}
            ref={focusRef}
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>
        <div className="form-row-container">
          <FormRow
            type="password"
            name="password"
            labelText="Password"
            defaultValue={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <span className="form-error">{errors.password}</span>
          )}
        </div>

        <SubmitBtn formBtn />
      </form>
    </Wrapper>
  );
};

export default Login;
