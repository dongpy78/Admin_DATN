import React from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import SkillTableWrapper from "../../assets/wrappers/SkillTableWrapper";
import { Link } from "react-router-dom";

const TableSkill = ({
  skills,
  onDelete,
  currentPage = 1,
  totalCount = 0,
  fetchSkills,
}) => {
  if (!skills || skills.length === 0) {
    return (
      <SkillTableWrapper>
        <h5>No skills to display...</h5>
      </SkillTableWrapper>
    );
  }

  const itemsPerPage = 5;

  return (
    <SkillTableWrapper>
      <h5 className="title-list-job">Danh sách Kỹ Năng</h5>
      <h5 className="title-amount">Tổng số lượng kỹ năng: {totalCount}</h5>
      <div className="skill-container">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên kỹ năng</th>
              <th>Lĩnh vực</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill, index) => (
              <tr key={skill.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{skill.name}</td>
                <td>{skill.categoryJobCode}</td>
                <td className="actions">
                  <Link
                    title="Edit skill"
                    to={`/admin/work-skill/edit/${skill.id}`}
                    className="edit-btn"
                    onClick={() => fetchSkills(currentPage)} // Làm mới sau khi quay lại từ edit
                  >
                    <FaEdit />
                  </Link>
                  <button
                    title="Delete Skill"
                    onClick={() => onDelete(skill.id)}
                    className="delete-btn"
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link to="/admin/work-skill/add" className="btn add-user-btn">
        Thêm kỹ năng
      </Link>
    </SkillTableWrapper>
  );
};

export default TableSkill;
