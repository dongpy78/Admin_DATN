import React from "react";

const FormRowSelectV1 = ({
  name,
  labelText,
  list,
  defaultValue,
  onChange,
  disabled,
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
        defaultValue={defaultValue} // Sử dụng defaultValue thay vì value
        onChange={onChange}
        disabled={disabled}
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

export default FormRowSelectV1;
