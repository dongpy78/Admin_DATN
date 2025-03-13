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
import { GlobalContext } from "../../contexts/GlobalProviders";

const TablePost = ({
  typePost,
  setTypePost,
  currentPage = 1,
  totalCount = 0,
}) => {
  const { openRejectModal } = useContext(GlobalContext);

  // Hàm xử lý từ chối kiểm duyệt
  const handleRejectCensor = async (id, currentCensor) => {
    const isRejected = currentCensor === "Đã bị từ chối";

    const confirmMessage = isRejected
      ? "Bài đăng đã bị từ chối, bạn vẫn muốn tiếp tục?"
      : "Bạn có chắc muốn từ chối kiểm duyệt bài đăng này?";

    if (window.confirm(confirmMessage)) {
      openRejectModal((reason) => {
        // Xử lý lý do từ chối
        try {
          const apiUrl = "/posts/accept"; // Hoặc "/posts/reject" nếu có API riêng
          const payload = {
            id,
            statusCode: "PS2", // Trạng thái "Đã bị từ chối"
            userId: "13", // ID người dùng
            note: reason, // Sử dụng lý do từ chối
          };

          axiosInstance.post(apiUrl, payload).then((response) => {
            if (response.status === 200) {
              showSuccessToast("Bài đăng đã bị từ chối thành công");
              // Làm mới danh sách
              axiosInstance
                .get(`/posts/all-posts?limit=5&offset=${(currentPage - 1) * 5}`)
                .then((refreshResponse) => {
                  setTypePost(refreshResponse.data.data.rows || []);
                });
            }
          });
        } catch (error) {
          console.error("Lỗi khi từ chối kiểm duyệt:", error);
          showErrorToast("Có lỗi xảy ra khi từ chối kiểm duyệt bài đăng.");
        }
      });
    }
  };

  if (!typePost || typePost.length === 0) {
    return (
      <JobTableWrapper>
        <h5>Không có bài đăng nào để hiển thị...</h5>
      </JobTableWrapper>
    );
  }

  const itemsPerPage = 5;

  // Hàm xử lý xem chi tiết
  const handleView = (id) => {
    console.log("Xem chi tiết bài đăng với ID:", id);
  };

  // Hàm xử lý chặn/bỏ chặn bài đăng
  const handleBanUnban = async (id, currentStatus) => {
    const isBanned = currentStatus === "Đã bị chặn";
    const confirmMessage = isBanned
      ? "Bạn có chắc muốn kích hoạt lại bài đăng này?"
      : "Bạn có chắc muốn chặn bài đăng này?";

    if (window.confirm(confirmMessage)) {
      try {
        const apiUrl = isBanned ? "/posts/active" : "/posts/ban";
        const payload = isBanned
          ? { id, userId: "13", note: "Restored for review" } // Dữ liệu cho active-post
          : { postId: id, userId: "13", note: "Spam content" }; // Dữ liệu cho ban-post

        const response = await axiosInstance.post(apiUrl, payload);

        if (response.status === 200) {
          showSuccessToast(
            isBanned
              ? "Bài đăng đã được kích hoạt lại thành công"
              : "Bài đăng đã bị chặn thành công"
          );
          // Làm mới danh sách
          const refreshResponse = await axiosInstance.get(
            `/posts/all-posts?limit=5&offset=${(currentPage - 1) * 5}`
          );
          setTypePost(refreshResponse.data.data.rows || []);
        }
      } catch (error) {
        console.error("Lỗi khi thay đổi trạng thái:", error);
        showErrorToast("Có lỗi xảy ra khi thay đổi trạng thái bài đăng.");
      }
    }
  };

  // Hàm xử lý duyệt bài đăng
  const handleApproveCensor = async (id, currentCensor) => {
    const isPending = currentCensor === "Chờ kiểm duyệt";
    const isAccepted = currentCensor === "Đã kiểm duyệt";

    const confirmMessage = isAccepted
      ? "Bài đăng đã được duyệt, bạn vẫn muốn tiếp tục?"
      : "Bạn có chắc muốn duyệt bài đăng này?";

    if (window.confirm(confirmMessage)) {
      try {
        const apiUrl = "/posts/accept";
        const payload = {
          id,
          statusCode: "PS1", // Trạng thái "Đã kiểm duyệt"
          userId: "13", // ID người dùng
          note: "Approved", // Ghi chú
        };

        const response = await axiosInstance.post(apiUrl, payload);

        if (response.status === 200) {
          showSuccessToast("Bài đăng đã được duyệt thành công");
          // Làm mới danh sách
          const refreshResponse = await axiosInstance.get(
            `/posts/all-posts?limit=5&offset=${(currentPage - 1) * 5}`
          );
          setTypePost(refreshResponse.data.data.rows || []);
        }
      } catch (error) {
        console.error("Lỗi khi kiểm duyệt:", error);
        showErrorToast("Có lỗi xảy ra khi kiểm duyệt bài đăng.");
      }
    }
  };

  return (
    <JobTableWrapper>
      <h5 className="title-list-job">Danh sách bài đăng</h5>
      <h5 className="title-amount">Tổng số lượng: {totalCount}</h5>
      <div className="jobtype-container">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã bài đăng</th>
              <th>Tên bài đăng</th>
              <th>Tên công ty</th>
              <th>Tên người đăng</th>
              <th>Ngày kết thúc</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {typePost.map((post, index) => (
              <tr key={post.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{post.id}</td>
                <td>{post.postDetailData?.name || "N/A"}</td>
                <td>{post.userPostData?.userCompanyData?.name || "N/A"}</td>
                <td>{`${post.userPostData?.firstName || ""} ${
                  post.userPostData?.lastName || ""
                }`}</td>
                <td>{new Date(post.timeEnd).toLocaleDateString()}</td>
                <td>
                  <span
                    className={
                      post.statusPostData?.value === "Đã kiểm duyệt"
                        ? "status-active"
                        : post.statusPostData?.value === "Đã bị từ chối"
                        ? "status-rejected"
                        : post.statusPostData?.value === "Chờ kiểm duyệt"
                        ? "status-pending"
                        : post.statusPostData?.value === "Đã bị chặn"
                        ? "status-banned"
                        : "status-default"
                    }
                  >
                    {post.statusPostData?.value || "Chưa xác định"}
                  </span>
                </td>
                <td className="actions">
                  <Link
                    title="Xem chi tiết"
                    to={`/posts/detail/${post.id}`}
                    className="view-btn"
                  >
                    <FaEye />
                  </Link>
                  <button
                    className="ban-unban-btn"
                    onClick={() =>
                      handleBanUnban(post.id, post.statusPostData?.value)
                    }
                    title={
                      post.statusPostData?.value === "Đã bị chặn"
                        ? "Kích hoạt lại bài đăng"
                        : "Chặn bài đăng"
                    }
                  >
                    {post.statusPostData?.value === "Đã bị chặn" ? (
                      <FaUnlock />
                    ) : (
                      <FaLock />
                    )}
                  </button>
                  <button
                    className="approve-btn"
                    onClick={() =>
                      handleApproveCensor(post.id, post.statusPostData?.value)
                    }
                    title={
                      post.statusPostData?.value === "Đã kiểm duyệt"
                        ? "Đã kiểm duyệt"
                        : "Duyệt bài đăng"
                    }
                  >
                    <FaCheckCircle />
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() =>
                      handleRejectCensor(post.id, post.statusPostData?.value)
                    }
                    title={
                      post.statusPostData?.value === "Đã bị từ chối"
                        ? "Đã bị từ chối"
                        : "Từ chối kiểm duyệt"
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

export default TablePost;
