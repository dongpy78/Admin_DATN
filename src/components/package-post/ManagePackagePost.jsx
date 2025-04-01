import React from "react";
import { useEffect, useState } from "react";
import {
  getAllPackage,
  setActiveTypePackage,
} from "../../services/userService";
import { PAGINATION } from "../../constants/paginationConstant";
import { Form, Link } from "react-router-dom";
import {
  showSuccessToast,
  showErrorToast,
} from "../../utils/toastNotifications";
import CommonUtils from "../../utils/CommonUtils";
import { Input } from "antd";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import ManagePackagePostWrapper from "../../assets/wrappers/ManagePackagePostWrapper";
import PageTypeJob from "../type-jobs/PageTypeJob";

const ManagePackagePost = () => {
  const [dataPackagePost, setDataPackagePost] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Đổi tên từ numberPage để phù hợp với PageTypeJob
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      let fetchData = async () => {
        let arrData = await getAllPackage({
          limit: PAGINATION.pagerow,
          offset: (currentPage - 1) * PAGINATION.pagerow, // Tính offset dựa trên currentPage
          search: CommonUtils.removeSpace(search),
        });
        if (arrData) {
          setDataPackagePost(arrData.data.data || arrData.data);
          setCount(arrData.count);
        }
      };
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, [search, currentPage]); // Thêm currentPage vào dependencies

  const hanndleSetActivePackage = async (event, id, isActive) => {
    event.preventDefault();
    let res = await setActiveTypePackage({
      id: id,
      isActive: isActive,
    });
    if (res && res.errCode === 0) {
      showSuccessToast(res.errMessage);
      let arrData = await getAllPackage({
        limit: PAGINATION.pagerow,
        offset: (currentPage - 1) * PAGINATION.pagerow,
        search: CommonUtils.removeSpace(search),
      });
      if (arrData) {
        setDataPackagePost(arrData.data.data || arrData.data);
        setCount(arrData.count);
      }
    } else {
      showErrorToast(res?.errMessage || "Có lỗi xảy ra");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
  };

  const numOfPages = Math.ceil(count / PAGINATION.pagerow);

  return (
    <>
      <Wrapper>
        <Form className="form">
          <h5 className="form-title">Tìm kiếm gói bài đăng </h5>
          <div className="form-center">
            <Input.Search
              onSearch={handleSearch}
              className="mt-5 mb-5"
              placeholder="Nhập tên gói bài đăng"
              allowClear
              enterButton="Tìm kiếm"
            ></Input.Search>
          </div>
        </Form>
      </Wrapper>
      <ManagePackagePostWrapper>
        <h5 className="title-amount">Danh sách gói bài đăng</h5>
        <div className="package-post-container">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên gói</th>
                <th>Giá trị</th>
                <th>Giá tiền</th>
                <th>Loại</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {dataPackagePost && dataPackagePost.length > 0 ? (
                dataPackagePost.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        {index + 1 + (currentPage - 1) * PAGINATION.pagerow}
                      </td>
                      <td>{item.name}</td>
                      <td>{item.value}</td>
                      <td>{item.price} USD</td>
                      <td>
                        {item.isHot == 0 ? "Gói bình thường" : "Gói nổi bật"}
                      </td>
                      <td>
                        {item.isActive == 0
                          ? "Dừng kinh doanh"
                          : "Đang kinh doanh"}
                      </td>
                      <td>
                        <Link
                          style={{ color: "#4B49AC" }}
                          to={`/admin/edit-package-post/${item.id}/`}
                        >
                          Sửa
                        </Link>
                        &nbsp; &nbsp;
                        {item.isActive == 1 ? (
                          <a
                            style={{ color: "#4B49AC" }}
                            href="#"
                            onClick={(event) =>
                              hanndleSetActivePackage(event, item.id, 0)
                            }
                          >
                            Dừng kinh doanh
                          </a>
                        ) : (
                          <a
                            style={{ color: "#4B49AC" }}
                            href="#"
                            onClick={(event) =>
                              hanndleSetActivePackage(event, item.id, 1)
                            }
                          >
                            Mở kinh doanh
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })
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

export default ManagePackagePost;
