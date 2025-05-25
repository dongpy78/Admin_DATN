import React, { useEffect, useState } from "react";
import { PAGINATION } from "../../constants/paginationConstant";
import { message } from "antd";
import { getAllTags, deleteTag } from "../../services/blogService";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { Input } from "antd";
import { Form, Link } from "react-router-dom";
import PageTypeJob from "../type-jobs/PageTypeJob";
import ManagePackagePostWrapper from "../../assets/wrappers/ManagePackagePostWrapper";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { showSuccessToast } from "../../utils/toastNotifications";
const ManageTagBlogs = () => {
  const [dataTag, setDataTag] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const numOfPages = Math.ceil(count / PAGINATION.pagerow);

  const fetchCategories = async () => {
    setLoading(true);
    const params = {
      page: currentPage,
      limit: PAGINATION.pagerow,
      search: search.trim(),
    };
    console.log("Fetching with params:", params);
    try {
      const res = await getAllTags(params);
      console.log("Full API response:", JSON.stringify(res, null, 2));
      if (res && res.data && res.data.data) {
        setDataTag(res.data.data.tags || []);
        setCount(res.data.data.total || 0);
        console.log("Tags:", res.data.data.tags, "Count:", res.data.data.total);
      } else {
        setDataTag([]);
        setCount(0);
        message.warning("Không nhận được dữ liệu từ server");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error(
        `Lỗi khi tải danh sách danh mục: ${
          error.response?.data?.message || error.message || "Server error"
        }`
      );
      setDataTag([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (id) => {
    // Hiển thị xác nhận trước khi xóa
    const confirm = window.confirm(
      `Bạn có chắc muốn xóa danh mục với ID ${id}?`
    );
    if (!confirm) return;

    setLoading(true);
    try {
      const res = await deleteTag(id);
      console.log("Delete response:", res);
      if (res && res.data) {
        showSuccessToast(res.data.message || "Xóa thẻ danh mục thành công");
        // Làm mới danh sách
        await fetchCategories();
      } else {
        message.warning("Không nhận được phản hồi từ server");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      message.error(
        `Lỗi khi xóa danh mục: ${
          error.response?.data?.message || error.message || "Server error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered - Page:", currentPage, "Search:", search);
    fetchCategories();
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

  return (
    <>
      <Wrapper>
        <Form className="form">
          <h5 className="form-title">Tìm kiếm từ khóa</h5>
          <div className="form-center">
            <Input.Search
              onSearch={handleSearch}
              className="mt-5 mb-5"
              placeholder="Nhập tên danh mục cần tìm"
              allowClear
              enterButton="Tìm kiếm"
            />
          </div>
        </Form>
      </Wrapper>
      <ManagePackagePostWrapper>
        <h5 className="title-amount">
          Danh sách các thẻ tags ({count} kết quả)
        </h5>
        <div className="package-post-container">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>ID</th>
                <th>Tên</th>
                <th>UserId</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(dataTag) && dataTag.length > 0 ? (
                dataTag.map((item, index) => (
                  <tr key={item.id || index}>
                    <td>
                      {index + 1 + (currentPage - 1) * PAGINATION.pagerow}
                    </td>
                    <td>{item.id || "N/A"}</td>
                    <td>{item.name || "N/A"}</td>
                    <td>{item.userId || "N/A"}</td>
                    <td>
                      <div className="action-buttons">
                        <Link
                          to={`/admin/tag-blog/edit/${item.id}`}
                          className="action-btn edit-btn"
                          title="Sửa"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          title="Xóa danh mục"
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
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    {loading
                      ? "Đang tải..."
                      : search
                      ? `Không tìm thấy danh mục với từ khóa "${search}"`
                      : currentPage > 1
                      ? "Không có dữ liệu ở trang này"
                      : "Không có dữ liệu"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Link to="/admin/tag-blog/add" className="btn add-user-btn">
          Thêm danh mục
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

export default ManageTagBlogs;
