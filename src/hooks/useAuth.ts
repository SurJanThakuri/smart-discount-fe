import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  loginUser,
  signupUser,
  fetchCurrentUser,
  updateUser,
  deleteUser,
  fetchAllUsers,
  fetchUserById,
  createShopUser,
  fetchShopUsers,
  updateUserStatus,
  changePassword,
  updateProfile,
} from "@/api/auth";
import {
  User,
  LoginRequest,
  CreateShopUserRequest,
  ChangePasswordRequest,
  EditProfileRequest,
} from "@/types/index";
import { SignupFormData } from "@/forms/schemas";

function notifyUserChange() {
  window.dispatchEvent(new Event("user-changed"));
}

const AUTH_QUERY_KEY = ["auth"];

export const useSignup = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignupFormData) => signupUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      toast.success("Account created successfully! Please sign in.");
      navigate("/login");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Signup failed";
      toast.error(message);
    },
  });
};

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await loginUser(data);
      localStorage.setItem("access_token", response.accessToken);
      const user = await fetchCurrentUser();
      localStorage.setItem("user", JSON.stringify(user));
      notifyUserChange();
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      toast.success("Logged in successfully!");
      navigate("/dashboard");
    },
    onError: (error: any) => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
    },
  });
};

export const useLogoutAll = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return {
    logoutAll: () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      notifyUserChange();
      queryClient.clear();
      toast.success("Logged out of all sessions");
      navigate("/login");
    },
  };
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return {
    logout: () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      notifyUserChange();
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate("/login");
    },
  };
};

export const useCurrentUser = () => {
  const [user, setUser] = useState<User | null>(() => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  });

  useEffect(() => {
    if (!user && localStorage.getItem("access_token")) {
      fetchCurrentUser()
        .then((fetchedUser) => {
          localStorage.setItem("user", JSON.stringify(fetchedUser));
          setUser(fetchedUser);
        })
        .catch(() => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
        });
    }

    const handler = () => {
      const userStr = localStorage.getItem("user");
      setUser(userStr ? JSON.parse(userStr) : null);
    };
    window.addEventListener("user-changed", handler);
    return () => window.removeEventListener("user-changed", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return user;
};

export const useAllUsers = () => {
  return useQuery({
    queryKey: [...AUTH_QUERY_KEY, "all"],
    queryFn: fetchAllUsers,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserById = (userId: string | undefined) => {
  return useQuery({
    queryKey: [...AUTH_QUERY_KEY, userId],
    queryFn: () => fetchUserById(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Partial<User> }) =>
      updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      toast.success("User updated successfully");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update user";
      toast.error(message);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      toast.success("User deleted successfully");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to delete user";
      toast.error(message);
    },
  });
};

export const useCreateShopUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateShopUserRequest) => createShopUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...AUTH_QUERY_KEY, "shop-users"] });
      toast.success("Shop user created successfully");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to create shop user";
      toast.error(message);
    },
  });
};

export const useShopUsers = () => {
  return useQuery({
    queryKey: [...AUTH_QUERY_KEY, "shop-users"],
    queryFn: fetchShopUsers,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: string }) =>
      updateUserStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...AUTH_QUERY_KEY, "shop-users"] });
      toast.success("User status updated successfully");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update user status";
      toast.error(message);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => changePassword(data),
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to change password";
      toast.error(message);
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EditProfileRequest) => updateProfile(data),
    onSuccess: (updatedUser) => {
      localStorage.setItem("user", JSON.stringify(updatedUser));
      notifyUserChange();
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      toast.success("Profile updated successfully");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update profile";
      toast.error(message);
    },
  });
};
