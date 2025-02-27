import React, { useEffect, useState } from "react";
import TypeJobTable from "../../components/type-jobs/TypeJobTable";
import JobTableWrapper from "../../assets/wrappers/JobTableWrapper";
import axiosInstance from "../../libs/axiosInterceptor";
import {
  showSuccessToast,
  showErrorToast,
} from "../../utils/toastNotifications";

const TypeJob = () => {
  const [typeJobs, setTypeJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTypeJobs = async () => {
    try {
      const response = await axiosInstance.get(
        "/list-allcodes?type=JOBTYPE&limit=10&offset=0"
      );
      if (response.status === 200) {
        setTypeJobs(response.data.data.rows); // Lấy danh sách từ rows
        showSuccessToast("Fetched type jobs successfully!");
      } else {
        showErrorToast(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching type jobs:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to fetch type jobs.";
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (code) => {
    try {
      const response = await axiosInstance.delete(
        `/delete-allcode?code=${code}`
      );
      if (response.status === 200) {
        setTypeJobs((prev) => prev.filter((typeJob) => typeJob.code !== code));
        showSuccessToast("Type job deleted successfully!");
      } else {
        showErrorToast(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting type job:", error.response?.data || error);
      showErrorToast(
        error?.response?.data?.message || "Failed to delete type job."
      );
    }
  };

  useEffect(() => {
    fetchTypeJobs();
  }, []);
  return (
    <JobTableWrapper>
      <h2 className="title-manage-user">Danh sách Loại Công Việc</h2>
      {loading ? (
        <p>Loading type jobs...</p>
      ) : (
        <TypeJobTable typeJobs={typeJobs} onDelete={handleDelete} />
      )}
    </JobTableWrapper>
  );
};

export default TypeJob;
