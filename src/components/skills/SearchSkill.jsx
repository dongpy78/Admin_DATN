import React, { useState } from "react";
import { Form, Link, useSubmit } from "react-router-dom";
import FormRow from "../layout-dashboard/FormRow";
import FormRowSelect from "../layout-dashboard/FormRowSelect";
import Wrapper from "../../assets/wrappers/DashboardFormPage";

const SearchSkill = ({ categoryJobCodes }) => {
  const submit = useSubmit();
  const [searchValue, setSearchValue] = useState("");
  const [categoryJobCode, setCategoryJobCode] = useState("Tất cả");

  const debounce = (onChange, field) => {
    let timeout;
    return (value) => {
      const form = document.querySelector(".form"); // Lấy form từ DOM
      console.log(`Debounce triggered for ${field} with value:`, value);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        console.log("Submitting form:", Object.fromEntries(new FormData(form)));
        onChange(form);
      }, 1000);
    };
  };

  const handleChange = (form) => {
    console.log(
      "Handle change called, submitting form:",
      Object.fromEntries(new FormData(form))
    );
    submit(form, { method: "post" });
  };

  const handleReset = () => {
    setSearchValue(""); // Reset state về rỗng
    if (formRef.current) {
      formRef.current.reset(); // Reset form trong DOM
      const formData = new FormData(formRef.current);
      // console.log("Resetting form data:", Object.fromEntries(formData));
      submit(formRef.current, { method: "post", action: "/admin/type-job" }); // Gửi form với search rỗng
    }
  };

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h5 className="form-title">Tìm kiếm </h5>
        <div className="form-center">
          <FormRow
            type="search"
            name="search"
            labelText="Search by Name"
            value={searchValue}
            onChange={(e) => {
              const newValue = e.target.value;
              setSearchValue(newValue);
              debounce(handleChange, "search")(newValue);
            }}
            placeholder="e.g., PHP"
          />
          <FormRowSelect
            name="categoryJobCode"
            labelText="Search by Job Code"
            list={categoryJobCodes}
            value={categoryJobCode}
            onChange={(e) => {
              const newValue = e.target.value;
              setCategoryJobCode(newValue);
              debounce(handleChange, "categoryJobCode")(newValue);
            }}
          />
          <Link
            to="/admin/skills"
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

export default SearchSkill;
