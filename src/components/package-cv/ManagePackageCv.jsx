import React from "react";
import { useEffect, useState } from "react";
import {
  getAllPackageCv,
  setActiveTypePackageCv,
} from "../../services/cvService";
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
import { FaEdit, FaPauseCircle, FaPlayCircle } from "react-icons/fa";

const ManagePackageCv = () => {
  const [dataPackageCv, setDataPackageCv] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      let fetchData = async () => {
        let arrData = await getAllPackageCv({
          limit: PAGINATION.pagerow,
          offset: (currentPage - 1) * PAGINATION.pagerow,
          search: CommonUtils.removeSpace(search),
        });
        console.log("API response:", arrData);
        if (arrData) {
          setDataPackageCv(arrData.data.data || arrData.data);
          setCount(arrData.data.total || 0);
        }
      };
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, [search, currentPage]);

  const numOfPages = Math.ceil(count / PAGINATION.pagerow);

  const hanndleSetActivePackage = async (event, id, isActive) => {
    event.preventDefault();
    let res = await setActiveTypePackageCv({
      id: id,
      isActive: isActive,
    });
    if (res) {
      console.log("Hello", res);
      showSuccessToast(res.data.errMessage);
      let arrData = await getAllPackageCv({
        limit: PAGINATION.pagerow,
        offset: (currentPage - 1) * PAGINATION.pagerow,
        search: CommonUtils.removeSpace(search),
      });
      if (arrData) {
        setDataPackageCv(arrData.data.data || arrData.data);
        setCount(arrData.data.total);
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
    setCurrentPage(1);
  };

  return (
    <>
      <Wrapper>
        <Form className="form">
          <h5 className="form-title">Tìm kiếm gói ứng viên </h5>
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
        <h5 className="title-amount">Danh sách gói tìm ứng viên</h5>
        <div className="package-post-container">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên gói</th>
                <th>Giá trị</th>
                <th>Giá tiền</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {dataPackageCv && dataPackageCv.length > 0 ? (
                dataPackageCv.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        {index + 1 + (currentPage - 1) * PAGINATION.pagerow}
                      </td>
                      <td>{item.name}</td>
                      <td>{item.value}</td>
                      <td>{item.price} USD</td>

                      <td>
                        <span
                          className={`badge ${
                            item.isActive == 0
                              ? "badge-inactive"
                              : "badge-active"
                          }`}
                        >
                          {item.isActive == 0
                            ? "Dừng kinh doanh"
                            : "Đang kinh doanh"}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link
                            to={`/admin/package-post/edit/${item.id}/`}
                            className="action-btn edit-btn"
                            title="Sửa"
                          >
                            <FaEdit />
                          </Link>
                          {item.isActive == 1 ? (
                            <button
                              className="action-btn pause-btn"
                              onClick={(event) =>
                                hanndleSetActivePackage(event, item.id, 0)
                              }
                              title="Dừng kinh doanh"
                            >
                              <FaPauseCircle />
                            </button>
                          ) : (
                            <button
                              className="action-btn play-btn"
                              onClick={(event) =>
                                hanndleSetActivePackage(event, item.id, 1)
                              }
                              title="Mở kinh doanh"
                            >
                              <FaPlayCircle />
                            </button>
                          )}
                        </div>
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

        <Link to="/admin/package-post/add" className="btn add-user-btn">
          Add Package Post
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

export default ManagePackageCv;
