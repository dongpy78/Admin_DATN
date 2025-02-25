import React from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import UserTableWrapper from "../../assets/wrappers/UserTableWrapper";
import { Link } from "react-router-dom";

const UserTable = ({ users }) => {
  if (!users || users.length === 0) {
    return (
      <UserTableWrapper>
        <h2>No users to display...</h2>
      </UserTableWrapper>
    );
  }
  return (
    <UserTableWrapper>
      <h5>
        {users.length} user{users.length > 1 ? "s" : ""} found
      </h5>
      <div className="users-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td className="actions">
                  <Link to={`/admin/users/edit`} className="edit-btn">
                    <FaEdit />
                  </Link>
                  <button
                    className="delete-btn"
                    onClick={() => onDelete(user.id)}
                  >
                    <MdDelete />
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
