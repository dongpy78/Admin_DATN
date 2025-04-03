import React from "react";
import { Form, Link, useParams } from "react-router-dom";
import FormRow from "../layout-dashboard/FormRow";
import { showErrorToast } from "../../utils/toastNotifications";
import { useState, useEffect } from "react";
import JobTableWrapper from "../../assets/wrappers/JobTableWrapper";
import MDEditor from "@uiw/react-md-editor";

import Wrapper from "../../assets/wrappers/DashboardFormPage";
import axiosInstance from "../../libs/axiosInterceptor";

const DetailPost = () => {
  const { id } = useParams();
  const [postCompany, setPostCompany] = useState(null); // Đặt giá trị ban đầu là null để kiểm tra dễ hơn
  const [loading, setLoading] = useState(true);

  // Gọi API để lấy thông tin chi tiết công ty
  useEffect(() => {
    const fetchCompanyDetail = async () => {
      try {
        const response = await axiosInstance.get(`/posts/detail?id=${id}`);
        if (response.status === 200) {
          setPostCompany(response.data.data);
          console.log("Post detail data:", response.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin công ty:", error);
        showErrorToast("Không thể tải thông tin công ty.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetail();
  }, [id]);

  if (loading) {
    return <Wrapper>Đang tải...</Wrapper>;
  }

  if (!postCompany) {
    return <Wrapper>Không tìm thấy bài viết.</Wrapper>;
  }

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h5 className="form-title">Xem thông tin bài đăng</h5>
        <div className="form-center">
          {/* Các trường text */}
          <FormRow
            type="text"
            name="name"
            labelText="Tên bài đăng"
            defaultValue={postCompany.postDetailData.name}
            disabled
          />
          <FormRow
            type="text"
            name="address"
            labelText="Địa chỉ"
            defaultValue={postCompany.companyData.address}
            disabled
          />
          <FormRow
            type="text"
            name="amountEmployer"
            labelText="Số lượng nhân viên"
            defaultValue={postCompany.companyData.amountEmployer}
            disabled
          />
          <FormRow
            type="text"
            name="timeEndDate"
            labelText="Thời gian kết thúc"
            defaultValue={new Date(postCompany.timeEnd).toLocaleDateString(
              "vi-VN",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }
            )}
            disabled
          />
          <FormRow
            type="text"
            name="male"
            labelText="Giới tính"
            defaultValue={postCompany.postDetailData.genderPostData.value}
            disabled
          />
          <FormRow
            type="text"
            name="exp"
            labelText="Kinh nghiệm"
            defaultValue={postCompany.postDetailData.expTypePostData.value}
            disabled
          />
          <FormRow
            type="text"
            name="categoryJobCode "
            labelText="Ngành"
            defaultValue={postCompany.postDetailData.jobTypePostData.value}
            disabled
          />
          <FormRow
            type="text"
            name="categoryJoblevelCode "
            labelText="Chức vụ"
            defaultValue={postCompany.postDetailData.jobLevelPostData.value}
            disabled
          />
          <FormRow
            type="text"
            name="salaryJobCode  "
            labelText="Lương"
            defaultValue={postCompany.postDetailData.salaryTypePostData.value}
            disabled
          />
          <FormRow
            type="text"
            name="categoryWorktypeCode  "
            labelText="Hình thức làm việc"
            defaultValue={postCompany.postDetailData.workTypePostData.value}
            disabled
          />
        </div>

        <div data-color-mode="light" style={{ marginTop: "16px" }}>
          <label htmlFor="descriptionMarkdown" className="form-label">
            Mô tả (Markdown)
          </label>
          <MDEditor
            value={postCompany.postDetailData.descriptionMarkdown}
            height={300}
            preview="live"
          />
          <input
            type="hidden"
            name="descriptionMarkdown"
            value={postCompany.postDetailData.descriptionMarkdown}
            disabled
          />
          <input
            type="hidden"
            name="descriptionHTML"
            value={postCompany.companyData.descriptionHTML}
            disabled
          />
        </div>

        <div className="form-center">
          <Link to="/admin/post" className="btn form-btn">
            Quay lại
          </Link>
        </div>
      </Form>
    </Wrapper>
  );
};

export default DetailPost;
