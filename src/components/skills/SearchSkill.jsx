import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { Form, useSubmit } from "react-router-dom";
import FormRow from "../layout-dashboard/FormRow";
import { Link } from "react-router-dom";
import { useState } from "react";

const SearchSkill = () => {
  const submit = useSubmit();
  const [searchValue, setSearchValue] = useState("");

  // Debounce để trì hoãn submit
  const debounce = (onChange) => {
    let timeout;
    return (e) => {
      const form = e.currentTarget.form;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        onChange(form);
      }, 1000); // 1 giây để kiểm tra nhanh
    };
  };

  const handleChange = (form) => {
    const formData = new FormData(form);
    const newSearchValue = formData.get("search") || "";
    setSearchValue(newSearchValue);
    // console.log("Submitting form data:", Object.fromEntries(formData));
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
        <h5 className="form-title">search skill</h5>
        <div className="form-center">
          <FormRow
            type="search"
            name="search"
            labelText="Search"
            value={searchValue}
            placeholder="Search by code or name..."
          />

          <Link to="/admin/type-job" className="btn form-btn">
            Reset Search Values
          </Link>
          {/* <SubmitBtn formBtn /> */}
        </div>
      </Form>
    </Wrapper>
  );
};

export default SearchSkill;
