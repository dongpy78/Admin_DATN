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

  try {
    const response = await axiosInstance.post("/create-new-allcode", {
      code: data.code,
      type: "JOBTYPE", // Cố định cho Type Job
      value: data.value,
      image: data.image || "", // Để trống nếu không có
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

  // Chuyển hướng sau khi tạo thành công
  if (actionData?.success) {
    setTimeout(() => navigate("/admin/type-job"), 1000); // Chuyển về danh sách sau 1 giây
  }
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

          <div className="form-row">
            <label htmlFor="image" className="form-label">
              Select an image file (max 0.5 MB):
            </label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              className="form-input"
              accept="image/*"
            />
          </div>
          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  );
};

export default AddTypeJob;
