import React, { useState, useEffect } from "react";
import axiosInstance from "../../libs/axiosInterceptor";
import {
  showSuccessToast,
  showErrorToast,
} from "../../utils/toastNotifications";
import SkillTableWrapper from "../../assets/wrappers/SkillTableWrapper";
import { useLoaderData, useActionData, useNavigate } from "react-router-dom";
import SearchSkill from "../../components/skills/SearchSkill";
import TableSkill from "../../components/skills/TableSkill";
import PageTypeJob from "../../components/type-jobs/PageTypeJob";

// Loader để lấy danh sách kỹ năng
export const loader = async ({ request }) => {
  const params = new URLSearchParams(request.url.split("?")[1]);
  const page = parseInt(params.get("page") || "1", 10);
  const limit = 5;
  const offset = (page - 1) * limit;
  try {
    const response = await axiosInstance.get(
      `/list-skills?limit=${limit}&offset=${offset}`
    );
    console.log("Loader response:", response.data);
    if (response.status === 200 && response.data.data) {
      const numOfPages = Math.ceil(response.data.data.count / limit) || 1;
      const allSkillsResponse = await axiosInstance.get(
        `/list-skills?limit=100&offset=0`
      );
      const categoryJobCodes = [
        "Tất cả",
        ...new Set(
          allSkillsResponse.data.data.rows.map(
            (skill) => skill.jobTypeSkillData.code
          )
        ),
      ];
      return {
        skills: response.data.data.rows || [],
        numOfPages,
        currentPage: page,
        totalCount: response.data.data.count || 0,
        categoryJobCodes,
      };
    }
    throw new Error("Failed to fetch skills.");
  } catch (error) {
    console.error("Error in loader:", error);
    showErrorToast(error.response?.data?.message || "Failed to fetch skills.");
    return {
      skills: [],
      numOfPages: 1,
      currentPage: 1,
      totalCount: 0,
      categoryJobCodes: ["Tất cả"],
    };
  }
};

// Action để xử lý tìm kiếm
export const action = async ({ request }) => {
  const formData = await request.formData();
  const searchValues = Object.fromEntries(formData);
  const params = new URLSearchParams(request.url.split("?")[1]);
  const page = parseInt(params.get("page") || "1", 10);
  const limit = 5;
  const offset = (page - 1) * limit;
  try {
    const searchQuery = searchValues.search
      ? `&search=${encodeURIComponent(searchValues.search)}`
      : "&search=";
    const categoryJobCodeQuery =
      searchValues.categoryJobCode && searchValues.categoryJobCode !== "Tất cả"
        ? `&categoryJobCode=${encodeURIComponent(searchValues.categoryJobCode)}`
        : "&categoryJobCode=";
    const url = `/list-skills?limit=${limit}&offset=${offset}${searchQuery}${categoryJobCodeQuery}`;
    console.log("Action URL:", url);
    const response = await axiosInstance.get(url);
    console.log("Action response:", response.data);
    if (response.status === 200 && response.data.data) {
      const numOfPages = Math.ceil(response.data.data.count / limit) || 1;
      return {
        skills: response.data.data.rows || [],
        numOfPages,
        currentPage: page,
        totalCount: response.data.data.count || 0,
      };
    }
    throw new Error("Invalid response from API");
  } catch (error) {
    console.error("Error in action:", error.message || error);
    console.error("Error details:", error.response?.data || error);

    return {
      skills: [],
      numOfPages: 1,
      currentPage: page,
      totalCount: 0,
    };
  }
};

const Skills = () => {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const navigate = useNavigate();
  const [skills, setSkills] = useState(loaderData?.skills || []);
  const [totalCount, setTotalCount] = useState(loaderData?.totalCount || 0);
  const [loading, setLoading] = useState(false);
  const numOfPages = actionData?.numOfPages || loaderData?.numOfPages || 1;
  const currentPage = actionData?.currentPage || loaderData?.currentPage || 1;
  const categoryJobCodes = loaderData?.categoryJobCodes || ["Tất cả"];

  const fetchSkills = async (page) => {
    setLoading(true);
    try {
      const offset = (page - 1) * 5;
      const searchParams = new URLSearchParams(window.location.search);
      const searchQuery = searchParams.get("search")
        ? `&search=${encodeURIComponent(searchParams.get("search"))}`
        : "&search=";
      const categoryJobCodeQuery = searchParams.get("categoryJobCode")
        ? `&categoryJobCode=${encodeURIComponent(
            searchParams.get("categoryJobCode")
          )}`
        : "&categoryJobCode=";
      const url = `/list-skills?limit=5&offset=${offset}${searchQuery}${categoryJobCodeQuery}`;
      console.log("Fetching URL after update:", url);
      const response = await axiosInstance.get(url);
      if (response.status === 200 && response.data.data) {
        setSkills(response.data.data.rows || []);
        setTotalCount(response.data.data.count || 0);
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
      showErrorToast(
        error.response?.data?.message || "Failed to fetch skills."
      );
      setSkills([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true); // Hiển thị loading khi xóa
    try {
      const response = await axiosInstance.delete(`/delete-skill?id=${id}`);
      if (response.status === 200) {
        await fetchSkills(currentPage);
        showSuccessToast("Skill deleted successfully!");
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting skill:", error.response?.data || error);
      const errorMessage =
        error.response?.data?.msg === "not found"
          ? "Kỹ năng không tồn tại"
          : error.response?.data?.message || "Failed to delete skill";
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", pageNumber);
    navigate(`/admin/work-skill?${searchParams.toString()}`);
  };

  useEffect(() => {
    // console.log("actionData:", actionData);
    // console.log("loaderData:", loaderData);
    if (actionData && "skills" in actionData) {
      setSkills(actionData.skills || []);
      setTotalCount(actionData.totalCount || 0);
    } else {
      setSkills(loaderData?.skills || []);
      setTotalCount(loaderData?.totalCount || 0);
    }
  }, [loaderData, actionData]);

  return (
    <SkillTableWrapper>
      <SearchSkill categoryJobCodes={categoryJobCodes} />
      {loading ? (
        <p>Loading skills...</p>
      ) : (
        <>
          <TableSkill
            skills={skills}
            onDelete={handleDelete}
            currentPage={currentPage}
            totalCount={totalCount}
            fetchSkills={fetchSkills}
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
    </SkillTableWrapper>
  );
};

export default Skills;
