import React from "react";
import { useEffect, useState } from "react";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { getTagById, createTag, updateTag } from "../../services/blogService";
import FormRow from "../layout-dashboard/FormRow";
import { Form, useNavigate, useParams } from "react-router-dom";
import {
  showSuccessToast,
  showErrorToast,
} from "../../utils/toastNotifications";
const AddTagBlog = () => {
  const [isActionADD, setisActionADD] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const [inputValues, setInputValues] = useState({
    name: "",
  });

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (id) {
        setisActionADD(false);
        setIsLoading(true);
        try {
          const res = await getTagById(id);
          console.log("API response:", res);
          if (res.data && res.data.data) {
            setInputValues({
              name: res.data.data.name || "",
            });
            console.log("InputValues sau khi set:", {
              name: res.data.data.name,
            });
          } else {
            showErrorToast("Dữ liệu từ API không hợp lệ");
          }
        } catch (error) {
          showErrorToast(
            error.response?.data?.message || "Lỗi khi tải dữ liệu"
          );
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCategoryData();
  }, [id]);

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    console.log("HandleOnChange:", name, value);
    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveCategoryBlog = async () => {
    console.log("InputValues trước khi gửi:", inputValues);
    console.log("ID gửi đi:", id);
    if (!inputValues.name) {
      showErrorToast("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setIsLoading(true);

    try {
      let res;
      if (isActionADD) {
        res = await createTag({
          name: inputValues.name,
        });
      } else {
        res = await updateTag(id, {
          name: inputValues.name,
        });
      }

      if (res) {
        showSuccessToast(res.data.message);
        navigate("/admin/tag-blog");
      } else {
        showErrorToast(res?.data?.message || "Thao tác thất bại");
      }
    } catch (error) {
      console.error("API Error:", error);
      showErrorToast(error.response?.data?.message || "Đã xảy ra lỗi hệ thống");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {" "}
      <Wrapper>
        {isLoading ? (
          <div>Đang tải dữ liệu...</div>
        ) : (
          <div className="form">
            <h4 className="form-title">
              {isActionADD ? "Thêm mới danh mục" : "Cập nhật danh mục"}
            </h4>
            <div className="form-center">
              <FormRow
                type="text"
                name="name"
                labelText="Tên thẻ tags"
                defaultValue={inputValues.name}
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="form-center">
              <button
                type="button"
                className={`btn btn-block form-btn ${
                  isLoading ? "disabled" : ""
                }`}
                onClick={handleSaveCategoryBlog}
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Lưu"}
              </button>
            </div>
          </div>
        )}
      </Wrapper>
    </>
  );
};

export default AddTagBlog;
