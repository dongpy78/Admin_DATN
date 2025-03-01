import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { Form, useActionData, useNavigate } from "react-router-dom";
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
      type: "SALARYTYPE", // Cố định cho Type Job
      value: data.value,
      image: data.image || "", // Để trống nếu không có
    });

    if (response.status === 200 || response.status === 201) {
      showSuccessToast("Type salary created successfully!");
      return { success: true };
    } else {
      showErrorToast(`Unexpected status code: ${response.status}`);
      return { error: `Unexpected status code: ${response.status}` };
    }
  } catch (error) {
    console.error("Error creating type job:", error);

    return { error: errorMessage };
  }
};

const AddSlary = () => {
  const actionData = useActionData(); // Lấy dữ liệu trả về từ action
  const navigate = useNavigate();

  // Chuyển hướng sau khi tạo thành công
  if (actionData?.success) {
    setTimeout(() => navigate("/admin/work-salary"), 1000); // Chuyển về danh sách sau 1 giây
  }
  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">thêm mới khoảng lương</h4>
        <div className="form-center">
          <FormRow
            type="text"
            name="code"
            labelText="Code"
            defaultValue=""
            placeholder="e.g., giam-doc..."
          />
          <FormRow
            type="text"
            name="type"
            labelText="Type"
            defaultValue="SALARYTYPE"
            placeholder="e.g., DATA"
            disabled
          />
          <FormRow
            type="text"
            name="value"
            labelText="Type Job Name"
            defaultValue=""
            placeholder="e.g., giám đốc"
          />

          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  );
};

export default AddSlary;
