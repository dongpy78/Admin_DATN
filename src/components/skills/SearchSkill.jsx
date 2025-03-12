import React, { useState } from "react";
import { Form, Link, useSubmit } from "react-router-dom";
import FormRow from "../layout-dashboard/FormRow";
import FormRowSelect from "../layout-dashboard/FormRowSelect";
import Wrapper from "../../assets/wrappers/DashboardFormPage";

const SearchSkill = ({ categoryJobCodes }) => {
  const submit = useSubmit();
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategoryJobCode, setSelectedCategoryJobCode] =
    useState("Tất cả");

  const debounce = (onChange, field) => {
    let timeout;
    return (value) => {
      const form = document.querySelector(".form");
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
    setSearchValue("");
    setSelectedCategoryJobCode("Tất cả");
    const form = document.querySelector(".form");
    if (form) {
      form.reset();
      const formData = new FormData(form);
      console.log("Resetting form data:", Object.fromEntries(formData));
      submit(form, { method: "post", action: "/admin/work-skill" });
    }
  };

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h5 className="form-title">Tìm kiếm kỹ năng</h5>
        <div className="form-center">
          <FormRow
            type="search"
            name="search"
            labelText="Tìm theo tên"
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
            labelText="Loại công việc"
            list={categoryJobCodes.map((code) => ({
              value: code,
              label: code,
            }))}
            value={selectedCategoryJobCode}
            onChange={(e) => {
              const newValue = e.target.value;
              setSelectedCategoryJobCode(newValue);
              debounce(handleChange, "categoryJobCode")(newValue);
            }}
          />
          <Link
            to="/admin/work-skill"
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
