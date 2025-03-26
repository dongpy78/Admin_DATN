import React from "react";
import { FaEdit } from "react-icons/fa";
import { FaLock, FaUnlock } from "react-icons/fa";
import UserTableWrapper from "../../assets/wrappers/UserTableWrapper";
import { Link } from "react-router-dom";
import SkillTableWrapper from "../../assets/wrappers/SkillTableWrapper";

const UserTable = ({ users, onBanUnban }) => {
  console.log("Users data:", users);

  if (!users || users.length === 0) {
    return (
      <UserTableWrapper>
        <h2>No users to display...</h2>
      </UserTableWrapper>
    );
  }
  return (
    <SkillTableWrapper>
      <h5 className="title-amount">Số lượng người dùng: {users.length}</h5>
      <div className="users-container" style={{ marginTop: "1rem" }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{`${user.userAccountData.firstName} ${user.userAccountData.lastName}`}</td>
                <td>{user.email}</td>
                <td>{user.userAccountData.phonenumber}</td>
                <td>{user.roleData.value}</td>

                <td>
                  {user.userAccountData.dob
                    ? new Date(user.userAccountData.dob).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{user.userAccountData.genderData.value}</td>
                <td>
                  <span
                    className={
                      user.statusAccountData.value === "Đã kích hoạt"
                        ? "status-active"
                        : user.statusAccountData.value === "Chưa kích hoạt"
                        ? "status-inactive"
                        : "status-default" // Thêm class mặc định nếu cần
                    }
                  >
                    {user.statusAccountData.value}
                  </span>
                </td>
                <td className="actions">
                  <Link
                    title="Edit user"
                    to={`/admin/list-user/edit/${user.userId}`}
                    className="edit-btn"
                  >
                    <FaEdit />
                  </Link>

                  <button
                    className="ban-unban-btn"
                    onClick={() => onBanUnban(user.userId)}
                    title={
                      user.statusAccountData.value === "Đã kích hoạt"
                        ? "Ban user"
                        : "Unban user"
                    }
                  >
                    {user.statusAccountData.value === "Đã kích hoạt" ? (
                      <FaLock />
                    ) : (
                      <FaUnlock />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link to="/admin/users/add" className="btn add-user-btn">
        Add User
      </Link>
    </SkillTableWrapper>
  );
};

export default UserTable;
