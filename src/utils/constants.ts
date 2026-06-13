/**
 * API Configuration
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3003",
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

/**
 * Query Client Configuration
 */

export const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  retry: 1,
  retryDelay: 1000,
};

/**
 * Local Storage Keys
 */

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  USER: "user",
  THEME: "theme",
  LANGUAGE: "language",
};

/**
 * API Endpoints
 */

export const API_ENDPOINTS = {
  // Auth
  AUTH_SIGNUP: "/auth/signup",
  AUTH_LOGIN: "/auth/login",

  // Categories
  CATEGORIES_LIST: "/categories",
  CATEGORIES_CREATE: "/categories/new",
  CATEGORIES_DETAIL: (id: string) => `/categories/${id}`,
  CATEGORIES_UPDATE: (id: string) => `/categories/${id}`,
  CATEGORIES_DELETE: (id: string) => `/categories/${id}`,

  // Products
  PRODUCTS_LIST: "/products",
  PRODUCTS_CREATE: "/products/new",
  PRODUCTS_DETAIL: (id: string) => `/products/${id}`,
  PRODUCTS_UPDATE: (id: string) => `/products/${id}`,
  PRODUCTS_DELETE: (id: string) => `/products/${id}`,

  // Sales
  SALES_LIST: "/sales",
  SALES_CREATE: "/sales/new",
  SALES_DETAIL: (id: string | number) => `/sales/${id}`,
  SALES_UPDATE: (id: string | number) => `/sales/${id}`,
  SALES_DELETE: (id: string | number) => `/sales/${id}`,

  // Users
  USERS_LIST: "/user",
  USERS_CREATE: "/user",
  USERS_DETAIL: (id: string) => `/user/${id}`,
  USERS_UPDATE: (id: string) => `/user/${id}`,
  USERS_DELETE: (id: string) => `/user/${id}`,

  // ML / Discounts
  ML_PREDICT: "/ml/predict",
  ML_HEALTH: "/ml/health",
  ML_RELOAD: "/ml/reload",
};
