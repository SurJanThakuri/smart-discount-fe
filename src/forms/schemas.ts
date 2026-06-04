import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain uppercase, lowercase, number, and special character",
      ),
    confirmPassword: z.string(),
    fullName: z
      .string()
      .min(3, "Full name must be at least 3 characters")
      .max(20, "Full name must not exceed 20 characters"),
    shopName: z.string().min(2, "Shop name is required"),
    contactNumber: z
      .string()
      .regex(/^\d{10}$/, "Contact number must be exactly 10 digits"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const categorySchema = z.object({
  name: z
    .string()
    .min(3, "Category name must be at least 3 characters")
    .max(30, "Category name must not exceed 30 characters"),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export const productSchema = z.object({
  name: z
    .string()
    .min(3, "Product name must be at least 3 characters")
    .max(255, "Product name must not exceed 255 characters"),
  categoryId: z.string().uuid("Invalid category selected"),
  price: z
    .number()
    .min(0, "Price must be greater than or equal to 0")
    .max(999999.99, "Price exceeds maximum allowed value"),
  stockQty: z
    .number()
    .int("Stock quantity must be an integer")
    .min(0, "Stock quantity must be greater than or equal to 0"),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const saleSchema = z.object({
  productId: z.string().uuid("Invalid product selected"),
  qty: z
    .number()
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1"),
  amount: z
    .number()
    .min(0, "Amount must be greater than or equal to 0")
    .max(999999.99, "Amount exceeds maximum allowed value"),
  date: z.string().min(1, "Date is required"),
});

export type SaleFormData = z.infer<typeof saleSchema>;
