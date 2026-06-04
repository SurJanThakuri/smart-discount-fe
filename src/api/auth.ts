import { SignupFormData } from "@/forms/schemas";
import { axiosInstance } from "@/services/axiosInstance";
import {
  LoginRequest,
  AuthResponse,
  User,
  CreateShopUserRequest,
  ShopUsersResponse,
  ChangePasswordRequest,
  EditProfileRequest,
} from "@/types/index";

function mapUser(data: Record<string, unknown>): User {
  const shop = data.shop as { id?: string; name?: string } | undefined;
  return {
    id: data.id as string,
    email: data.email as string,
    fullName: data.fullName as string,
    shopName: (shop?.name as string) ?? (data.shopName as string) ?? "",
    contactNumber: (data.contactNumber as string) ?? "",
    role: data.role as User["role"],
    createdAt: data.createdAt as string,
    updatedAt: data.updatedAt as string,
  };
}

export const signupUser = async (data: SignupFormData): Promise<User> => {
  const response = await axiosInstance.post("/auth/signup", data);
  return mapUser(response.data);
};

export const loginUser = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
};

export const fetchCurrentUser = async (): Promise<User> => {
  const response = await axiosInstance.get("/auth/me");
  return mapUser(response.data);
};

export const fetchAllUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get("/user");
  return response.data;
};

export const fetchUserById = async (id: string): Promise<User> => {
  const response = await axiosInstance.get(`/user/${id}`);
  return mapUser(response.data);
};

export const updateUser = async (id: string, data: Partial<User>): Promise<User> => {
  const response = await axiosInstance.patch(`/user/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/user/${id}`);
};

export const createShopUser = async (data: CreateShopUserRequest): Promise<User> => {
  const response = await axiosInstance.post("/user/shop-users", data);
  return response.data;
};

export const fetchShopUsers = async (): Promise<ShopUsersResponse> => {
  const response = await axiosInstance.get("/user/shop-users");
  return response.data;
};

export const updateUserStatus = async (id: string, status: string): Promise<User> => {
  const response = await axiosInstance.patch(`/user/${id}/status`, { status });
  return response.data;
};

export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
  const response = await axiosInstance.patch("/auth/change-password", data);
  return response.data;
};

export const updateProfile = async (data: EditProfileRequest): Promise<User> => {
  const response = await axiosInstance.patch("/auth/profile", data);
  return mapUser(response.data);
};
