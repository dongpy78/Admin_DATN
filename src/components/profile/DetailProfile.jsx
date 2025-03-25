import React, { useContext } from "react";
import { getFromLocalStorage } from "../../utils/localStorage";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { Form, Link } from "react-router-dom";
import FormRow from "../layout-dashboard/FormRow";
import axiosInstance from "../../libs/axiosInterceptor";
import {
  showErrorToast,
  showSuccessToast,
} from "../../utils/toastNotifications";
import { useState, useEffect } from "react";
import JobTableWrapper from "../../assets/wrappers/JobTableWrapper";
import FormRowSelectProfile from "../layout-dashboard/FormRowSelectProfile";
import { GlobalContext } from "../../contexts/GlobalProviders";

const DetailProfile = () => {
  const userStorage = getFromLocalStorage("user");
  const [setUser] = useState(null); // Đặt giá trị ban đầu là null để kiểm tra dễ hơn
  const [loading, setLoading] = useState(true);
  const [genderOptions, setGenderOptions] = useState([]); // State để lưu danh sách giới tính
  const { admin, setAdmin } = useContext(GlobalContext);
  const [user, setLocalUser] = useState(null);

  // Lấy danh sách giới tính từ API
  useEffect(() => {
    const fetchGenderOptions = async () => {
      try {
        const response = await axiosInstance.get(
          "/list-allcodes?type=GENDER&limit=10&offset=0"
        );
        if (response.status === 200) {
          console.log("GenderCode: ", response);
          setGenderOptions(response.data.data.rows); // Lưu danh sách giới tính vào state
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách giới tính:", error);
        showErrorToast("Không thể tải danh sách giới tính.");
      }
    };

    fetchGenderOptions();
  }, []);

  // Lấy thông tin người dùng
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = userStorage.id; // Thay bằng ID người dùng thực tế (lấy từ token hoặc state)
        const response = await axiosInstance.get(
          `/auth/detail-user?userId=${userId}`
        );

        console.log(response);
        if (response.status === 200) {
          const userData = response.data.data;

          // Lấy URL ảnh từ localStorage nếu có
          const savedImageUrl = localStorage.getItem("userImage");
          if (savedImageUrl) {
            userData.image = savedImageUrl;
            userData.imageReview = savedImageUrl;
          }

          setLocalUser(userData);

          console.log("UserData", userData);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        showErrorToast("Không thể tải thông tin người dùng.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Xử lý thay đổi thông tin
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (["firstName", "lastName", "address", "phonenumber"].includes(name)) {
      setLocalUser((prevUser) => ({
        ...prevUser,
        userAccountData: {
          ...prevUser.userAccountData,
          [name]: value,
        },
      }));
    } else {
      setLocalUser((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
    }
  };

  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file); // Key phải là "file" như API yêu cầu

      const response = await axiosInstance.post(
        "/media/upload/single",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Đảm bảo header đúng
          },
        }
      );

      if (response.data && response.data.url) {
        return response.data.url; // Trả về URL của ảnh
      } else {
        throw new Error("Không thể upload ảnh");
      }
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      throw error;
    }
  };

  const handleOnChangeImage = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const maxSize = 512 * 1024;
    if (file.size > maxSize) {
      showErrorToast("Ảnh đại diện vượt quá kích thước 0.5MB!");
      return;
    }

    try {
      const objectUrl = URL.createObjectURL(file);
      setLocalUser((prevUser) => ({
        ...prevUser,
        imageReview: objectUrl,
      }));

      const imageUrl = await uploadImage(file);
      setLocalUser((prevUser) => ({
        ...prevUser,
        image: imageUrl,
        imageReview: imageUrl,
      }));

      // Kiểm tra tồn tại của user và userAccountData trước khi sử dụng
      if (user && user.userAccountData) {
        setAdmin((prevAdmin) => ({
          ...prevAdmin,
          avatar: imageUrl,
          name: `${user.userAccountData.firstName} ${user.userAccountData.lastName}`.trim(),
        }));
      }

      localStorage.setItem("userImage", imageUrl);
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      showErrorToast("Không thể upload ảnh");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        id: userStorage.id,
        firstName: user.userAccountData.firstName || "",
        lastName: user.userAccountData.lastName || "",
        address: user.userAccountData.address || "",
        phonenumber: user.userAccountData.phonenumber || "",
        email: user.email || "",
        genderCode: user.genderCode || "",
        dob: user.dob || "",
        image: user.image || "",
      };

      const response = await axiosInstance.patch(
        "/auth/update-user",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Cập nhật admin trong GlobalContext
      setAdmin({
        name: `${userData.firstName} ${userData.lastName}`.trim(),
        avatar: userData.image,
      });

      // Cập nhật user trong localStorage
      const updatedUserStorage = {
        ...userStorage,
        ...userData,
      };
      localStorage.setItem("user", JSON.stringify(updatedUserStorage));

      showSuccessToast(
        response.data.message || "Cập nhật thông tin thành công"
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      showErrorToast(
        "Cập nhật thất bại: " + (error.message || "Lỗi không xác định")
      );
    }
  };

  if (loading) {
    return <JobTableWrapper>Đang tải...</JobTableWrapper>;
  }

  if (!user) {
    return (
      <JobTableWrapper>Không tìm thấy thông tin người dùng.</JobTableWrapper>
    );
  }

  return (
    <Wrapper>
      <Form method="post" className="form" onSubmit={handleSubmit}>
        <h5 className="form-title">Thông tin cá nhân</h5>
        <div className="form-center">
          {/* Các trường text */}
          <FormRow
            type="text"
            name="firstName"
            labelText="Họ"
            defaultValue={user.userAccountData.lastName}
            onChange={handleInputChange}
          />
          <FormRow
            type="text"
            name="lastName"
            labelText="Tên"
            defaultValue={user.userAccountData.firstName}
            onChange={handleInputChange}
          />
          <FormRow
            type="email"
            name="email"
            labelText="Email"
            defaultValue={user.email}
            onChange={handleInputChange}
          />
          <FormRow
            type="text"
            name="address"
            labelText="Địa chỉ"
            defaultValue={user.userAccountData.address}
            onChange={handleInputChange}
          />
          <FormRow
            type="text"
            name="phonenumber"
            labelText="Số điện thoại"
            defaultValue={user.userAccountData.phonenumber}
            onChange={handleInputChange}
          />
          <FormRowSelectProfile
            name="genderCode"
            labelText="Giới tính"
            list={genderOptions} // Danh sách giới tính từ API
            // Giá trị được chọn (ví dụ: "M" hoặc "FE")
            onChange={handleInputChange}
          />
          <FormRow
            type="date"
            name="dob"
            labelText="Ngày sinh"
            defaultValue={user.userAccountData.dob}
            onChange={handleInputChange}
          />
        </div>

        {/* Hiển thị hình ảnh */}
        <div className="form-center">
          <div className="form-row" style={{ marginTop: "16px" }}>
            <label className="form-label">Ảnh đại diện</label>
            {user.image ? (
              <img
                src={user.image}
                alt="Ảnh đại diện"
                className="company-image"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            ) : (
              <p>Không có ảnh đại diện</p>
            )}
            <input
              type="file"
              name="image"
              className="form-input"
              onChange={handleOnChangeImage}
              style={{ marginTop: "1rem" }}
            />
          </div>
        </div>

        <div className="form-center">
          <button type="submit" className="btn form-btn">
            Lưu thay đổi
          </button>
        </div>
      </Form>
    </Wrapper>
  );
};

export default DetailProfile;
