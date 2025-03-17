import React, { useState } from "react";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { Form, useActionData, useNavigate } from "react-router-dom";
import FormRowSelect from "../layout-dashboard/FormRowSelect";
import SubmitBtn from "../layout-dashboard/SubmitBtn";
import FormRow from "../layout-dashboard/FormRow";
import axiosInstance from "../../libs/axiosInterceptor";
import {
  showSuccessToast,
  showErrorToast,
} from "../../utils/toastNotifications";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log("Form data:", data);

  try {
    const response = await axiosInstance.post("/create-new-allcode", {
      code: data.code,
      type: "JOBTYPE", // Cố định cho Type Job
      value: data.value,
      image: data.image || "", // URL ảnh từ API upload
    });

    if (response.status === 200 || response.status === 201) {
      showSuccessToast("Type job created successfully!");
      return { success: true };
    } else {
      showErrorToast(`Unexpected status code: ${response.status}`);
      return { error: `Unexpected status code: ${response.status}` };
    }
  } catch (error) {
    console.error("Error creating type job:", error);
    const errorMessage =
      error.response?.data?.message || "Failed to create type job.";
    showErrorToast(errorMessage);
    return { error: errorMessage };
  }
};

const AddTypeJob = () => {
  const actionData = useActionData(); // Lấy dữ liệu trả về từ action
  const navigate = useNavigate();

  // State quản lý ảnh
  const [imagePreview, setImagePreview] = useState(""); // URL tạm thời để hiển thị preview
  const [imageUrl, setImageUrl] = useState(""); // URL ảnh thực tế từ server

  // Chuyển hướng sau khi tạo thành công
  if (actionData?.success) {
    setTimeout(() => navigate("/admin/type-job"), 1000); // Chuyển về danh sách sau 1 giây
  }

  // Hàm upload ảnh lên server
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

      console.log("upload", response);

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

  // Xử lý khi người dùng chọn ảnh
  const handleOnChangeImage = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Kiểm tra kích thước file (tối đa 0.5MB)
    const maxSize = 512 * 1024; // 0.5MB
    if (file.size > maxSize) {
      showErrorToast("Ảnh đại diện vượt quá kích thước 0.5MB!");
      return;
    }

    try {
      // Tạo URL tạm thời để hiển thị preview
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl); // Cập nhật URL tạm thời để hiển thị preview

      // Upload ảnh lên server và lấy URL thực tế
      const uploadedImageUrl = await uploadImage(file);
      setImageUrl(uploadedImageUrl); // Cập nhật URL ảnh thực tế từ server
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      showErrorToast("Không thể upload ảnh");
    }
  };

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">add Type Job</h4>
        <div className="form-center">
          <FormRow
            type="text"
            name="code"
            labelText="Code"
            defaultValue=""
            placeholder="e.g., DATA"
          />
          <FormRow
            type="text"
            name="type"
            labelText="Type"
            defaultValue="JOBTYPE"
            placeholder="e.g., DATA"
            disabled
          />
          <FormRow
            type="text"
            name="value"
            labelText="Type Job Name"
            defaultValue=""
            placeholder="e.g., Phân tích dữ liệu lớn"
          />

          {/* Hiển thị hình ảnh */}
        </div>

        <div className="form-center">
          <div className="form-row" style={{ marginTop: "16px" }}>
            <label className="form-label">Ảnh đại diện</label>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Ảnh đại diện"
                className="company-image"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                }}
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
            {/* Hidden input để gửi URL ảnh thực tế lên server */}
            <input type="hidden" name="image" value={imageUrl} />
          </div>
        </div>
        <div className="form-center">
          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  );
};

export default AddTypeJob;
