import styled from "styled-components";

const JobTableWrapper = styled.section`
  border-radius: var(--border-radius);
  width: 100%;
  background: var(--background-secondary-color);
  /* padding: 3rem 2rem 4rem; */
  padding: 0 2rem 2rem 2rem;

  .package-post-container {
    overflow-x: auto; /* Cho phép cuộn ngang nếu bảng quá rộng */
    max-width: 100%;
    margin: 1rem 0 1rem 0;
  }

  .action-buttons {
    display: flex;
    gap: 10px;
  }

  .action-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #4b49ac;
    font-size: 1.2rem;
    padding: 5px;
    transition: all 0.3s ease;
  }

  .action-btn:hover {
    transform: scale(1.1);
    color: #3a38a0;
  }

  .edit-btn:hover {
    color: #2e7d32; /* Màu xanh lá */
  }

  .pause-btn:hover {
    color: #d32f2f; /* Màu đỏ */
  }

  .play-btn:hover {
    color: #2e7d32; /* Màu xanh lá */
  }

  /* Badge chung */
  .badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    transition: all 0.3s ease;
  }

  /* Màu cho gói bình thường */
  .badge-normal {
    background-color: #e0e0e0; /* Màu xám nhạt */
    color: #424242;
  }

  /* Màu cho gói nổi bật */
  .badge-featured {
    background-color: #fff8e1; /* Màu vàng nhạt */
    color: #ff8f00;
    font-weight: 600;
  }

  /* Màu cho trạng thái dừng kinh doanh */
  .badge-inactive {
    background-color: #ffebee; /* Màu đỏ nhạt */
    color: #c62828;
  }

  /* Màu cho trạng thái đang kinh doanh */
  .badge-active {
    background-color: #e8f5e9; /* Màu xanh lá nhạt */
    color: #2e7d32;
    font-weight: 600;
  }

  /* Hiệu ứng hover (tùy chọn) */
  .badge:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .title-list-job {
    font-size: 23px;
    margin-bottom: 1rem;
  }

  .title-amount {
    font-size: 16px;
  }

  table {
    width: 100%;
    border-collapse: collapse; /* Loại bỏ khoảng cách giữa các ô */
    table-layout: auto; /* Tự động điều chỉnh chiều rộng cột */
  }

  th,
  td {
    padding: 10px; /* Khoảng cách trong ô */
    text-align: left;
    white-space: nowrap; /* Ngăn nội dung xuống dòng */
    overflow: hidden; /* Ẩn nội dung tràn */
    text-overflow: ellipsis; /* Hiển thị "..." nếu nội dung quá dài */
    vertical-align: middle; /* Căn giữa theo chiều dọc */
  }

  th {
    background-color: var(--primary-500); /* Màu nền cho header */
    color: #fff;
    font-weight: normal;
  }

  td {
    background: #f8f9fa;
    color: #000;
    border-bottom: 1px solid #ddd; /* Đường viền dưới mỗi hàng */
  }

  /* Thanh cuộn ngang */
  .package-post-container::-webkit-scrollbar {
    height: 3px;
  }

  .package-post-container::-webkit-scrollbar-track {
    background: var(--grey-100);
    border-radius: 6px;
    margin: 0 5px;
  }

  .package-post-container::-webkit-scrollbar-thumb {
    background: var(--primary-500);
    border-radius: 6px;
    border: 2px solid var(--grey-100);
  }

  .package-post-container::-webkit-scrollbar-thumb:hover {
    background: var(--primary-700);
  }

  .package-post-container {
    scrollbar-width: thin;
    scrollbar-color: var(--primary-500) var(--grey-100);
  }

  /* Giới hạn chiều rộng cho các cột cụ thể */
  th:nth-child(1),
  td:nth-child(1) {
    width: 50px; /* ID */
  }
  th:nth-child(2),
  td:nth-child(2) {
    width: 100px; /* Name */
  }
  th:nth-child(3),
  td:nth-child(3) {
    min-width: 50px; /* Email */
  }
  th:nth-child(4),
  td:nth-child(4) {
    width: 120px; /* Role */
  }
  th:nth-child(5),
  td:nth-child(5) {
    width: 120px; /* Date of Birth */
  }

  .actions-custom {
    /* display: flex; */
    gap: 8px; /* Khoảng cách giữa các nút */
    align-items: center;
  }
  .actions {
    display: flex;
    gap: 8px; /* Khoảng cách giữa các nút */
    align-items: center;
  }

  .edit-btn,
  .delete-btn,
  .ban-unban-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem; /* Kích thước icon */
  }

  .edit-btn {
    color: #007bff; /* Màu xanh cho Edit */
  }
  .edit-btn:hover {
    color: #0056b3;
  }

  .delete-btn {
    color: #dc3545; /* Màu đỏ cho Delete */
  }
  .delete-btn:hover {
    color: #a71d2a;
  }

  .view-btn,
  .ban-unban-btn,
  .approve-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    transition: color 0.3s ease;
  }

  .view-btn {
    color: #007bff; /* Màu xanh cho Xem chi tiết */
  }
  .view-btn:hover {
    color: #0056b3;
  }

  .ban-unban-btn {
    color: #ff9800; /* Màu vàng cho Ban/Unban */
  }
  .ban-unban-btn:hover {
    color: #e65100;
  }

  .approve-btn {
    color: #28a745; /* Màu xanh lá cho Kiểm duyệt */
  }
  .approve-btn:hover {
    color: #218838;
  }

  .unapprove-btn {
    background-color: #ffc107; /* Màu vàng */
    color: white;
    border: none;
    width: 24px;
    height: 24px;
    padding: 4px 1px 0px 1px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
  }

  .unapprove-btn:hover {
    background-color: #e0a800; /* Màu vàng đậm khi hover */
  }

  .status-active {
    color: #ffffff;
    background-color: #28a745;
    padding: 4px 8px;
    border-radius: 12px;
    display: inline-block;
  }

  .status-inactive {
    color: #ffffff;
    background-color: #dc3545;
    padding: 4px 8px;
    border-radius: 12px;
    display: inline-block;
  }

  .status-default {
    color: #ffffff;
    background-color: #6c757d;
    padding: 4px 8px;
    border-radius: 12px;
    display: inline-block;
  }

  .status-active,
  .status-rejected,
  .status-pending,
  .status-banned,
  .status-default {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    display: inline-block;
    text-transform: capitalize;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  .status-active {
    color: #ffffff;
    background: linear-gradient(135deg, #28a745, #218838);
    border: 1px solid #218838;
  }

  .status-rejected {
    color: #ffffff;
    background: linear-gradient(135deg, #dc3545, #c82333);
    border: 1px solid #c82333;
  }

  .status-pending {
    color: #ffffff;
    background: linear-gradient(135deg, #ff9800, #e65100);
    border: 1px solid #e65100;
  }

  .status-banned {
    color: #ffffff;
    background: linear-gradient(135deg, #6c757d, #5a6268);
    border: 1px solid #5a6268;
  }

  .status-default {
    color: #ffffff;
    background: linear-gradient(135deg, #007bff, #0056b3);
    border: 1px solid #0056b3;
  }

  /* Hiệu ứng hover */
  .status-active:hover,
  .status-rejected:hover,
  .status-pending:hover,
  .status-banned:hover,
  .status-default:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  /* Hiệu ứng active */
  .status-active:active,
  .status-rejected:active,
  .status-pending:active,
  .status-banned:active,
  .status-default:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .reject-btn {
    background-color: #dc3545;
    color: white;
    width: 22px;
    height: 22px;
    border: none;
    padding: 1.3px 0px 1px 0px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    transition: background-color 0.3s ease;
  }

  .reject-btn:hover {
    background-color: #c82333; /* Màu đỏ đậm khi hover */
  }
`;

export default JobTableWrapper;
