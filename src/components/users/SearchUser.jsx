import React, { useState } from "react";
import { Form, Link, useSubmit } from "react-router-dom";
import FormRow from "../layout-dashboard/FormRow";
import FormRowSelect from "../layout-dashboard/FormRowSelect";
import Wrapper from "../../assets/wrappers/DashboardFormPage";

const SearchUser = () => {
  const [search, setSearch] = useState("");

  const handleSearch = (value) => {
    setSearch(value);
  };

  return (
    <Wrapper>
      <Form method="get" className="form" action="/admin/list-user">
        <h5 className="form-title">Tìm kiếm người dùng</h5>
        <div className="form-center">
          <FormRow
            type="search"
            name="search"
            labelText="Tìm theo tên hoặc số điện thoại"
            // value={searchValue}
            onChange={(e) => {
              const newValue = e.target.value;
              setSearchValue(newValue);
              debounce(handleChange, "search")(newValue);
            }}
            placeholder="e.g., Tài"
          />

          <Link
            to="/admin/list-user"
            className="btn form-btn"
            // onClick={handleReset}
          >
            Reset Search Values
          </Link>
        </div>
      </Form>
    </Wrapper>
  );
};

export default SearchUser;
