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

// ======================== //
const createTag = (data) => {
  return axiosInstance.post(`/create-tags`, data);
};

const getAllTags = (params = {}) => {
  return axiosInstance.get(`/get-all-tags`, { params });
};

const getTagById = (id) => {
  return axiosInstance.get(`/get-tag-by-id/${id}`);
};

const updateTag = (id, data) => {
  return axiosInstance.put(`/update-tag/${id}`, data);
};

const deleteTag = (id) => {
  return axiosInstance.delete(`/delete-tag/${id}`);
};

// ======================== //
const createBlogIT = (data) => {
  return axiosInstance.post(`/create-post-it`, data);
};

const getAllBlogIT = (params = {}) => {
  return axiosInstance.get(`/all-posts-it`, { params });
};

const getBlogITById = (id) => {
  return axiosInstance.get(`/posts-it-by-id/${id}`);
};

const updateBlogIT = (id, data) => {
  return axiosInstance.put(`/update-posts-it/${id}`, data);
};

const deleteBlogIT = (id) => {
  return axiosInstance.delete(`/delete-posts-it/${id}`);
};

export {
  createCategoryBlog,
  getAllCategoryBlog,
  getCategoryBlogById,
  updateCategoryBlog,
  deleteCategoryBlog,
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag,
  createBlogIT,
  getAllBlogIT,
  getBlogITById,
  updateBlogIT,
  deleteBlogIT,
};
