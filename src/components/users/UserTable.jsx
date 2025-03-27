import React from "react";
import { FaEdit, FaLock, FaUnlock } from "react-icons/fa";
import UserTableWrapper from "../../assets/wrappers/UserTableWrapper";
import { Link } from "react-router-dom";

const UserTable = ({ users, onBanUnban, currentPage = 1, totalCount = 0 }) => {
  console.log("Users data:", users);

  if (!users || users.length === 0) {
    return (
      <UserTableWrapper>
        <h2>No users to display...</h2>
      </UserTableWrapper>
    );
  }

  const itemsPerPage = 5;

  return (
    <UserTableWrapper>
      <h5 className="title-amount">Số lượng người dùng: {totalCount}</h5>
      <div className="jobtype-container">
        <table>
          <thead>
            <tr>
              <th>STT</th>
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
            {users.map((user, index) => (
              <tr key={user.userId || user.id}>
                {" "}
                {/* Dùng userId hoặc id làm key */}
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{user.userId || user.id}</td>
                <td>{`${user.userAccountData?.firstName || "N/A"} ${
                  user.userAccountData?.lastName || "N/A"
                }`}</td>
                <td>{user.email || "N/A"}</td>
                <td>{user.userAccountData?.phonenumber || "N/A"}</td>
                <td>{user.roleData?.value || "N/A"}</td>
                <td>
                  {user.userAccountData?.dob
                    ? new Date(user.userAccountData.dob).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{user.userAccountData?.genderData?.value || "N/A"}</td>
                <td>
                  <span
                    className={
                      user.statusAccountData?.value === "Đã kích hoạt"
                        ? "status-active"
                        : user.statusAccountData?.value === "Chưa kích hoạt"
                        ? "status-inactive"
                        : "status-default"
                    }
                  >
                    {user.statusAccountData?.value || "N/A"}
                  </span>
                </td>
                <td className="actions">
                  <Link
                    title="Edit user"
                    to={`/admin/list-user/edit/${user.userId || user.id}`}
                    className="edit-btn"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    className="ban-unban-btn"
                    onClick={() => onBanUnban(user.userId || user.id)}
                    title={
                      user.statusAccountData?.value === "Đã kích hoạt"
                        ? "Ban user"
                        : "Unban user"
                    }
                  >
                    {user.statusAccountData?.value === "Đã kích hoạt" ? (
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
    </UserTableWrapper>
  );
};

export default UserTable;
