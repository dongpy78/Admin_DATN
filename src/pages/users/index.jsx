import React, { useState } from "react";
import UserTable from "../../components/users/UserTable";
import UserTableWrapper from "../../assets/wrappers/UserTableWrapper";

const Users = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "User" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Admin" },
  ]);

  return (
    <UserTableWrapper>
      <h2>Quản lý User</h2>
      <UserTable users={users} />
    </UserTableWrapper>
  );
};

export default Users;
