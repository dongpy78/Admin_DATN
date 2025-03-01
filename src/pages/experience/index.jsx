import React, { useState, useEffect } from "react";
import JobTableWrapper from "../../assets/wrappers/JobTableWrapper";
import PageTypeJob from "../../components/type-jobs/PageTypeJob";
import axiosInstance from "../../libs/axiosInterceptor";
import {
  showSuccessToast,
  showErrorToast,
} from "../../utils/toastNotifications";
import { useLoaderData, useActionData, useNavigate } from "react-router-dom";
import SearchExperience from "../../components/experience/SearchExperience";
import TableExperience from "../../components/experience/TableExperience";

// Loader để lấy dữ liệu ban đầu
export const loader = async ({ request }) => {
  const params = new URLSearchParams(request.url.split("?")[1]);
  const page = parseInt(params.get("page") || "1", 10);
  const offset = (page - 1) * 5;
  try {
    const response = await axiosInstance.get(
      `/list-allcodes?type=EXPTYPE&limit=5&offset=${offset}`
    );
    if (response.status === 200) {
      const numOfPages = Math.ceil(response.data.data.count / 5) || 1;
      return {
        typeJobs: response.data.data.rows || [],
        searchValues: {},
        numOfPages,
        currentPage: page,
        totalCount: response.data.data.count || 0,
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
    const url = `/list-allcodes?type=EXPTYPE&limit=5&offset=${offset}${searchQuery}`;
    console.log("Fetching URL:", url);
    const response = await axiosInstance.get(url);
    console.log("API response:", response.data);
    if (response.status === 200) {
      const numOfPages = Math.ceil(response.data.data.count / 5) || 1;
      return {
        typeJobs: response.data.data.rows || [],
        searchValues,
        numOfPages,
        currentPage: page,
        totalCount: response.data.data.count || 0,
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

const Experience = () => {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const navigate = useNavigate();
  const [typeJobs, setTypeJobs] = useState(loaderData?.typeJobs || []);
  const [totalCount, setTotalCount] = useState(loaderData?.totalCount || 0);
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
      const url = `/list-allcodes?type=EXPTYPE&limit=5&offset=${offset}${searchQuery}`;
      console.log("Fetching URL after delete:", url);
      const response = await axiosInstance.get(url);
      console.log("Fetch response:", response.data);
      if (response.status === 200 && response.data.data) {
        setTypeJobs(response.data.data.rows || []);
        setTotalCount(response.data.data.count || 0);
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching type jobs after delete:", error);

      setTypeJobs([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (code) => {
    setLoading(true);
    try {
      const response = await axiosInstance.delete(
        `/delete-allcode?code=${code}`
      );
      if (response.status === 200) {
        await fetchTypeJobs(currentPage);
        showSuccessToast("Salary deleted successfully!");
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting level:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", pageNumber);
    navigate(`/admin/work-exp?${searchParams.toString()}`);
  };

  useEffect(() => {
    if (actionData) {
      setTypeJobs(actionData.typeJobs || []);
      setTotalCount(actionData.totalCount || 0);
    } else {
      setTypeJobs(loaderData?.typeJobs || []);
      setTotalCount(loaderData?.totalCount || 0);
    }
  }, [loaderData, actionData]);

  return (
    <JobTableWrapper>
      <SearchExperience />
      {loading ? (
        <p>Loading levels...</p>
      ) : (
        <>
          <TableExperience
            typeJobs={typeJobs}
            onDelete={handleDelete}
            currentPage={currentPage}
            totalCount={totalCount}
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

export default Experience;
