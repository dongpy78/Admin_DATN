import { useState, useRef, useEffect } from "react";
import { Form, redirect, useNavigate, useNavigation } from "react-router-dom";
import Wrapper from "../../../assets/wrappers/RegisterAndLoginPage";
import FormRow from "../../../components/layout-dashboard/FormRow";
import SubmitBtn from "../../../components/layout-dashboard/SubmitBtn";
import Logo from "../../../components/layout-dashboard/Logo";
import { toast } from "react-toastify";
import axiosInstance from "../../../libs/axiosInterceptor";
import { saveToLocalStorage } from "../../../utils/localStorage"; // Thêm import
import { keyLocalStorage } from "../../../constants/keyConstant"; // Đảm bảo import
import { validateLoginForm } from "../../../utils/loginValidation";
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Tạo dấu hiệu (ref) cho ô email
  const focusRef = useRef(null);

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

      // console.log("Response data:", response.data);

      if (response.status === 200 || response.status === 201) {
        saveToLocalStorage(
          keyLocalStorage.accessToken,
          response.data.accessToken
        );
        toast.success("Login successful!");
        navigate("/admin");
      } else {
        toast.error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      // console.log("Error response:", error.response);
      const apiErrors = {};
      if (error.response?.data?.message) {
        const errorMessage = error.response.data.message;
        if (errorMessage.includes("email")) {
          apiErrors.email = errorMessage;
        } else if (errorMessage.includes("password")) {
          apiErrors.password = errorMessage;
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error(
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
