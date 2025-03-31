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

export { getAllUsers, getAllPackage, setActiveTypePackage };
