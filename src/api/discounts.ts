import { axiosInstance } from "@/services/axiosInstance";
import type { DiscountPrediction, MLHealth } from "@/types/index";

export const predictDiscounts = async (
  products: { product_id: string; features: Record<string, number> }[],
): Promise<DiscountPrediction[]> => {
  const response = await axiosInstance.post<DiscountPrediction[]>(
    "/ml/predict",
    { products },
  );
  return response.data;
};

export const fetchMLHealth = async (): Promise<MLHealth> => {
  const response = await axiosInstance.get<MLHealth>("/ml/health");
  return response.data;
};

export const reloadMLModels = async (): Promise<MLHealth> => {
  const response = await axiosInstance.post<MLHealth>("/ml/reload");
  return response.data;
};
