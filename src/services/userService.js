import axiosInstance from "../libs/axiosInterceptor";

const getAllUsers = (data) => {
  return axiosInstance.get(
    `/auth/get-all-user?limit=${data.limit}&offset=${data.offset}&search=${data.search}`
  );
};

export { getAllUsers };
