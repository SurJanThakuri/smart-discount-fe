import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createSale,
  fetchAllSales,
  fetchSaleById,
  updateSale,
  deleteSale,
} from "@/api/sales";
import { Sale, CreateSaleRequest, UpdateSaleRequest } from "@/types/index";

const SALES_QUERY_KEY = ["sales"];

export const useAllSales = (searchQuery?: string) => {
  return useQuery({
    queryKey: [...SALES_QUERY_KEY, searchQuery],
    queryFn: () => fetchAllSales(searchQuery),
    staleTime: 3 * 60 * 1000,
  });
};

export const useSaleById = (saleId: string | number | undefined) => {
  return useQuery({
    queryKey: [...SALES_QUERY_KEY, saleId],
    queryFn: () => fetchSaleById(saleId!),
    enabled: !!saleId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSaleRequest) => createSale(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SALES_QUERY_KEY });
      toast.success("Sale recorded successfully");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to record sale";
      toast.error(message);
    },
  });
};

export const useUpdateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      saleId,
      data,
    }: {
      saleId: string | number;
      data: UpdateSaleRequest;
    }) => updateSale(saleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SALES_QUERY_KEY });
      toast.success("Sale updated successfully");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update sale";
      toast.error(message);
    },
  });
};

export const useDeleteSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (saleId: string | number) => deleteSale(saleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SALES_QUERY_KEY });
      toast.success("Sale deleted successfully");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to delete sale";
      toast.error(message);
    },
  });
};
