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

  if (actionData?.success) {
    setTimeout(() => navigate("/admin/skills"), 1000);
  }

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
            list={jobTypeCodes}
            defaultValue={jobTypeCodes[0] || "DEV"} // Giá trị mặc định là mã đầu tiên
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
