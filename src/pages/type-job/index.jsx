import React, { useState, useEffect } from "react";
import TypeJobTable from "../../components/type-jobs/TypeJobTable";
import SearchTypeJob from "../../components/type-jobs/SearchTypeJob";
import axiosInstance from "../../libs/axiosInterceptor";
import {
  showSuccessToast,
  showErrorToast,
} from "../../utils/toastNotifications";
import { useLoaderData, useActionData } from "react-router-dom";

// Loader để lấy dữ liệu ban đầu
export const loader = async () => {
  try {
    const response = await axiosInstance.get(
      "/list-allcodes?type=JOBTYPE&limit=10&offset=0"
    );
    if (response.status === 200) {
      // showSuccessToast("Fetch Job Successfully!");
      return { typeJobs: response.data.data.rows, searchValues: {} };
    }

    throw new Error("Failed to fetch type jobs.");
  } catch (error) {
    console.error("Error fetching type jobs:", error);
    // showErrorToast(
    //   error.response?.data?.message || "Failed to fetch type jobs."
    // );
    return { typeJobs: [], searchValues: {} };
  }
};

// Action để xử lý dữ liệu tìm kiếm
export const action = async ({ request }) => {
  const formData = await request.formData();
  const searchValues = Object.fromEntries(formData);
  try {
    // Nếu search rỗng, lấy toàn bộ danh sách như loader
    const searchQuery = searchValues.search
      ? `&search=${encodeURIComponent(searchValues.search)}`
      : "";
    const url = `/list-allcodes?type=JOBTYPE&limit=10&offset=0${searchQuery}`;
    // console.log("Fetching URL:", url);
    const response = await axiosInstance.get(url);
    // console.log("API response:", response.data);
    if (response.status === 200) {
      return { typeJobs: response.data.data.rows, searchValues };
    }
    throw new Error("Failed to fetch type jobs.");
  } catch (error) {
    console.error("Error fetching type jobs:", error);
    // showErrorToast(
    //   error.response?.data?.message || "Failed to fetch type jobs."
    // );
    return { typeJobs: [], searchValues };
  }
};

const TypeJob = () => {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [typeJobs, setTypeJobs] = useState(loaderData?.typeJobs || []);
  const [loading, setLoading] = useState(false);

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

  // Cập nhật typeJobs khi loaderData hoặc actionData thay đổi
  useEffect(() => {
    if (actionData) {
      setTypeJobs(actionData.typeJobs);
    } else {
      setTypeJobs(loaderData?.typeJobs || []);
    }
  }, [loaderData, actionData]);

  return (
    <>
      <SearchTypeJob />
      {loading ? (
        <p>Loading type jobs...</p>
      ) : (
        <TypeJobTable typeJobs={typeJobs} onDelete={handleDelete} />
      )}
    </>
  );
};

export default TypeJob;
