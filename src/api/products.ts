import { axiosInstance } from "@/services/axiosInstance";
import { Product, CreateProductRequest, UpdateProductRequest } from "@/types/index";

export const createProduct = async (data: CreateProductRequest): Promise<Product> => {
  const response = await axiosInstance.post("/products/new", data);
  return response.data;
};

export const fetchAllProducts = async (searchQuery?: string): Promise<Product[]> => {
  const params = searchQuery ? { searchQuery } : {};
  const response = await axiosInstance.get("/products", { params });
  return response.data;
};

export const fetchProductById = async (id: string): Promise<Product> => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};

export const updateProduct = async (id: string, data: UpdateProductRequest): Promise<Product> => {
  const response = await axiosInstance.patch(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/products/${id}`);
};
