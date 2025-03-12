import React, { useState, useEffect } from "react";
import JobTableWrapper from "../../assets/wrappers/JobTableWrapper";
import PageTypeJob from "../../components/type-jobs/PageTypeJob";
import axiosInstance from "../../libs/axiosInterceptor";
import {
  showSuccessToast,
  showErrorToast,
} from "../../utils/toastNotifications";
import { useLoaderData, useActionData, useNavigate } from "react-router-dom";
import SearchPost from "../../components/post/SearchPost";
import TablePost from "../../components/post/TablePost";

// Loader để lấy dữ liệu ban đầu
export const loader = async ({ request }) => {
  const params = new URLSearchParams(request.url.split("?")[1]);
  const page = parseInt(params.get("page") || "1", 10);
  const offset = (page - 1) * 5;
  const search = params.get("search") || "";

  try {
    let url = `/posts/all-posts?limit=5&offset=${offset}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    console.log("Fetching URL in loader:", url);
    const response = await axiosInstance.get(url);
    console.log("Loader API response:", response.data);

    if (response.status === 200) {
      const numOfPages = Math.ceil(response.data.data.count / 5) || 1;
      return {
        typePost: response.data.data.rows || [],
        searchValues: { search },
        numOfPages,
        currentPage: page,
        totalCount: response.data.data.count || 0,
      };
    }
    throw new Error("Failed to fetch companies.");
  } catch (error) {
    console.error(
      "Error fetching companies:",
      error.response?.data || error.message
    );
    return {
      typePost: [],
      searchValues: { search },
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
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  try {
    let url = `/posts/all-posts?limit=5&offset=${offset}`;
    if (searchValues.search)
      url += `&search=${encodeURIComponent(searchValues.search)}`;

    console.log("Fetching URL in action:", url);
    const response = await axiosInstance.get(url);
    console.log("Action API response:", response.data);

    if (response.status === 200) {
      const numOfPages = Math.ceil(response.data.data.count / 5) || 1;
      return {
        typePost: response.data.data.rows || [],
        searchValues,
        numOfPages,
        currentPage: page,
        totalCount: response.data.data.count || 0,
      };
    }
    throw new Error("Failed to fetch companies.");
  } catch (error) {
    console.error(
      "Error fetching companies:",
      error.response?.data || error.message
    );
    return {
      typePost: [],
      searchValues,
      numOfPages: 1,
      currentPage: page,
      totalCount: 0,
    };
  }
};

const Post = () => {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const navigate = useNavigate();
  const [typePost, setTypePost] = useState(loaderData?.typePost || []);
  const [filteredPost, setFilteredPost] = useState(loaderData?.typePost || []); // State cho danh sách đã lọc
  const [totalCount, setTotalCount] = useState(loaderData?.totalCount || 0);
  const [loading, setLoading] = useState(false);
  const numOfPages = actionData?.numOfPages || loaderData?.numOfPages || 1;
  const currentPage = actionData?.currentPage || loaderData?.currentPage || 1;

  const handlePageChange = (pageNumber) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", pageNumber);
    navigate(`/admin/post?${searchParams.toString()}`);
  };

  useEffect(() => {
    if (actionData) {
      setTypePost(actionData.typePost || []);
      setFilteredPost(actionData.typePost || []); // Cập nhật danh sách đã lọc
      setTotalCount(actionData.totalCount || 0);
    } else {
      setTypePost(loaderData?.typePost || []);
      setFilteredPost(loaderData?.typePost || []); // Cập nhật danh sách đã lọc
      setTotalCount(loaderData?.totalCount || 0);
    }
  }, [loaderData, actionData]);

  return (
    <JobTableWrapper>
      <SearchPost
        typePost={typePost}
        onFilterChange={setFilteredPost} // Truyền hàm để cập nhật danh sách đã lọc
      />
      {loading ? (
        <p>Loading companies...</p>
      ) : (
        <>
          <TablePost
            typePost={filteredPost} // Sử dụng danh sách đã lọc
            setTypePost={setTypePost}
            currentPage={currentPage}
            totalCount={filteredPost.length} // Tổng số công ty sau khi lọc
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

export default Post;
