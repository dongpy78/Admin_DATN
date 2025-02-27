// import React, { useEffect, useState } from "react";
import TypeJobTable from "../../components/type-jobs/TypeJobTable";
import JobTableWrapper from "../../assets/wrappers/JobTableWrapper";
import axiosInstance from "../../libs/axiosInterceptor";
import {
  showSuccessToast,
  showErrorToast,
} from "../../utils/toastNotifications";

const TypeJob = () => {
  return (
    <JobTableWrapper>
      <h2 className="title-manage-user">Danh sách Loại Công Việc</h2>
      <TypeJobTable />
    </JobTableWrapper>
  );
};

export default TypeJob;
