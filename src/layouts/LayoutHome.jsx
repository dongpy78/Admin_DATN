import React from "react";
import { Outlet } from "react-router-dom";

const LayoutHome = () => {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
};

export default LayoutHome;
