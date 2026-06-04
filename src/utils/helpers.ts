import { User } from "@/types/index";

/**
 * Token Management Utilities
 */

export const tokenUtils = {
  /**
   * Get access token from localStorage
   */
  getToken: (): string | null => {
    return localStorage.getItem("access_token");
  },

  /**
   * Set access token in localStorage
   */
  setToken: (token: string): void => {
    localStorage.setItem("access_token", token);
  },

  /**
   * Remove access token from localStorage
   */
  removeToken: (): void => {
    localStorage.removeItem("access_token");
  },

  /**
   * Check if token exists
   */
  hasToken: (): boolean => {
    return !!localStorage.getItem("access_token");
  },
};

/**
 * User Management Utilities
 */

export const userUtils = {
  /**
   * Get current user from localStorage
   */
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Set current user in localStorage
   */
  setCurrentUser: (user: User): void => {
    localStorage.setItem("user", JSON.stringify(user));
  },

  /**
   * Remove current user from localStorage
   */
  removeCurrentUser: (): void => {
    localStorage.removeItem("user");
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("access_token");
  },

  /**
   * Logout user
   */
  logout: (): void => {
    tokenUtils.removeToken();
    userUtils.removeCurrentUser();
  },
};

/**
 * Error Handling Utilities
 */

export const errorUtils = {
  /**
   * Get error message from API response
   */
  getErrorMessage: (error: any): string => {
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    if (error?.message) {
      return error.message;
    }
    return "An unexpected error occurred";
  },

  /**
   * Check if error is 401 Unauthorized
   */
  isUnauthorized: (error: any): boolean => {
    return error?.response?.status === 401;
  },

  /**
   * Check if error is 403 Forbidden
   */
  isForbidden: (error: any): boolean => {
    return error?.response?.status === 403;
  },

  /**
   * Check if error is 404 Not Found
   */
  isNotFound: (error: any): boolean => {
    return error?.response?.status === 404;
  },

  /**
   * Check if error is validation error (400)
   */
  isValidationError: (error: any): boolean => {
    return error?.response?.status === 400;
  },
};

/**
 * Format Utilities
 */

export const formatUtils = {
  /**
   * Format price to currency format
   */
  formatPrice: (price: number, currency: string = "INR"): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
    }).format(price);
  },

  /**
   * Format date to readable format
   */
  formatDate: (date: string | Date): string => {
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  },

  /**
   * Format phone number
   */
  formatPhoneNumber: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.replace(/(\d{5})(\d{5})/, "$1 $2");
  },
};
