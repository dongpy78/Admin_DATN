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
      `/list-allcodes?type=WORKTYPE&limit=10&offset=0`
    );
    const typeJob = response.data.data.rows.find(
      (tj) => tj.code === params.code
    );
    if (!typeJob) {
      showErrorToast("Type Job not found.");
      return redirect("/admin/work-level");
    }
    return typeJob;
  } catch (error) {
    showErrorToast(
      error?.response?.data?.message || "Failed to fetch type job."
    );
    return redirect("/admin/work-level");
  }
};

// Action để xử lý submit form
export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const data = {
    code: params.code, // Lấy code từ params vì trường bị disable
    type: "WORKTYPE", // Cố định theo dữ liệu test
    value: formData.get("value"),
    imgage: formData.get("image") || "", // Dùng "imgage" theo dữ liệu test
  };

  try {
    console.log("Sending data to update-allcode:", data);

    const response = await axiosInstance.patch("/update-allcode", data);

    console.log("API response:", response.data);

    showSuccessToast("Type job updated successfully!");
    return redirect("/admin/work-type");
  } catch (error) {
    console.error("Error updating type job:", error.response?.data || error);
    const errorMessage =
      error?.response?.data?.message || "Failed to update type job.";
    showErrorToast(errorMessage);
    return { errors: { general: errorMessage } };
  }
};

const EditWorkType = () => {
  const typeJob = useLoaderData();
  const actionData = useActionData();

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">chỉnh sửa cấp bậc</h4>
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

          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  );
};

export default EditWorkType;
