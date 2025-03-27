import React, { useState, useRef } from "react";
import { Form, Link, useSubmit, useNavigate } from "react-router-dom";
import FormRow from "../layout-dashboard/FormRow";
import Wrapper from "../../assets/wrappers/DashboardFormPage";

const SearchUser = () => {
  const submit = useSubmit();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const formRef = useRef(null);

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
    submit(form, { method: "post" });
  };

  const handleReset = () => {
    setSearchValue("");
    if (formRef.current) {
      formRef.current.reset();
      const searchParams = new URLSearchParams(window.location.search);
      navigate(`/admin/list-user?${searchParams.toString()}`);
      submit(formRef.current, { method: "post" });
    }
  };

  return (
    <Wrapper>
      <Form
        method="post"
        className="form"
        action="/admin/list-user"
        ref={formRef}
      >
        <h5 className="form-title">Tìm kiếm người dùng</h5>
        <div className="form-center">
          <FormRow
            type="search"
            name="search"
            labelText="Tìm theo tên hoặc số điện thoại"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              debounce(handleChange)(e);
            }}
            placeholder="Search by name or phone..."
          />
          <Link
            to="/admin/list-user"
            className="btn form-btn"
            onClick={handleReset}
          >
            Reset Search Values
          </Link>
        </div>
      </Form>
    </Wrapper>
  );
};

export default SearchUser;
