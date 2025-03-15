import React, { useContext } from "react";
import {
  FaEye,
  FaLock,
  FaUnlock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import JobTableWrapper from "../../assets/wrappers/JobTableWrapper";
import { Link } from "react-router-dom";
import axiosInstance from "../../libs/axiosInterceptor";
import {
  showSuccessToast,
  showErrorToast,
} from "../../utils/toastNotifications";
import { GlobalContext } from "../../contexts/GlobalProviders"; // Import context

const TableCompany = ({
  typeCompany,
  setTypeCompany,
  currentPage = 1,
  totalCount = 0,
}) => {
  const { openRejectModal } = useContext(GlobalContext); // Lấy hàm mở modal từ context

  if (!typeCompany || typeCompany.length === 0) {
    return (
      <JobTableWrapper>
        <h5>Không có công ty nào để hiển thị...</h5>
      </JobTableWrapper>
    );
  }

  const itemsPerPage = 5;

  // Hàm xử lý xem chi tiết
  const handleView = (id) => {
    console.log("Xem chi tiết công ty với ID:", id);
  };

  // Hàm xử lý ban/unban
  const handleBanUnban = async (id, currentStatus) => {
    if (
      window.confirm(
        currentStatus === "Đã kích hoạt"
          ? "Bạn có chắc muốn cấm công ty này?"
          : "Bạn có chắc muốn kích hoạt lại công ty này?"
      )
    ) {
      try {
        const apiUrl =
          currentStatus === "Đã kích hoạt" ? "/ban-company" : "/unban-company";
        const response = await axiosInstance.post(apiUrl, { id });
        if (response.status === 200) {
          showSuccessToast(
            currentStatus === "Đã kích hoạt"
              ? "Công ty đã bị cấm thành công"
              : "Công ty đã được kích hoạt lại thành công"
          );
          // Làm mới danh sách
          const refreshResponse = await axiosInstance.get(
            `/admin/companies?limit=5&offset=${(currentPage - 1) * 5}`
          );
          setTypeCompany(refreshResponse.data.data.rows || []);
        }
      } catch (error) {
        console.error("Lỗi khi thay đổi trạng thái:", error);
        showErrorToast("Có lỗi xảy ra khi thay đổi trạng thái công ty.");
      }
    }
  };

  // Hàm xử lý kiểm duyệt
  const handleApproveCensor = async (id, currentCensor) => {
    const isPending = currentCensor === "Đang chờ kiểm duyệt";
    const isAccepted = currentCensor === "Đã kiểm duyệt";
    if (
      window.confirm(
        isAccepted
          ? "Công ty đã được kiểm duyệt, bạn vẫn muốn tiếp tục?"
          : isPending
          ? "Bạn có chắc muốn kiểm duyệt công ty này?"
          : "Bạn có chắc muốn kiểm duyệt công ty này?"
      )
    ) {
      try {
        const apiUrl = "/accept-company";
        const response = await axiosInstance.post(apiUrl, {
          companyId: id,
          note: "null",
        });
        console.log(response);
        if (response.status === 200) {
          showSuccessToast("Công ty đã được kiểm duyệt thành công");
          // Làm mới danh sách
          const refreshResponse = await axiosInstance.get(
            `/admin/companies?limit=5&offset=${(currentPage - 1) * 5}`
          );
          setTypeCompany(refreshResponse.data.data.rows || []);
        }
      } catch (error) {
        console.error("Lỗi khi kiểm duyệt:", error);
        showErrorToast("Có lỗi xảy ra khi kiểm duyệt công ty.");
      }
    }
  };

  // Hàm xử lý chưa kiểm duyệt
  const handleUnapproveCensor = async (id, currentCensor) => {
    const isUnapproved = currentCensor === "Chưa kiểm duyệt";

    const confirmMessage = isUnapproved
      ? "Công ty đã ở trạng thái chưa kiểm duyệt, bạn vẫn muốn tiếp tục?"
      : "Bạn có chắc muốn chuyển công ty này sang trạng thái chưa kiểm duyệt?";

    if (window.confirm(confirmMessage)) {
      openRejectModal((reason) => {
        // Xử lý lý do chưa kiểm duyệt
        try {
          const apiUrl = "/accept-company"; // Hoặc API riêng cho chưa kiểm duyệt
          const payload = {
            companyId: id,
            statusCode: "CS2", // Trạng thái "Chưa kiểm duyệt"
            note: reason, // Sử dụng lý do từ modal
            userId: "13", // ID người dùng
          };

          axiosInstance.post(apiUrl, payload).then((response) => {
            if (response.status === 200) {
              showSuccessToast(
                "Công ty đã được chuyển sang trạng thái chưa kiểm duyệt thành công"
              );
              // Làm mới danh sách
              axiosInstance
                .get(`/admin/companies?limit=5&offset=${(currentPage - 1) * 5}`)
                .then((refreshResponse) => {
                  setTypeCompany(refreshResponse.data.data.rows || []);
                });
            }
          });
        } catch (error) {
          console.error("Lỗi khi chưa kiểm duyệt:", error);
          showErrorToast("Có lỗi xảy ra khi chưa kiểm duyệt công ty.");
        }
      });
    }
  };

  return (
    <JobTableWrapper>
      <h5 className="title-list-job">Danh sách công ty</h5>
      <h5 className="title-amount">Tổng số lượng: {totalCount}</h5>
      <div className="jobtype-container">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã công ty</th>
              <th>Tên công ty</th>
              <th>Số điện thoại</th>
              <th>Mã số thuế</th>
              <th>Trạng thái</th>
              <th>Kiểm duyệt</th>
              <th>Ngày khởi tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {typeCompany.map((company, index) => (
              <tr key={company.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{company.id}</td>
                <td>{company.name}</td>
                <td>{company.phonenumber}</td>
                <td>{company.taxnumber}</td>
                <td>
                  <span
                    className={
                      company.statusCompanyData?.value === "Đã kích hoạt"
                        ? "status-active"
                        : company.statusCompanyData?.value === "Chưa kích hoạt"
                        ? "status-inactive"
                        : "status-default"
                    }
                  >
                    {company.statusCompanyData?.value || "Chưa xác định"}
                  </span>
                </td>
                <td>
                  <span
                    className={
                      company.censorData?.value === "Đã kiểm duyệt"
                        ? "status-active"
                        : company.censorData?.value === "Chưa kiểm duyệt" ||
                          company.censorData?.value === "Đang chờ kiểm duyệt"
                        ? "status-inactive"
                        : "status-default"
                    }
                  >
                    {company.censorData?.value || "Chưa xác định"}
                  </span>
                </td>
                <td>
                  {new Date(company.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </td>
                <td className="actions">
                  <Link
                    title="Xem chi tiết"
                    to={`/admin/company/detail/${company.id}`}
                    className="view-btn"
                  >
                    <FaEye />
                  </Link>
                  <button
                    className="ban-unban-btn"
                    onClick={() =>
                      handleBanUnban(
                        company.id,
                        company.statusCompanyData?.value
                      )
                    }
                    title={
                      company.statusCompanyData?.value === "Đã kích hoạt"
                        ? "Cấm công ty"
                        : "Kích hoạt lại công ty"
                    }
                  >
                    {company.statusCompanyData?.value === "Đã kích hoạt" ? (
                      <FaLock />
                    ) : (
                      <FaUnlock />
                    )}
                  </button>
                  <button
                    className="approve-btn"
                    onClick={() =>
                      handleApproveCensor(company.id, company.censorData?.value)
                    }
                    title={
                      company.censorData?.value === "Đã kiểm duyệt"
                        ? "Đã kiểm duyệt"
                        : "Kiểm duyệt công ty"
                    }
                  >
                    <FaCheckCircle />
                  </button>
                  <button
                    style={{ position: "relative", top: "-2px" }}
                    className="unapprove-btn"
                    onClick={() =>
                      handleUnapproveCensor(
                        company.id,
                        company.censorData?.value
                      )
                    }
                    title={
                      company.censorData?.value === "Chưa kiểm duyệt"
                        ? "Chưa kiểm duyệt"
                        : "Chưa kiểm duyệt công ty"
                    }
                  >
                    <FaTimesCircle />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </JobTableWrapper>
  );
};

export default TableCompany;
