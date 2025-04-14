import axiosInstance from "../libs/axiosInterceptor";

const getAllPackageCv = (data) => {
  return axiosInstance.get(
    `/get-all-package-cv?limit=${data.limit}&offset=${data.offset}&search=${data.search}`
  );
};

const setActiveTypePackageCv = (data) => {
  return axiosInstance.put(`/set-active-package-cv`, data);
};

const getPackageByIdCv = (id) => {
  return axiosInstance.get(`/get-package-cv-by-id?id=${id}`);
};

const createPackageCv = (data) => {
  return axiosInstance.post(`/create-package-cv`, data);
};

const updatePackageCv = (data) => {
  return axiosInstance.put(`/update-package-cv`, data);
};

const getStatisticalCv = (data) => {
  return axiosInstance.get(
    `/get-statistical-cv?limit=${data.limit}&offset=${data.offset}&fromDate=${data.fromDate}&toDate=${data.toDate}&companyId=${data.companyId}`
  );
};

export {
  getAllPackageCv,
  setActiveTypePackageCv,
  getPackageByIdCv,
  createPackageCv,
  updatePackageCv,
  getStatisticalCv,
};
