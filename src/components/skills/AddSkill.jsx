import React, { useState, useEffect } from "react";
import {
  Form,
  useNavigate,
  useLoaderData,
  useActionData,
} from "react-router-dom";
import FormRow from "../layout-dashboard/FormRow";
import FormRowSelect from "../layout-dashboard/FormRowSelect";
import SubmitBtn from "../layout-dashboard/SubmitBtn";
import DashboardFormPage from "../../assets/wrappers/DashboardFormPage";
import axiosInstance from "../../libs/axiosInterceptor";
import {
  showSuccessToast,
  showErrorToast,
} from "../../utils/toastNotifications";

// Loader để lấy danh sách mã code JobType
export const loader = async () => {
  try {
    const response = await axiosInstance.get(
      "/list-allcodes?type=JOBTYPE&limit=100&offset=0"
    );
    if (response.status === 200 && response.data.data) {
      const jobTypeCodes = response.data.data.rows.map((item) => item.code);
      return { jobTypeCodes };
    }
    throw new Error("Failed to fetch job type codes.");
  } catch (error) {
    console.error("Error fetching job type codes:", error);
    showErrorToast(
      error.response?.data?.message || "Failed to fetch job type codes."
    );
    return { jobTypeCodes: [] };
  }
};

// Action để xử lý thêm kỹ năng mới
export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    const response = await axiosInstance.post("/create-new-skill", {
      name: data.name,
      categoryJobCode: data.categoryJobCode,
    });
    if (response.status === 200 || response.status === 201) {
      showSuccessToast("Skill added successfully!");
      return { success: true };
    }
    throw new Error("Failed to add skill");
  } catch (error) {
    console.error("Error adding skill:", error);
    showErrorToast(error.response?.data?.message || "Failed to add skill.");
    return { error: error.response?.data?.message || "Failed to add skill" };
  }
};

const AddSkill = () => {
  const { jobTypeCodes } = useLoaderData();
  const actionData = useActionData();
  const navigate = useNavigate();

  // Chuyển đổi jobTypeCodes thành định dạng phù hợp với FormRowSelect
  const jobTypeOptions = jobTypeCodes.map((code) => ({
    value: code,
    label: code, // Nếu không có label cụ thể, dùng code làm label
  }));

  // State để quản lý giá trị của select
  const [selectedCategory, setSelectedCategory] = useState(
    jobTypeOptions[0]?.value || "DEV" // Giá trị mặc định
  );

  // Điều hướng sau khi thêm thành công
  if (actionData?.success) {
    setTimeout(() => navigate("/admin/work-skill"), 1000);
  }

  // Hàm xử lý khi thay đổi giá trị select
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <DashboardFormPage>
      <Form method="post" className="form">
        <h4 className="form-title">Add Skill</h4>
        <div className="form-center">
          <FormRow
            type="text"
            name="name"
            labelText="Skill Name"
            placeholder="e.g., DOCKER"
          />
          <FormRowSelect
            name="categoryJobCode"
            labelText="Category Job Code"
            list={jobTypeOptions} // Truyền danh sách đã chuyển đổi
            value={selectedCategory} // Giá trị được kiểm soát bởi state
            onChange={handleCategoryChange} // Xử lý thay đổi
          />
          <SubmitBtn formBtn />
          {actionData?.error && (
            <p className="form-error">{actionData.error}</p>
          )}
        </div>
      </Form>
    </DashboardFormPage>
  );
};

export default AddSkill;
