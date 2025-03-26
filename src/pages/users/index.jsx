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
import SkillTableWrapper from "../../assets/wrappers/SkillTableWrapper";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(
        "/auth/get-all-user?limit=10&offset=0"
      );
      if (response.status === 200) {
        setUsers(response.data.data.rows);
        console.log("User retrieved", response.data.data.rows);
        // showSuccessToast("Fetched users successfully!");
      } else {
        showErrorToast(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to fetch users.";
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUnban = async (id) => {
    const user = users.find((u) => u.userId === id); // Sửa: Dùng userId thay vì id
    const isBanning = user.statusAccountData.value === "Đã kích hoạt";
    const endpoint = isBanning ? "/auth/ban-account" : "/auth/unban-account";

    try {
      const response = await axiosInstance.post(endpoint, { userId: id }); // id đã là userId
      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.userId === id // Sửa: Dùng userId thay vì id
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
      const errorMessage =
        error.response?.data?.message || "Failed to update user status.";
      showErrorToast(errorMessage);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <SkillTableWrapper>
      <SearchUser />
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <>
          <UserTable users={users} onBanUnban={handleBanUnban} />
        </>
      )}
    </SkillTableWrapper>
  );
};

export default Users;
