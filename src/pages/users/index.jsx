import React, { useEffect, useState } from "react";
import UserTable from "../../components/users/UserTable";
import UserTableWrapper from "../../assets/wrappers/UserTableWrapper";
import axiosInstance from "../../libs/axiosInterceptor";
import SearchUser from "../../components/users/SearchUser";
import PageTypeJob from "../../components/type-jobs/PageTypeJob";
import {
  showSuccessToast,
  showErrorToast,
} from "../../utils/toastNotifications";
import { useActionData, useLoaderData, useNavigate } from "react-router-dom";

// Loader để lấy dữ liệu ban đầu
export const loader = async ({ request }) => {
  const params = new URLSearchParams(request.url.split("?")[1]);
  const page = parseInt(params.get("page") || "1", 10);
  const offset = (page - 1) * 5;

  try {
    const url = `/auth/get-all-user?limit=5&offset=${offset}`;
    console.log("Fetching URL in loader:", url);
    const response = await axiosInstance.get(url);
    console.log("Loader API response:", response.data);

    if (response.status === 200) {
      const numOfPages = Math.ceil(response.data.data.count / 5) || 1;
      return {
        users: response.data.data.rows || [],
        numOfPages,
        currentPage: page,
        totalCount: response.data.data.count || 0,
      };
    }
    throw new Error("Failed to fetch users.");
  } catch (error) {
    console.error(
      "Error fetching users:",
      error.response?.data || error.message
    );
    return {
      users: [],
      numOfPages: 1,
      currentPage: 1,
      totalCount: 0,
    };
  }
};

// Action để xử lý tìm kiếm
export const action = async ({ request }) => {
  const formData = await request.formData();
  const searchValues = Object.fromEntries(formData);
  return { searchValues };
};

const Users = () => {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]); // Lưu trữ tất cả người dùng đã tải
  const [filteredUsers, setFilteredUsers] = useState(loaderData?.users || []); // Người dùng hiển thị sau khi lọc
  const [totalCount, setTotalCount] = useState(loaderData?.totalCount || 0);
  const [loading, setLoading] = useState(false);
  const numOfPages = loaderData?.numOfPages || 1;
  const currentPage = loaderData?.currentPage || 1;
  const itemsPerPage = 5;

  const fetchUsers = async (page) => {
    setLoading(true);
    try {
      const offset = (page - 1) * 5;
      const url = `/auth/get-all-user?limit=5&offset=${offset}`;
      console.log("Fetching URL in fetchUsers:", url);
      const response = await axiosInstance.get(url);
      console.log("Fetch response:", response.data);

      if (response.status === 200 && response.data.data) {
        const newUsers = response.data.data.rows || [];
        setAllUsers((prev) => {
          // Loại bỏ trùng lặp dựa trên userId
          const updatedUsers = [...prev, ...newUsers].reduce((unique, user) => {
            return unique.some((u) => u.userId === user.userId)
              ? unique
              : [...unique, user];
          }, []);
          return updatedUsers;
        });
        setTotalCount(response.data.data.count || 0);
        if (response.data.data.count === 0) {
          showSuccessToast("Không có người dùng nào!");
        }
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      showErrorToast(error.response?.data?.message || "Failed to fetch users");
      setAllUsers([]);
      setFilteredUsers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUnban = async (id) => {
    const user = allUsers.find((u) => u.userId === id);
    const isBanning = user.statusAccountData.value === "Đã kích hoạt";
    const endpoint = isBanning ? "/auth/ban-account" : "/auth/unban-account";

    try {
      const response = await axiosInstance.post(endpoint, { userId: id });
      if (response.status === 200) {
        setAllUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.userId === id
              ? {
                  ...u,
                  statusAccountData: {
                    ...u.statusAccountData,
                    value: isBanning ? "Chưa kích hoạt" : "Đã kích hoạt",
                  },
                }
              : u
          )
        );
        setFilteredUsers((prevFiltered) =>
          prevFiltered.map((u) =>
            u.userId === id
              ? {
                  ...u,
                  statusAccountData: {
                    ...u.statusAccountData,
                    value: isBanning ? "Chưa kích hoạt" : "Đã kích hoạt",
                  },
                }
              : u
          )
        );
        showSuccessToast(
          isBanning
            ? "User banned successfully!"
            : "User unbanned successfully!"
        );
      } else {
        showErrorToast(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error(
        `Error ${isBanning ? "banning" : "unbanning"} user:`,
        error
      );
      showErrorToast(
        error.response?.data?.message || "Failed to update user status."
      );
    }
  };

  const handlePageChange = (pageNumber) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", pageNumber);
    navigate(`/admin/list-user?${searchParams.toString()}`);
    fetchUsers(pageNumber); // Tải dữ liệu trang mới
  };

  // Lọc và phân trang dữ liệu khi actionData hoặc allUsers thay đổi
  useEffect(() => {
    let usersToFilter = allUsers;
    if (actionData?.searchValues?.search) {
      const searchTerm = actionData.searchValues.search.toLowerCase();
      usersToFilter = allUsers.filter((user) =>
        `${user.userAccountData?.firstName || ""} ${
          user.userAccountData?.lastName || ""
        }`
          .toLowerCase()
          .includes(searchTerm)
      );
    }

    // Phân trang dữ liệu đã lọc
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setFilteredUsers(usersToFilter.slice(startIndex, endIndex));
  }, [actionData, allUsers, currentPage]);

  // Cập nhật allUsers từ loaderData
  useEffect(() => {
    setAllUsers((prev) => {
      const newUsers = loaderData?.users || [];
      const updatedUsers = [...prev, ...newUsers].reduce((unique, user) => {
        return unique.some((u) => u.userId === user.userId)
          ? unique
          : [...unique, user];
      }, []);
      return updatedUsers;
    });
    setTotalCount(loaderData?.totalCount || 0);
  }, [loaderData]);

  return (
    <UserTableWrapper>
      <SearchUser />
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <>
          <UserTable
            users={filteredUsers}
            onBanUnban={handleBanUnban}
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
    </UserTableWrapper>
  );
};

export default Users;
