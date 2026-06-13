export type UserRole = "ADMIN" | "MANAGER" | "STAFF";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface User {
  id: string;
  email: string;
  fullName: string;
  shopName: string;
  contactNumber: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface ShopUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastloggedIn: string | null;
}

export interface ShopUsersResponse {
  users: ShopUser[];
  summary: {
    totalUsers: number;
    totalActiveUsers: number;
    totalAdminUsers: number;
  };
}

export interface CreateShopUserRequest {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface EditProfileRequest {
  fullName: string;
  email: string;
  contactNumber: string;
  shopName: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  fullName: string;
  shopName: string;
  contactNumber: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name?: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  category?: Category;
  price: number;
  stockQty: number;
}

export interface CreateProductRequest {
  name: string;
  categoryId: string;
  price: number;
  stockQty: number;
}

export interface UpdateProductRequest {
  name?: string;
  categoryId?: string;
  price?: number;
  stockQty?: number;
}

export interface Sale {
  id: number;
  productId: string;
  product?: Product;
  qty: number;
  amount: number;
  date: string;
}

export interface CreateSaleRequest {
  productId: string;
  qty: number;
  amount: number;
  date?: string;
}

export interface UpdateSaleRequest {
  qty?: number;
  amount?: number;
  date?: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  statusCode?: number;
  error?: string;
}

export interface DiscountPrediction {
  product_id: string;
  recommended_discount: number;
  confidence: number;
  predicted_sales_lift: number;
  revenue_impact: number;
  slow_risk_probability: number;
}

export interface PredictDiscountRequest {
  products: {
    product_id: string;
    features: {
      sales_velocity_7d: number;
      sales_velocity_30d: number;
      days_since_last_sale: number;
      profit_margin: number;
      day_of_week: number;
      month: number;
      quarter: number;
      is_weekend: number;
      current_stock: number;
    };
  }[];
}

export interface DiscountRecommendation {
  productId: string;
  product: string;
  discount: number;
  revenueIncrease: string;
  confidence: number;
  reason: string;
  priority: "high" | "medium" | "low";
  salesLift: number;
  slowRisk: number;
}

export interface MLHealth {
  status: string;
}
