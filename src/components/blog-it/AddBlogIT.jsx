import React, { useEffect, useState } from "react";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import {
  getBlogITById,
  createBlogIT,
  updateBlogIT,
  getAllCategoryBlog,
  getAllTags,
} from "../../services/blogService";
import FormRow from "../layout-dashboard/FormRow";
import { Form, useNavigate, useParams } from "react-router-dom";
import {
  showSuccessToast,
  showErrorToast,
} from "../../utils/toastNotifications";
import MDEditor from "@uiw/react-md-editor";
import { marked } from "marked";
import axiosInstance from "../../libs/axiosInterceptor";
import Select from "react-select"; // Thêm react-select

const AddBlogIT = () => {
  const [isActionADD, setIsActionADD] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    title: "",
    contentHTML: "",
    contentMarkDown: "",
    thumbnail: "",
    categoryId: "",
    statusCode: "DRAFT",
    tags: [],
  });
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  // Lấy danh mục và tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await getAllCategoryBlog();
        if (categoryRes.data && categoryRes.data.data) {
          setCategories(categoryRes.data.data.categories || []);
        } else {
          setCategories([]);
          showErrorToast("Không lấy được danh mục");
        }

        const tagsRes = await getAllTags();
        console.log("Log Get All Tag: ", tagsRes.data);
        if (tagsRes.data && Array.isArray(tagsRes.data.data.tags)) {
          setTags(tagsRes.data.data.tags);
        } else {
          setTags([]);
          showErrorToast("Dữ liệu tags không hợp lệ");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setCategories([]);
        setTags([]);
        showErrorToast("Lỗi khi tải danh mục hoặc tags");
      }
    };
    fetchData();
  }, []);

  // Lấy dữ liệu bài viết khi chỉnh sửa
  useEffect(() => {
    const fetchBlogData = async () => {
      if (id) {
        setIsActionADD(false);
        setIsLoading(true);
        try {
          const res = await getBlogITById(id);
          console.log("API response:", res);
          if (res.data && res.data.data) {
            const blog = res.data.data;
            setFormValues({
              title: blog.title || "",
              contentHTML: blog.contentHTML || "",
              contentMarkDown: blog.contentMarkDown || "",
              thumbnail:
                typeof blog.thumbnail === "string" ? blog.thumbnail : "",
              categoryId: blog.categoryId || "",
              statusCode: blog.statusCode || "DRAFT",
              tags: blog.tags ? blog.tags.map((tag) => tag.id) : [],
            });
            setThumbnailPreview(blog.thumbnail || "");
            console.log("FormValues sau khi set:", blog);
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
    fetchBlogData();
  }, [id]);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [thumbnailPreview]);

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    console.log("HandleOnChange:", name, value);
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (selectedOptions) => {
    const selectedTags = selectedOptions.map((option) =>
      parseInt(option.value)
    );
    setFormValues((prev) => ({ ...prev, tags: selectedTags }));
  };

  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axiosInstance.post(
        "/media/upload/single",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.data && response.data.url) {
        return response.data.url;
      } else {
        throw new Error("Không thể upload ảnh");
      }
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      throw error;
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showErrorToast("Vui lòng chọn file ảnh");
      return;
    }

    try {
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
      setThumbnailFile(file);

      const imageUrl = await uploadImage(file);
      setFormValues((prev) => ({
        ...prev,
        thumbnail: imageUrl,
      }));
      setThumbnailPreview(imageUrl);
      console.log("Uploaded thumbnail URL:", imageUrl);
    } catch (error) {
      showErrorToast("Không thể upload ảnh");
    }
  };

  const handleMarkdownChange = (value) => {
    setFormValues((prev) => ({
      ...prev,
      contentMarkDown: value || "",
      contentHTML: marked(value || ""),
    }));
  };

  const handleSaveBlog = async () => {
    console.log("FormValues trước khi gửi:", formValues);
    console.log("ThumbnailFile:", thumbnailFile);
    if (
      !formValues.title ||
      !formValues.contentMarkDown ||
      !formValues.categoryId ||
      !formValues.statusCode
    ) {
      showErrorToast("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    if (!formValues.tags.length) {
      showErrorToast("Vui lòng chọn ít nhất một tag");
      return;
    }

    const userStorage = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token") || userStorage.token;

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", formValues.title);
      formData.append("contentHTML", formValues.contentHTML);
      formData.append("contentMarkDown", formValues.contentMarkDown);
      formData.append("categoryId", parseInt(formValues.categoryId));
      formData.append("statusCode", formValues.statusCode);
      formValues.tags.forEach((tagId) => formData.append("tags[]", tagId));
      if (formValues.thumbnail) {
        formData.append("thumbnail", formValues.thumbnail);
      }

      for (let [key, value] of formData.entries()) {
        console.log(`FormData ${key}:`, value);
      }

      let res;
      if (isActionADD) {
        res = await createBlogIT(formData);
      } else {
        res = await updateBlogIT(id, formData);
      }

      if (res && res.data) {
        showSuccessToast(res.data.message);
        navigate("/admin/blogs-it");
      } else {
        showErrorToast(res?.data?.message || "Thao tác thất bại");
      }
    } catch (error) {
      console.error("API Error:", error);
      console.log("Error response:", error.response?.data);
      showErrorToast(error.response?.data?.message || "Đã xảy ra lỗi hệ thống");
    } finally {
      setIsLoading(false);
    }
  };

  // Chuyển đổi tags thành định dạng react-select
  const tagOptions = tags.map((tag) => ({
    value: tag.id.toString(),
    label: tag.name,
  }));

  return (
    <Wrapper>
      {isLoading ? (
        <div>Đang tải dữ liệu...</div>
      ) : (
        <div className="form">
          <h4 className="form-title">
            {isActionADD ? "Thêm mới bài viết" : "Cập nhật bài viết"}
          </h4>
          <div className="form-center">
            <FormRow
              type="text"
              name="title"
              labelText="Tiêu đề bài viết"
              defaultValue={formValues.title}
              onChange={handleOnChange}
              required
            />

            <div className="form-row">
              <label className="form-label">Danh mục bài viết</label>
              <select
                className="form-select"
                name="categoryId"
                value={formValues.categoryId}
                onChange={handleOnChange}
                required
              >
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label className="form-label">Trạng thái bài viết</label>
              <select
                className="form-select"
                name="statusCode"
                value={formValues.statusCode}
                onChange={handleOnChange}
                required
              >
                <option value="DRAFT">Bản thảo</option>
                <option value="PUBLISHED">Đăng tải</option>
              </select>
            </div>

            <div className="form-row">
              <label className="form-label">Chọn thẻ tags bài viết</label>
              <Select
                isMulti
                name="tags"
                options={tagOptions}
                value={tagOptions.filter((option) =>
                  formValues.tags.includes(parseInt(option.value))
                )}
                onChange={handleTagChange}
                placeholder="Chọn tags..."
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    padding: "0.5rem",
                    borderRadius: "8px",
                    borderColor: "#ccc",
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: "#e0e7ff",
                    borderRadius: "4px",
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: "#1e3a8a",
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: "#1e3a8a",
                    ":hover": {
                      backgroundColor: "#c7d2fe",
                      color: "#1e40af",
                    },
                  }),
                }}
              />
            </div>

            <div className="form-row form-select-image">
              <label htmlFor="thumbnail" className="form-label">
                Ảnh bài viết (max 0.5MB)
              </label>
              {thumbnailPreview && (
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  style={{ maxWidth: "100px", marginBottom: "10px" }}
                />
              )}
              <input
                type="file"
                id="thumbnail"
                name="thumbnail"
                className="form-input"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div data-color-mode="light" style={{ marginTop: "2rem" }}>
            <label htmlFor="contentMarkDown" className="form-label">
              Nội dung (Markdown)
            </label>
            <MDEditor
              value={formValues.contentMarkDown}
              onChange={handleMarkdownChange}
              height={500}
              preview="live"
            />
            <input
              type="hidden"
              name="contentMarkDown"
              value={formValues.contentMarkDown}
            />
            <input
              type="hidden"
              name="contentHTML"
              value={formValues.contentHTML}
            />
          </div>

          <div className="form-center">
            <button
              type="button"
              className={`btn btn-block form-btn ${
                isLoading ? "disabled" : ""
              }`}
              onClick={handleSaveBlog}
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Lưu"}
            </button>
          </div>
        </div>
      )}
    </Wrapper>
  );
};

export default AddBlogIT;
