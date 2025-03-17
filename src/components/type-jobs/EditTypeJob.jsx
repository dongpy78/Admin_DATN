import React, { useState } from "react";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import SubmitBtn from "../layout-dashboard/SubmitBtn";
import FormRow from "../layout-dashboard/FormRow";
import axiosInstance from "../../libs/axiosInterceptor";
import {
  showSuccessToast,
  showErrorToast,
} from "../../utils/toastNotifications";
import { redirect } from "react-router-dom";

// Loader để lấy dữ liệu Type Job hiện tại
export const loader = async ({ params }) => {
  try {
    const response = await axiosInstance.get(
      `/list-allcodes?type=JOBTYPE&limit=10&offset=0`
    );
    const typeJob = response.data.data.rows.find(
      (tj) => tj.code === params.code
    );
    if (!typeJob) {
      showErrorToast("Type Job not found.");
      return redirect("/admin/type-job");
    }
    return typeJob;
  } catch (error) {
    showErrorToast(
      error?.response?.data?.message || "Failed to fetch type job."
    );
    return redirect("/admin/type-job");
  }
};

// Action để xử lý submit form
export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const data = {
    code: params.code,
    type: "JOBTYPE",
    value: formData.get("value"),
    image: formData.get("image") || "", // URL ảnh từ input ẩn
  };

  try {
    console.log("Sending data to update-allcode:", data);
    const response = await axiosInstance.patch("/update-allcode", data);
    console.log("API response:", response.data);
    showSuccessToast("Type job updated successfully!");
    return redirect("/admin/type-job");
  } catch (error) {
    console.error("Error updating type job:", error.response?.data || error);
    const errorMessage =
      error?.response?.data?.message || "Failed to update type job.";
    showErrorToast(errorMessage);
    return { errors: { general: errorMessage } };
  }
};

const EditTypeJob = () => {
  const typeJob = useLoaderData();
  const actionData = useActionData();
  const navigate = useNavigate();

  // State quản lý ảnh
  const [imagePreview, setImagePreview] = useState(typeJob.image || "");
  const [imageUrl, setImageUrl] = useState(typeJob.image || "");

  // Hàm upload ảnh lên server
  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post(
        "/media/upload/single",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload response:", response.data);

      if (response.data && response.data.url) {
        return response.data.url;
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

    const maxSize = 512 * 1024; // 0.5MB
    if (file.size > maxSize) {
      showErrorToast("Ảnh đại diện vượt quá kích thước 0.5MB!");
      return;
    }

    try {
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);

      const uploadedImageUrl = await uploadImage(file);
      setImageUrl(uploadedImageUrl);
      showSuccessToast("Ảnh đã được upload thành công!");
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      showErrorToast("Không thể upload ảnh");
    }
  };

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">Edit Type Job</h4>
        <div className="form-center">
          <FormRow
            type="text"
            name="code"
            labelText="Code"
            defaultValue={typeJob.code}
            disabled
          />
          <FormRow
            type="text"
            name="type"
            labelText="JOBTYPE"
            defaultValue={typeJob.type}
            disabled
          />
          <FormRow
            type="text"
            name="value"
            labelText="Value"
            defaultValue={typeJob.value}
            placeholder="e.g., Phân tích dữ liệu lớn"
          />
          {actionData?.errors?.value && (
            <span className="form-error">{actionData.errors.value}</span>
          )}

          {/* Hiển thị hình ảnh và đường dẫn */}
          <div className="form-row">
            <label htmlFor="file" className="form-label">
              Ảnh đại diện
            </label>
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
              id="file"
              name="file" // Đổi name để tránh xung đột với input ẩn
              className="form-input"
              onChange={handleOnChangeImage}
              accept="image/*"
            />
            {/* Hiển thị đường dẫn URL của ảnh */}
            {imageUrl && (
              <div style={{ marginTop: "10px" }}>
                <label className="form-label">Đường dẫn ảnh:</label>
                <input
                  type="text"
                  value={imageUrl}
                  readOnly
                  className="form-input"
                  style={{ backgroundColor: "#f0f0f0" }}
                />
              </div>
            )}
            {/* Hidden input để gửi URL ảnh thực tế lên server */}
            <input type="hidden" name="image" value={imageUrl} />
          </div>

          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  );
};

export default EditTypeJob;
