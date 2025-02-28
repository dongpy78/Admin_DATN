import React from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import SkillTableWrapper from "../../assets/wrappers/SkillTableWrapper";
import { Link } from "react-router-dom";

const TableSkill = () => {
  return (
    <SkillTableWrapper>
      <div className="skill-container">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã code</th>
              <th>Tên công việc</th>
              <th>Hình ảnh</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr key="1">
              <td>1</td>
              <td>Công nghệ thông tin</td>
              <td>cong-nghe-thong-tin</td>
              <td>heheheh</td>
              <td className="actions">
                <Link
                  title="Edit user"
                  to={`/admin/skills/edit`}
                  className="edit-btn"
                >
                  <FaEdit />
                </Link>
                <button title="Delete User" className="delete-btn">
                  <MdDelete />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Link to="/admin/skills/add" className="btn add-user-btn">
        Add Type Job
      </Link>
    </SkillTableWrapper>
  );
};

export default TableSkill;
