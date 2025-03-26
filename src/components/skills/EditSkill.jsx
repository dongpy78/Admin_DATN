import React from "react";
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
import FormRowSelectV1 from "../layout-dashboard/FormRowSelect-V1";

// Loader để lấy dữ liệu kỹ năng cần chỉnh sửa và danh sách mã code JobType
export const loader = async ({ params }) => {
  try {
    const skillResponse = await axiosInstance.get(
      `/list-skills?limit=100&offset=0`
    );
    const jobTypeResponse = await axiosInstance.get(
      "/list-allcodes?type=JOBTYPE&limit=100&offset=0"
    );
    if (
      skillResponse.status === 200 &&
      skillResponse.data.data &&
      jobTypeResponse.status === 200 &&
      jobTypeResponse.data.data
    ) {
      const skill = skillResponse.data.data.rows.find(
        (s) => s.id === parseInt(params.id)
      );
      const jobTypeOptions = jobTypeResponse.data.data.rows.map((item) => ({
        value: item.code,
        label: item.code,
      }));
      if (!skill) throw new Error("Skill not found");
      return { skill, jobTypeOptions };
    }
    throw new Error("Failed to fetch data");
  } catch (error) {
    console.error("Error fetching skill or job type codes:", error);
    showErrorToast(error.response?.data?.message || "Failed to fetch data.");
    return { skill: null, jobTypeOptions: [] };
  }
};

// Action để xử lý gửi form chỉnh sửa
export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    const response = await axiosInstance.patch("/update-skill", {
      id: params.id,
      name: data.name,
      categoryJobCode: data.categoryJobCode,
    });
    console.log("Update skill response:", response.data);
    if (response.status === 200) {
      showSuccessToast("Skill updated successfully!");
      return { success: true };
    }
    throw new Error("Unexpected response status");
  } catch (error) {
    console.error("Error updating skill:", error.response?.data || error);
    const errorMessage =
      error.response?.data?.msg === "not found"
        ? "Kỹ năng không tồn tại"
        : error.response?.data?.message || "Không thể cập nhật kỹ năng";
    showErrorToast(errorMessage);
    return { error: errorMessage };
  }
};

const EditSkill = () => {
  const { skill, jobTypeOptions } = useLoaderData();
  const actionData = useActionData();
  const navigate = useNavigate();

  if (!skill) {
    return <DashboardFormPage>Skill not found</DashboardFormPage>;
  }

  if (actionData?.success) {
    setTimeout(() => navigate("/admin/skills"), 1000);
  }

  return (
    <DashboardFormPage>
      <Form method="put" className="form">
        <h4 className="form-title">Edit Skill</h4>
        <div className="form-center">
          <FormRow
            type="text"
            name="id"
            labelText="Skill ID"
            defaultValue={skill.id}
            disabled
          />
          <FormRow
            type="text"
            name="name"
            labelText="Skill Name"
            defaultValue={skill.name}
          />
          <FormRowSelectV1
            name="categoryJobCode"
            labelText="Category Job Code"
            list={jobTypeOptions}
            defaultValue={skill.categoryJobCode}
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

export default EditSkill;
