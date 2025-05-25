import React, { useEffect, useState } from "react";
import { PAGINATION } from "../../constants/paginationConstant";
import { message } from "antd";
import { getAllBlogIT, deleteBlogIT } from "../../services/blogService";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { Input } from "antd";
import { Form, Link } from "react-router-dom";
import PageTypeJob from "../type-jobs/PageTypeJob";
import ManagePackagePostWrapper from "../../assets/wrappers/ManagePackagePostWrapper";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { showSuccessToast } from "../../utils/toastNotifications";

const ManageBlogIT = () => {
  const [dataBlogIT, setDataBlogIT] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchBlogs = async () => {
    setLoading(true);
    const params = {
      page: currentPage,
      limit: PAGINATION.pagerow,
      search: search.trim(),
    };
    console.log("Fetching with params:", params);
    try {
      const res = await getAllBlogIT(params);
      console.log("Full API response:", JSON.stringify(res, null, 2));
      if (res && res.data && res.data.data) {
        setDataBlogIT(res.data.data.blogs || []);
        setCount(res.data.data.total || 0);
        console.log(
          "Blogs:",
          res.data.data.blogs,
          "Count:",
          res.data.data.total
        );
      } else {
        setDataBlogIT([]);
        setCount(0);
        message.warning("Không nhận được dữ liệu từ server");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      message.error(
        `Lỗi khi tải danh sách bài viết: ${
          error.response?.data?.message || error.message || "Server error"
        }`
      );
      setDataBlogIT([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  const numOfPages = Math.ceil(count / PAGINATION.pagerow);

  const handleDeleteBlog = async (id) => {
    const confirm = window.confirm(
      `Bạn có chắc muốn xóa bài viết với ID ${id}?`
    );
    if (!confirm) return;

    setLoading(true);
    try {
      const res = await deleteBlogIT(id);
      console.log("Delete response:", res);
      if (res && res.data) {
        showSuccessToast(res.data.message || "Xóa bài viết thành công");
        await fetchBlogs();
      } else {
        message.warning("Không nhận được phản hồi từ server");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      message.error(
        `Lỗi khi xóa bài viết: ${
          error.response?.data?.message || error.message || "Server error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered - Page:", currentPage, "Search:", search);
    fetchBlogs();
  }, [search, currentPage]);

  const handleSearch = (value) => {
    console.log("Search value:", value);
    setSearch(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    console.log("Page changed to:", page);
    setCurrentPage(page);
  };

  // Định dạng ngày
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      <Wrapper>
        <Form className="form">
          <h5 className="form-title">Tìm kiếm bài viết</h5>
          <div className="form-center">
            <Input.Search
              onSearch={handleSearch}
              className="mt-5 mb-5"
              placeholder="Nhập tiêu đề bài viết cần tìm"
              allowClear
              enterButton="Tìm kiếm"
            />
          </div>
        </Form>
      </Wrapper>

      <ManagePackagePostWrapper>
        <h5 className="title-amount">
          Danh sách các bài viết ({count} kết quả)
        </h5>
        <div className="package-post-container">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>ID</th>
                <th>Ảnh</th>
                <th>Tiêu đề</th>
                <th>Danh mục</th>
                {/* <th>Tags</th> */}
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(dataBlogIT) && dataBlogIT.length > 0 ? (
                dataBlogIT.map((item, index) => (
                  <tr key={item.id || index}>
                    <td>
                      {index + 1 + (currentPage - 1) * PAGINATION.pagerow}
                    </td>
                    <td>{item.id || "N/A"}</td>
                    <td>
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.title || "Thumbnail"}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>{item.title || "N/A"}</td>
                    <td>{item.category?.name || "N/A"}</td>
                    {/* <td>
                      {item.tags && item.tags.length > 0 ? (
                        <div className="tag-list">
                          {item.tags.map((tag) => (
                            <span
                              style={{
                                marginLeft: "1rem",
                                padding: "2px 4px 4px",
                                background: "#1098ad",
                                borderRadius: "4px",
                              }}
                              key={tag.id}
                              className="tag-chip"
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </td> */}
                    <td>{formatDate(item.createdAt)}</td>
                    <td>{item.status?.value || "N/A"}</td>
                    <td>
                      <div className="action-buttons">
                        <Link
                          to={`/admin/blogs-it/edit/${item.id}`}
                          className="action-btn edit-btn"
                          title="Sửa"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          title="Xóa bài viết"
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteBlog(item.id)}
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Link to="/admin/blogs-it/add" className="btn add-user-btn">
          Thêm bài viết
        </Link>

        {numOfPages > 1 && (
          <PageTypeJob
            numOfPages={numOfPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        )}
      </ManagePackagePostWrapper>
    </>
  );
};

export default ManageBlogIT;
