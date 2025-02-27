import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { Form } from "react-router-dom";
import FormRowSelect from "../layout-dashboard/FormRowSelect";
import SubmitBtn from "../layout-dashboard/SubmitBtn";
import FormRow from "../layout-dashboard/FormRow";

// Dữ liệu giả cho user
const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
};

const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
  MODERATOR: "moderator",
};

const AddTypeJob = () => {
  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">add Type Job</h4>
        <div className="form-center">
          {/* Thay position bằng name */}
          <FormRow type="text" name="name" labelText="Name" />
          {/* Thay company bằng email */}
          <FormRow type="email" name="email" labelText="Email" />
          {/* Điều chỉnh jobLocation thành location */}
          <FormRow
            type="text"
            labelText="Location"
            name="location"
            defaultValue="Hà Nội" // Dữ liệu giả
          />

          {/* Thay job status bằng user status */}
          <FormRowSelect
            labelText="User Status"
            name="status"
            defaultValue={USER_STATUS.PENDING} // Giá trị mặc định
            list={Object.values(USER_STATUS)} // Danh sách tùy chọn
          />
          {/* Thay job type bằng role */}
          <FormRowSelect
            name="role"
            labelText="Role"
            defaultValue={USER_ROLES.USER} // Giá trị mặc định
            list={Object.values(USER_ROLES)} // Danh sách tùy chọn
          />
          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  );
};

export default AddTypeJob;
