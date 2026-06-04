import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createProduct,
  fetchAllProducts,
  fetchProductById,
  updateProduct,
  deleteProduct,
} from "@/api/products";
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/types/index";

const PRODUCTS_QUERY_KEY = ["products"];

export const useAllProducts = (searchQuery?: string) => {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, searchQuery],
    queryFn: () => fetchAllProducts(searchQuery),
    staleTime: 3 * 60 * 1000,
  });
};

export const useProductById = (productId: string | undefined) => {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, productId],
    queryFn: () => fetchProductById(productId!),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      toast.success("Product created successfully");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to create product";
      toast.error(message);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: UpdateProductRequest;
    }) => updateProduct(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      toast.success("Product updated successfully");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to update product";
      toast.error(message);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      toast.success("Product deleted successfully");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to delete product";
      toast.error(message);
    },
  });
};
