import React, { useState, useEffect } from "react";
import TypeJobTable from "../../components/type-jobs/TypeJobTable";
import JobTableWrapper from "../../assets/wrappers/JobTableWrapper";
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
  const offset = (page - 1) * 5;
  try {
    const response = await axiosInstance.get(
      `/list-allcodes?type=JOBTYPE&limit=5&offset=${offset}`
    );
    if (response.status === 200) {
      const numOfPages = Math.ceil(response.data.data.count / 5) || 1;
      return {
        typeJobs: response.data.data.rows,
        searchValues: {},
        numOfPages,
        currentPage: page,
        totalCount: response.data.data.count,
      };
    }
    throw new Error("Failed to fetch type jobs.");
  } catch (error) {
    console.error("Error fetching type jobs:", error);

    return {
      typeJobs: [],
      searchValues: {},
      numOfPages: 1,
      currentPage: 1,
      totalCount: 0,
    };
  }
};

// Action để xử lý dữ liệu tìm kiếm
export const action = async ({ request }) => {
  const formData = await request.formData();
  const searchValues = Object.fromEntries(formData);
  const params = new URLSearchParams(request.url.split("?")[1]);
  const page = parseInt(params.get("page") || "1", 10);
  const offset = (page - 1) * 5;
  try {
    const searchQuery = searchValues.search
      ? `&search=${encodeURIComponent(searchValues.search)}`
      : "";
    const url = `/list-allcodes?type=JOBTYPE&limit=5&offset=${offset}${searchQuery}`;
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
        totalCount: response.data.data.count,
      };
    }
    throw new Error("Failed to fetch type jobs.");
  } catch (error) {
    console.error("Error fetching type jobs:", error);

    return {
      typeJobs: [],
      searchValues,
      numOfPages: 1,
      currentPage: page,
      totalCount: 0,
    };
  }
};

const TypeJob = () => {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const navigate = useNavigate();
  const [typeJobs, setTypeJobs] = useState(loaderData?.typeJobs || []);
  const [totalCount, setTotalCount] = useState(loaderData?.totalCount || 0); // Thêm state cho totalCount
  const [loading, setLoading] = useState(false);
  const numOfPages = actionData?.numOfPages || loaderData?.numOfPages || 1;
  const currentPage = actionData?.currentPage || loaderData?.currentPage || 1;

  // Hàm fetch dữ liệu cho trang hiện tại
  const fetchTypeJobs = async (page) => {
    setLoading(true);
    try {
      const offset = (page - 1) * 5;
      const searchParams = new URLSearchParams(window.location.search);
      const searchQuery = searchParams.get("search")
        ? `&search=${encodeURIComponent(searchParams.get("search"))}`
        : "";
      const url = `/list-allcodes?type=JOBTYPE&limit=5&offset=${offset}${searchQuery}`;
      console.log("Fetching URL after delete:", url);
      const response = await axiosInstance.get(url);
      if (response.status === 200) {
        setTypeJobs(response.data.data.rows);
        setTotalCount(response.data.data.count); // Cập nhật totalCount
        // showSuccessToast("Data updated successfully!");
      } else {
        showErrorToast(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching type jobs after delete:", error);
      showErrorToast(
        error.response?.data?.message || "Failed to fetch type jobs."
      );
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
        // Gọi lại API để cập nhật dữ liệu ngay lập tức
        await fetchTypeJobs(currentPage);
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
      setTotalCount(actionData.totalCount); // Cập nhật totalCount từ actionData
    } else {
      setTypeJobs(loaderData?.typeJobs || []);
      setTotalCount(loaderData?.totalCount || 0); // Cập nhật totalCount từ loaderData
    }
  }, [loaderData, actionData]);

  return (
    <JobTableWrapper>
      <SearchTypeJob />
      {loading ? (
        <p>Loading type jobs...</p>
      ) : (
        <>
          <TypeJobTable
            typeJobs={typeJobs}
            onDelete={handleDelete}
            currentPage={currentPage}
            totalCount={totalCount} // Truyền totalCount từ state
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
    </JobTableWrapper>
  );
};

export default TypeJob;
