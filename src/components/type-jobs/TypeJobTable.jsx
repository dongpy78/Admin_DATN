import React from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import JobTableWrapper from "../../assets/wrappers/JobTableWrapper";
import { Link } from "react-router-dom";

const TypeJobTable = ({ typeJobs, onDelete }) => {
  if (!typeJobs || typeJobs.length === 0) {
    return (
      <JobTableWrapper>
        <h2>No type jobs to display...</h2>
      </JobTableWrapper>
    );
  }
  return (
    <JobTableWrapper>
      <h5>
        {typeJobs.length} type job{typeJobs.length > 1 ? "s" : ""} found
      </h5>
      <div className="jobtype-container">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã code</th>
              <th>Loại công việc</th>
              <th>Tên công việc</th>
              <th>Hình ảnh</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {typeJobs.map((typeJob, index) => (
              <tr key={typeJob.code}>
                {/* Dùng code làm key vì API không có id */}
                <td>{index + 1}</td>
                <td>{typeJob.code}</td>
                <td>{typeJob.type}</td>
                <td>{typeJob.value}</td>
                <td>{typeJob.image || "N/A"}</td>
                <td className="actions">
                  <Link
                    title="Edit type job"
                    to={`/admin/type-job/edit/${typeJob.code}`} // Dùng code cho đường dẫn
                    className="edit-btn"
                  >
                    <FaEdit />
                  </Link>
                  <button
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
        Add Type Job
      </Link>
    </JobTableWrapper>
  );
};

export default TypeJobTable;
