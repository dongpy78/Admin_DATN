import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { Form, Link, useSubmit } from "react-router-dom";
import FormRow from "../layout-dashboard/FormRow";
import FormRowSelect from "../layout-dashboard/FormRowSelect";
import axiosInstance from "../../libs/axiosInterceptor";
import { showErrorToast } from "../../utils/toastNotifications";
import { useState, useEffect } from "react";

const SearchCompany = ({ typeCompany, onFilterChange }) => {
  const submit = useSubmit();
  const [searchValue, setSearchValue] = useState("");
  const [censorStatuses, setCensorStatuses] = useState([]);
  const [selectedCensorStatus, setSelectedCensorStatus] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState(typeCompany); // State để lưu danh sách đã lọc
  const [loading, setLoading] = useState(true);

  // Gọi API để lấy danh sách loại kiểm duyệt
  useEffect(() => {
    const fetchCensorStatuses = async () => {
      try {
        const response = await axiosInstance.get(
          "/list-allcodes?type=CENSORSTATUS&limit=10&offset=0"
        );
        if (response.status === 200) {
          const statuses = response.data.data.rows || [];
          setCensorStatuses(statuses);
          setSelectedCensorStatus(""); // Mặc định là "Tất cả"
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách kiểm duyệt:", error);
        showErrorToast("Không thể tải danh sách kiểm duyệt.");
      } finally {
        setLoading(false);
      }
    };

    fetchCensorStatuses();
  }, []);

  // Lọc danh sách công ty dựa trên selectedCensorStatus
  useEffect(() => {
    if (!typeCompany) {
      setFilteredCompanies([]);
      return;
    }

    const filtered =
      selectedCensorStatus === ""
        ? typeCompany // Nếu "Tất cả", hiển thị toàn bộ danh sách
        : typeCompany.filter(
            (company) => company.censorData?.code === selectedCensorStatus
          );

    setFilteredCompanies(filtered);
    onFilterChange(filtered); // Thông báo cho component cha danh sách đã lọc
  }, [selectedCensorStatus, typeCompany, onFilterChange]);

  const debounce = (onChange) => {
    let timeout;
    return (e) => {
      const form = e.currentTarget.form;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        onChange(form);
      }, 1000);
    };
  };

  const handleChange = (form) => {
    const formData = new FormData(form);
    const newSearchValue = formData.get("search") || "";
    setSearchValue(newSearchValue);
    console.log("Submitting form data:", {
      search: newSearchValue,
    });
    submit(form, { method: "post" }); // Gửi chỉ search đến backend
  };

  const handleReset = () => {
    setSearchValue(""); // Reset state về rỗng
    if (formRef.current) {
      formRef.current.reset(); // Reset form trong DOM
      const formData = new FormData(formRef.current);
      // console.log("Resetting form data:", Object.fromEntries(formData));
      submit(formRef.current, { method: "post", action: "/admin/company" }); // Gửi form với search rỗng
    }
  };

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h5 className="form-title">Tìm kiếm công ty</h5>
        <div className="form-center">
          <FormRow
            type="search"
            name="search"
            labelText="Tìm kiếm"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              debounce(handleChange)(e);
            }}
            placeholder="Tìm theo tên hoặc mã số thuế..."
          />
          <FormRowSelect
            name="censorStatus"
            labelText="Loại kiểm duyệt"
            list={[
              { value: "", label: "Tất cả" },
              ...censorStatuses.map((status) => ({
                value: status.code,
                label: status.value,
              })),
            ]}
            value={selectedCensorStatus}
            onChange={(e) => {
              const newValue = e.target.value;
              setSelectedCensorStatus(newValue);
              // Không cần submit form vì lọc trên client-side
            }}
            disabled={loading}
          />
          <Link
            to="/admin/company"
            className="btn form-btn"
            onClick={handleReset}
          >
            Reset Search Values
          </Link>
        </div>
      </Form>
      {loading && <p>Loading censor statuses...</p>}
    </Wrapper>
  );
};

export default SearchCompany;
