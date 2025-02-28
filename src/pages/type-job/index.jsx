import React, { useState, useEffect } from "react";
import TypeJobTable from "../../components/type-jobs/TypeJobTable";
import JobTableWrapper from "../../assets/wrappers/JobTableWrapper";
import DashboardFormPage from "../../assets/wrappers/DashboardFormPage";
import SearchTypeJob from "../../components/type-jobs/SearchTypeJob";
import PageTypeJob from "../../components/type-jobs/PageTypeJob";
import axiosInstance from "../../libs/axiosInterceptor";
import {
  showSuccessToast,
  showErrorToast,
} from "../../utils/toastNotifications";
import { useLoaderData, useActionData, useNavigate } from "react-router-dom";

// Loader để lấy dữ liệu ban đầu
export const loader = async ({ request }) => {
  const params = new URLSearchParams(request.url.split("?")[1]);
  const page = parseInt(params.get("page") || "1", 10);
  const offset = (page - 1) * 5; // 5 bản ghi mỗi trang
  try {
    const response = await axiosInstance.get(
      `/list-allcodes?type=JOBTYPE&limit=5&offset=${offset}` // Đổi limit từ 10 thành 5
    );
    if (response.status === 200) {
      const numOfPages = Math.ceil(response.data.data.count / 5) || 1; // Tính số trang với limit=5
      return {
        typeJobs: response.data.data.rows,
        searchValues: {},
        numOfPages,
        currentPage: page,
      };
    }
    throw new Error("Failed to fetch type jobs.");
  } catch (error) {
    console.error("Error fetching type jobs:", error);
    showErrorToast(
      error.response?.data?.message || "Failed to fetch type jobs."
    );
    return { typeJobs: [], searchValues: {}, numOfPages: 1, currentPage: 1 };
  }
};

// Action để xử lý dữ liệu tìm kiếm
export const action = async ({ request }) => {
  const formData = await request.formData();
  const searchValues = Object.fromEntries(formData);
  const params = new URLSearchParams(request.url.split("?")[1]);
  const page = parseInt(params.get("page") || "1", 10);
  const offset = (page - 1) * 5; // 5 bản ghi mỗi trang
  try {
    const searchQuery = searchValues.search
      ? `&search=${encodeURIComponent(searchValues.search)}`
      : "";
    const url = `/list-allcodes?type=JOBTYPE&limit=5&offset=${offset}${searchQuery}`; // Đổi limit từ 10 thành 5
    console.log("Fetching URL:", url);
    const response = await axiosInstance.get(url);
    console.log("API response:", response.data);
    if (response.status === 200) {
      const numOfPages = Math.ceil(response.data.data.count / 5) || 1;
      return {
        typeJobs: response.data.data.rows,
        searchValues,
        numOfPages,
        currentPage: page,
      };
    }
    throw new Error("Failed to fetch type jobs.");
  } catch (error) {
    console.error("Error fetching type jobs:", error);
    showErrorToast(
      error.response?.data?.message || "Failed to fetch type jobs."
    );
    return {
      typeJobs: [],
      searchValues,
      numOfPages: 1,
      currentPage: page,
    };
  }
};

const TypeJob = () => {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const navigate = useNavigate();
  const [typeJobs, setTypeJobs] = useState(loaderData?.typeJobs || []);
  const [loading, setLoading] = useState(false);
  const numOfPages = actionData?.numOfPages || loaderData?.numOfPages || 1;
  const currentPage = actionData?.currentPage || loaderData?.currentPage || 1;

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

  const handlePageChange = (pageNumber) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", pageNumber);
    navigate(`/admin/type-job?${searchParams.toString()}`);
  };

  useEffect(() => {
    if (actionData) {
      setTypeJobs(actionData.typeJobs);
    } else {
      setTypeJobs(loaderData?.typeJobs || []);
    }
  }, [loaderData, actionData]);

  return (
    <DashboardFormPage>
      <SearchTypeJob />
      {loading ? (
        <p>Loading type jobs...</p>
      ) : (
        <>
          <TypeJobTable
            typeJobs={typeJobs}
            onDelete={handleDelete}
            currentPage={currentPage}
          />
          {numOfPages > 1 && (
            <PageTypeJob
              numOfPages={numOfPages}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
            />
          )}
        </>
      )}
    </DashboardFormPage>
  );
};

export default TypeJob;
