import axiosInstance from "../libs/axiosInterceptor";

const getAllUsers = (data) => {
  return axiosInstance.get(
    `/auth/get-all-user?limit=${data.limit}&offset=${data.offset}&search=${data.search}`
  );
};

const getAllPackage = (data) => {
  return axiosInstance.get(
    `/get-all-packages?limit=${data.limit}&offset=${data.offset}&search=${data.search}`
  );
};

const setActiveTypePackage = (data) => {
  return axiosInstance.put(`set-active-package-post`, data);
};

const getPackageById = (id) => {
  return axiosInstance.get(`/get-package-by-id?id=${id}`);
};

const createPackagePost = (data) => {
  return axiosInstance.post(`/create-package-post`, data);
};

const updatePackagePost = (data) => {
  return axiosInstance.put(`/update-package-post`, data);
};

const getStatisticalTypePost = (limit) => {
  return axiosInstance.get(`/posts/statistics?limit=${limit}`);
};

const getStatisticalPackagePost = (data) => {
  return axiosInstance.get(
    `/get-statistical-package?limit=${data.limit}&offset=${data.offset}&fromDate=${data.fromDate}&toDate=${data.toDate}`
  );
};

const getStatisticalPackageCv = (data) => {
  return axiosInstance.get(
    `/get-statistical-package-cv?limit=${data.limit}&offset=${data.offset}&fromDate=${data.fromDate}&toDate=${data.toDate}`
  );
};

export {
  getAllUsers,
  getAllPackage,
  setActiveTypePackage,
  getPackageById,
  createPackagePost,
  updatePackagePost,
  getStatisticalTypePost,
  getStatisticalPackagePost,
  getStatisticalPackageCv,
};
