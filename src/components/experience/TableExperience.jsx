import React from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import JobTableWrapper from "../../assets/wrappers/JobTableWrapper";
import { Link } from "react-router-dom";

const TableExperience = ({
  typeJobs,
  onDelete,
  currentPage = 1,
  totalCount = 0,
}) => {
  if (!typeJobs || typeJobs.length === 0) {
    return (
      <JobTableWrapper>
        <h5>No type jobs to display...</h5>
      </JobTableWrapper>
    );
  }
  const itemsPerPage = 5;
  return (
    <>
      <JobTableWrapper>
        <h5 className="title-list-job">
          Danh sách khoảng kinh nghiệm làm việc
        </h5>
        <h5 className="title-amount">Tổng số lượng: {totalCount}</h5>
        <div className="jobtype-container">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên khoảng kinh nghiệm</th>
                <th>Mã code</th>
                <th>Loại hình thức</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {typeJobs.map((typeJob, index) => (
                <tr key={typeJob.code}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{typeJob.value}</td>
                  <td>{typeJob.code}</td>
                  <td>{typeJob.type}</td>
                  <td className="actions">
                    <Link
                      title="Edit level"
                      to={`/admin/work-exp/edit/${typeJob.code}`}
                      className="edit-btn"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      title="Delete level"
                      onClick={() => onDelete(typeJob.code)}
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
        <Link to="/admin/work-exp/add" className="btn add-user-btn">
          Thêm kinh nghiệm làm việc
        </Link>
      </JobTableWrapper>
    </>
  );
};

export default TableExperience;
