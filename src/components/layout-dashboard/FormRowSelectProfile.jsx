import React from "react";

const FormRowSelectProfile = ({
  name,
  labelText,
  list,
  value, // Giá trị được chọn
  onChange,
  disabled, // Hỗ trợ disabled
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
        value={value} // Giá trị được chọn
        onChange={onChange}
        disabled={disabled} // Hỗ trợ disabled
      >
        {list.map((item, index) => (
          <option key={index} value={item.code}>
            {" "}
            {/* Sử dụng item.code làm giá trị */}
            {item.value} {/* Sử dụng item.value làm nhãn hiển thị */}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormRowSelectProfile;
