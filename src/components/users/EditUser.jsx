import React from "react";
import {
  Form,
  useNavigate,
  useLoaderData,
  useActionData,
} from "react-router-dom";
import FormRow from "../layout-dashboard/FormRow";
import FormRowSelectV1 from "../layout-dashboard/FormRowSelect-V1";
import SubmitBtn from "../layout-dashboard/SubmitBtn";
import DashboardFormPage from "../../assets/wrappers/DashboardFormPage";
import axiosInstance from "../../libs/axiosInterceptor";
import {
  showSuccessToast,
  showErrorToast,
} from "../../utils/toastNotifications";

// Cập nhật loader để lấy thêm dữ liệu user
export const loader = async ({ params }) => {
  console.log("Params ID:", params.id); // Kiểm tra params.id
  try {
    const [userResponse, genderResponse, roleResponse] = await Promise.all([
      axiosInstance.get(`/auth/detail-user?userId=${params.id}`),
      axiosInstance.get("/list-allcodes?type=GENDER&limit=10&offset=0"),
      axiosInstance.get("/list-allcodes?type=ROLE&limit=10&offset=0"),
    ]);

    if (
      userResponse.status === 200 &&
      genderResponse.status === 200 &&
      roleResponse.status === 200
    ) {
      const genderOptions = genderResponse.data.data.rows.map((item) => ({
        value: item.code,
        label: item.value,
      }));
      const roleOptions = roleResponse.data.data.rows.map((item) => ({
        value: item.code,
        label: item.value,
      }));
      return {
        user: userResponse.data.data,
        genderOptions,
        roleOptions,
      };
    }
    throw new Error("Failed to fetch data");
  } catch (error) {
    console.error("Error fetching data:", error);
    showErrorToast(error.response?.data?.message || "Failed to fetch data.");
    return { user: null, genderOptions: [], roleOptions: [] };
  }
};

// Action giữ nguyên hoặc điều chỉnh theo API của bạn
export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    const response = await axiosInstance.patch("/auth/update-user", {
      id: params.id,
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      genderCode: data.genderCode,
      dob: data.dob,
      roleCode: data.roleCode,
    });
    if (response.status === 201) {
      showSuccessToast("User updated successfully!");
      return { success: true };
    }
    throw new Error("Unexpected response status");
  } catch (error) {
    console.error("Error updating user:", error.response?.data || error);
    const errorMessage =
      error.response?.data?.msg === "not found"
        ? "User không tồn tại"
        : error.response?.data?.message || "Không thể cập nhật user";
    showErrorToast(errorMessage);
    return { error: errorMessage };
  }
};

const EditUser = () => {
  const { user, genderOptions, roleOptions } = useLoaderData();
  const navigate = useNavigate();
  const actionData = useActionData();

  if (!user) {
    return <div>Loading...</div>;
  }

  if (actionData?.success) {
    setTimeout(() => navigate("/admin/list-user"), 1000);
  }

  return (
    <DashboardFormPage>
      <Form method="post" className="form">
        <h4 className="form-title">Cập Nhật Người Dùng</h4>
        <div className="form-center">
          <FormRow
            type="text"
            name="firstName"
            labelText="Họ"
            defaultValue={user.userAccountData?.firstName || ""}
          />
          <FormRow
            type="text"
            name="lastName"
            labelText="Tên"
            defaultValue={user.userAccountData?.lastName || ""}
          />
          <FormRow
            type="email"
            name="email"
            labelText="Email"
            defaultValue={user.email || ""}
            disabled={true}
          />
          <FormRow
            type="text"
            name="phonenumber"
            labelText="Số điện thoại"
            defaultValue={user.userAccountData?.phonenumber || ""}
            disabled={true}
          />
          <FormRow
            type="text"
            name="address"
            labelText="Địa chỉ"
            defaultValue={user.userAccountData?.address || ""}
          />
          <FormRow
            type="date"
            name="dob"
            labelText="Ngày sinh"
            defaultValue={
              user.userAccountData?.dob
                ? new Date(user.userAccountData.dob).toISOString().split("T")[0]
                : ""
            }
          />
          <FormRowSelectV1
            name="genderCode"
            labelText="Giới tính"
            list={genderOptions}
            defaultValue={user.userAccountData?.genderData?.code || ""}
          />
          <FormRowSelectV1
            name="roleCode"
            labelText="Vai trò"
            list={roleOptions}
            defaultValue={user.roleData?.code || ""}
          />
          <SubmitBtn formBtn />
        </div>
      </Form>
    </DashboardFormPage>
  );
};

export default EditUser;
