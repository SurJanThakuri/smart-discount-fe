import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createCategory,
  fetchAllCategories,
  fetchCategoryById,
  updateCategory,
  deleteCategory,
} from "@/api/categories";
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/types/index";

const CATEGORIES_QUERY_KEY = ["categories"];

export const useAllCategories = (searchQuery?: string) => {
  return useQuery({
    queryKey: [...CATEGORIES_QUERY_KEY, searchQuery],
    queryFn: () => fetchAllCategories(searchQuery),
    staleTime: 3 * 60 * 1000,
  });
};

export const useCategoryById = (categoryId: string | undefined) => {
  return useQuery({
    queryKey: [...CATEGORIES_QUERY_KEY, categoryId],
    queryFn: () => fetchCategoryById(categoryId!),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      toast.success("Category created successfully");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to create category";
      toast.error(message);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      data,
    }: {
      categoryId: string;
      data: UpdateCategoryRequest;
    }) => updateCategory(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      toast.success("Category updated successfully");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to update category";
      toast.error(message);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) => deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      toast.success("Category deleted successfully");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to delete category";
      toast.error(message);
    },
  });
};
