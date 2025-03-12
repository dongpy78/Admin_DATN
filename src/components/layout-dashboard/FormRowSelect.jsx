import React from "react";

const FormRowSelect = ({
  name,
  labelText,
  list,
  value, // Thêm prop value để kiểm soát state
  onChange,
  disabled, // Thêm prop disabled
}) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <select
        name={name}
        id={name}
        className="form-select"
        value={value} // Sử dụng value để kiểm soát state
        onChange={onChange}
        disabled={disabled} // Hỗ trợ disabled
      >
        {list.map((item, index) => (
          <option key={index} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormRowSelect;
