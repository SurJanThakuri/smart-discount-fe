import { axiosInstance } from "@/services/axiosInstance";
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from "@/types/index";

export const createCategory = async (data: CreateCategoryRequest): Promise<Category> => {
  const response = await axiosInstance.post("/categories/new", data);
  return response.data;
};

export const fetchAllCategories = async (searchQuery?: string): Promise<Category[]> => {
  const params = searchQuery ? { searchQuery } : {};
  const response = await axiosInstance.get("/categories", { params });
  return response.data;
};

export const fetchCategoryById = async (id: string): Promise<Category> => {
  const response = await axiosInstance.get(`/categories/${id}`);
  return response.data;
};

export const updateCategory = async (id: string, data: UpdateCategoryRequest): Promise<Category> => {
  const response = await axiosInstance.patch(`/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/categories/${id}`);
};
