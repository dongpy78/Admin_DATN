import React from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import JobTableWrapper from "../../assets/wrappers/JobTableWrapper";
import { Link } from "react-router-dom";

const TypeJobTable = ({
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
    <JobTableWrapper>
      <h5 className="title-list-job">Danh sách Loại Công Việc</h5>
      <h5 className="title-amount">Tổng số lượng công việc: {totalCount}</h5>
      <div className="jobtype-container">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên công việc</th>
              <th>Mã code</th>
              <th>Loại công việc</th>
              <th>Hình ảnh</th>
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
                <td>
                  {typeJob.image ? (
                    <img
                      src={typeJob.image}
                      alt={typeJob.value}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  ) : (
                    "Không có ảnh"
                  )}
                </td>
                <td className="actions-custom">
                  <Link
                    title="Edit type job"
                    to={`/admin/type-job/edit/${typeJob.code}`}
                    className="edit-btn"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    style={{ marginLeft: "4px" }}
                    title="Delete Type Job"
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
      <Link to="/admin/type-job/add" className="btn add-user-btn">
        Thêm loại công việc
      </Link>
    </JobTableWrapper>
  );
};

export default TypeJobTable;
