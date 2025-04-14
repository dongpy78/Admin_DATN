import axiosInstance from "../libs/axiosInterceptor";

const getAllPackageCv = (data) => {
  return axiosInstance.get(
    `/get-all-package-cv?limit=${data.limit}&offset=${data.offset}&search=${data.search}`
  );
};

const setActiveTypePackageCv = (data) => {
  return axiosInstance.put(`/set-active-package-cv`, data);
};

export { getAllPackageCv, setActiveTypePackageCv };
