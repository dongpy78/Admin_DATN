import React from "react";
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

// Giả lập dữ liệu user hiện tại (sẽ được thay bằng dữ liệu thực từ props hoặc API)
const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  location: "Hà Nội",
  status: USER_STATUS.ACTIVE,
  role: USER_ROLES.USER,
};

const EditUser = () => {
  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">Edit User</h4>
        <div className="form-center">
          <FormRow
            type="text"
            name="name"
            labelText="Name"
            defaultValue={mockUser.name} // Dữ liệu giả
          />
          <FormRow
            type="email"
            name="email"
            labelText="Email"
            defaultValue={mockUser.email} // Dữ liệu giả
          />
          <FormRow
            type="text"
            labelText="Location"
            name="location"
            defaultValue={mockUser.location} // Dữ liệu giả
          />
          <FormRowSelect
            labelText="User Status"
            name="status"
            defaultValue={mockUser.status} // Dữ liệu giả
            list={Object.values(USER_STATUS)}
          />
          <FormRowSelect
            name="role"
            labelText="Role"
            defaultValue={mockUser.role} // Dữ liệu giả
            list={Object.values(USER_ROLES)}
          />
          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  );
};

export default EditUser;
