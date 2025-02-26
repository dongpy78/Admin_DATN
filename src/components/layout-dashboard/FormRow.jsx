import React from "react";

const FormRow = React.forwardRef(
  ({ type, name, labelText, defaultValue, onChange, error }, ref) => {
    return (
      <div className="form-row">
        <label htmlFor={name} className="form-label">
          {labelText || name}
        </label>
        <input
          type={type}
          id={name}
          name={name}
          className="form-input"
          defaultValue={defaultValue || ""}
          onChange={onChange}
          ref={ref} // Ref được truyền xuống input
        />
        {error && <span className="form-error">{error}</span>}
      </div>
    );
  }
);

export default FormRow;
