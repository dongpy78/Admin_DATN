import React from "react";
import { useEffect, useState } from "react";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import {
  getPackageById,
  createPackagePost,
  updatePackagePost,
} from "../../services/userService";
import FormRow from "../layout-dashboard/FormRow";
import { Form, useNavigate, useParams } from "react-router-dom";
import {
  showSuccessToast,
  showErrorToast,
} from "../../utils/toastNotifications";
import FormRowSelectV1 from "../layout-dashboard/FormRowSelect-V1";

const AddPackagePost = () => {
  const [isActionADD, setisActionADD] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const [inputValues, setInputValues] = useState({
    value: "",
    price: "",
    isHot: 0, // Still using number for form
    name: "",
  });

  useEffect(() => {
    if (id) {
      const fetchDetailPackagePost = async () => {
        try {
          setisActionADD(false);
          const res = await getPackageById(id);
          console.log("API Response:", res);

          if (res && res.data && res.data.data) {
            setInputValues({
              value: res.data.data.value.toString(),
              price: res.data.data.price.toString(),
              isHot: res.data.data.isHot ? 1 : 0, // Convert boolean to number for form
              name: res.data.data.name,
            });
          }
        } catch (error) {
          console.error("Error fetching package:", error);
          showErrorToast("Không thể tải thông tin gói bài viết");
        }
      };
      fetchDetailPackagePost();
    }
  }, [id]);

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSavePackagePost = async () => {
    if (!inputValues.name || !inputValues.value || !inputValues.price) {
      showErrorToast("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setIsLoading(true);

    try {
      let res;
      const isHotBoolean = inputValues.isHot == 1; // Convert form number to boolean

      if (isActionADD) {
        res = await createPackagePost({
          value: parseInt(inputValues.value),
          isHot: isHotBoolean,
          name: inputValues.name,
          price: parseFloat(inputValues.price),
        });
      } else {
        res = await updatePackagePost({
          id: id,
          value: parseInt(inputValues.value),
          isHot: isHotBoolean,
          name: inputValues.name,
          price: parseFloat(inputValues.price),
        });
      }

      console.log("Full API Response:", res);

      if (
        res &&
        res.data &&
        res.data.message &&
        res.data.message.includes("thành công")
      ) {
        showSuccessToast(res.data.message);
        if (isActionADD) {
          setInputValues({
            value: "",
            price: "",
            isHot: 0,
            name: "",
          });
        }
        navigate("/admin/package-post");
      } else {
        showErrorToast(res?.data?.message || "Thao tác thất bại");
      }
    } catch (error) {
      console.error("API Error:", error);
      showErrorToast(error.response?.data?.message || "Đã xảy ra lỗi hệ thống");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Form className="form">
        <h4 className="form-title">
          {isActionADD ? "Thêm mới gói bài viết" : "Cập nhật gói bài viết"}
        </h4>
        <div className="form-center">
          <FormRow
            type="text"
            name="name"
            labelText="Tên gói bài viết"
            defaultValue={inputValues.name}
            onChange={handleOnChange}
            required
          />
          <FormRow
            type="number"
            name="value"
            labelText="Giá trị"
            defaultValue={inputValues.value}
            onChange={handleOnChange}
            required
          />
          <FormRow
            type="number"
            name="price"
            labelText="Giá tiền (USD)"
            defaultValue={inputValues.price}
            onChange={handleOnChange}
            required
          />
          <div className="form-row">
            <label className="form-label">Loại bài viết</label>
            <select
              style={{ color: "black" }}
              className="form-select"
              value={inputValues.isHot}
              name="isHot"
              onChange={(event) => handleOnChange(event)}
            >
              <option value={0}>Bình thường</option>
              <option value={1}>Nổi bật</option>
            </select>
          </div>
        </div>
        <div className="form-center">
          <button
            type="button"
            className={`btn btn-block form-btn ${isLoading ? "disabled" : ""}`}
            onClick={handleSavePackagePost}
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Lưu"}
          </button>
        </div>
      </Form>
    </Wrapper>
  );
};

export default AddPackagePost;
