import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { Form, Link, useParams } from "react-router-dom";
import FormRow from "../layout-dashboard/FormRow";
import axiosInstance from "../../libs/axiosInterceptor";
import { showErrorToast } from "../../utils/toastNotifications";
import { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import JobTableWrapper from "../../assets/wrappers/JobTableWrapper";
import { FaDownload } from "react-icons/fa"; // Biểu tượng tải xuống

const DetailCompany = () => {
  const { id } = useParams(); // Lấy ID công ty từ URL
  const [company, setCompany] = useState(null); // Đặt giá trị ban đầu là null để kiểm tra dễ hơn
  const [loading, setLoading] = useState(true);

  // Gọi API để lấy thông tin chi tiết công ty
  useEffect(() => {
    const fetchCompanyDetail = async () => {
      try {
        const response = await axiosInstance.get(`/companies/by-id?id=${id}`);
        if (response.status === 200) {
          setCompany(response.data.data);
          console.log("Company data:", response.data.data);
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
    return <JobTableWrapper>Đang tải...</JobTableWrapper>;
  }

  if (!company) {
    return <JobTableWrapper>Không tìm thấy công ty.</JobTableWrapper>;
  }

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h5 className="form-title">Xem thông tin công ty</h5>
        <div className="form-center">
          {/* Các trường text */}
          <FormRow
            type="text"
            name="name"
            labelText="Tên"
            defaultValue={company.name}
            disabled
          />
          <FormRow
            type="text"
            name="phonenumber"
            labelText="Số điện thoại"
            defaultValue={company.phonenumber}
            disabled
          />
          <FormRow
            type="text"
            name="taxnumber"
            labelText="Mã số thuế"
            defaultValue={company.taxnumber}
            disabled
          />
          <FormRow
            type="text"
            name="amountEmployer"
            labelText="Số lượng nhân viên"
            defaultValue={company.amountEmployer}
            disabled
          />
          <FormRow
            type="text"
            name="address"
            labelText="Địa chỉ"
            defaultValue={company.address}
            disabled
          />
          <FormRow
            type="text"
            name="website"
            labelText="Link Website"
            defaultValue={company.website}
            disabled
          />
        </div>
        {/* Hiển thị hình ảnh */}
        <div className="form-center" style={{ marginTop: "1rem" }}>
          <div className="form-row">
            <label className="form-label">Ảnh bìa</label>
            {company.coverimage ? (
              <img
                src={company.coverimage}
                alt="Ảnh bìa"
                className="company-image"
                style={{ width: "300px", height: "200px" }}
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/150?text=Không+tìm+thấy+ảnh")
                }
              />
            ) : (
              <p>Không có ảnh đại diện</p>
            )}
          </div>
          <div className="form-row" style={{ marginTop: "1rem" }}>
            <label className="form-label">Ảnh đại diện</label>
            {company.thumbnail ? (
              <img
                src={company.thumbnail}
                alt="Ảnh đại diện"
                style={{ width: "100px", height: "100px" }}
                className="company-image"
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/300x150?text=Không+tìm+thấy+ảnh")
                }
              />
            ) : (
              <p>Không có ảnh bìa</p>
            )}
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">Hồ sơ chứng nhận</label>
          {company.file ? (
            <div className="file-preview">
              <iframe
                src={company.file}
                width="100%"
                height="500px"
                title="Hồ sơ chứng nhận"
                style={{ border: "1px solid #ddd", borderRadius: "4px" }}
                onError={() => console.log("Không thể tải file trong iframe")}
              ></iframe>
              <a
                href={company.file}
                download
                className="file-download-link"
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginTop: "1rem", display: "inline-flex" }}
              >
                <FaDownload style={{ marginRight: "8px" }} />
                Tải xuống hồ sơ chứng nhận
              </a>
            </div>
          ) : (
            <p>Không có file</p>
          )}
        </div>

        <div data-color-mode="light" style={{ marginTop: "16px" }}>
          <label htmlFor="descriptionMarkdown" className="form-label">
            Mô tả (Markdown)
          </label>
          <MDEditor
            value={company.descriptionMarkdown}
            height={300}
            preview="live"
          />
          <input
            type="hidden"
            name="descriptionMarkdown"
            value={company.descriptionMarkdown}
          />
          <input
            type="hidden"
            name="descriptionHTML"
            value={company.descriptionHTML}
          />
        </div>

        <div className="form-center">
          <Link to="/admin/company" className="btn form-btn">
            Quay lại
          </Link>
        </div>
      </Form>
    </Wrapper>
  );
};

export default DetailCompany;
