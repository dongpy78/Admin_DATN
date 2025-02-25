import React from "react";
import { Outlet } from "react-router-dom";

const LayoutAuth = () => {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
};

export default LayoutAuth;
