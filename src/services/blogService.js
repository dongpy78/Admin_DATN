import axiosInstance from "../libs/axiosInterceptor";

const createCategoryBlog = (data) => {
  return axiosInstance.post(`/create-categories`, data);
};

const getAllCategoryBlog = (params = {}) => {
  return axiosInstance.get(`/get-all-categories`, { params });
};

const getCategoryBlogById = (id) => {
  return axiosInstance.get(`/get-category/${id}`);
};

const updateCategoryBlog = (id, data) => {
  return axiosInstance.put(`/update-categories/${id}`, data);
};

const deleteCategoryBlog = (id) => {
  return axiosInstance.delete(`/delete-categories/${id}`);
};

export {
  createCategoryBlog,
  getAllCategoryBlog,
  getCategoryBlogById,
  updateCategoryBlog,
  deleteCategoryBlog,
};
