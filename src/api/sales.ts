import { axiosInstance } from "@/services/axiosInstance";
import { Sale, CreateSaleRequest, UpdateSaleRequest } from "@/types/index";

export const createSale = async (data: CreateSaleRequest): Promise<Sale> => {
  const response = await axiosInstance.post("/sales/new", data);
  return response.data;
};

export const fetchAllSales = async (searchQuery?: string): Promise<Sale[]> => {
  const params = searchQuery ? { searchQuery } : {};
  const response = await axiosInstance.get("/sales", { params });
  return response.data;
};

export const fetchSaleById = async (id: string | number): Promise<Sale> => {
  const response = await axiosInstance.get(`/sales/${id}`);
  return response.data;
};

export const updateSale = async (id: string | number, data: UpdateSaleRequest): Promise<Sale> => {
  const response = await axiosInstance.patch(`/sales/${id}`, data);
  return response.data;
};

export const deleteSale = async (id: string | number): Promise<void> => {
  await axiosInstance.delete(`/sales/${id}`);
};
