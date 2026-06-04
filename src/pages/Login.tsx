import { useState } from "react";
import { Brain, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, loginSchema, type SignupFormData } from "@/forms/schemas";
import { useSignup, useLogin } from "@/hooks/useAuth";
import type { LoginRequest } from "@/types/index";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();
  const { mutate: signup, isPending: signupLoading } = useSignup();
  const { mutate: login, isPending: loginLoading } = useLogin();

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const loginForm = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
            <Brain className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">SmartDiscount</h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI-Powered Retail Intelligence
          </p>
        </div>

        <Card className="shadow-xl shadow-primary/5 border-border/50 backdrop-blur-sm">
          <CardHeader className="pb-2 text-center">
            <h2 className="text-lg font-semibold text-foreground">
              {isSignup ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isSignup
                ? "Start optimizing your shop today"
                : "Sign in to your dashboard"}
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {isSignup ? (
              <form
                onSubmit={signupForm.handleSubmit((data) => {
                  const { confirmPassword, ...payload } = data;
                  signup(payload);
                })}
                className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      className="bg-secondary border-0"
                      {...signupForm.register("fullName")}
                    />
                    {signupForm.formState.errors.fullName && (
                      <p className="text-sm text-destructive">
                        {signupForm.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="shopName">Shop Name</Label>
                    <Input
                      id="shopName"
                      placeholder="My Retail Store"
                      className="bg-secondary border-0"
                      {...signupForm.register("shopName")}
                    />
                    {signupForm.formState.errors.shopName && (
                      <p className="text-sm text-destructive">
                        {signupForm.formState.errors.shopName.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="signupEmail">Email</Label>
                  <Input
                    id="signupEmail"
                    type="email"
                    placeholder="owner@shop.com"
                    className="bg-secondary border-0"
                    {...signupForm.register("email")}
                  />
                  {signupForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {signupForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="signupPassword">Password</Label>
                    <PasswordInput
                      id="signupPassword"
                      placeholder="••••••••"
                      className="bg-secondary border-0"
                      {...signupForm.register("password")}
                    />
                    {signupForm.formState.errors.password && (
                      <p className="text-sm text-destructive">
                        {signupForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <PasswordInput
                      id="confirmPassword"
                      placeholder="••••••••"
                      className="bg-secondary border-0"
                      {...signupForm.register("confirmPassword")}
                    />
                    {signupForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {signupForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    placeholder="9876543210"
                    className="bg-secondary border-0"
                    {...signupForm.register("contactNumber")}
                  />
                  {signupForm.formState.errors.contactNumber && (
                    <p className="text-sm text-destructive">
                      {signupForm.formState.errors.contactNumber.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full gradient-primary border-0 text-primary-foreground shadow-sm hover:shadow-md transition-shadow"
                  disabled={signupLoading}>
                  {signupLoading ? "Creating Account..." : "Create Account"}
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </form>
            ) : (
              <form
                onSubmit={loginForm.handleSubmit((data) => login(data))}
                className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="loginEmail">Email</Label>
                  <Input
                    id="loginEmail"
                    type="email"
                    placeholder="owner@shop.com"
                    className="bg-secondary border-0"
                    {...loginForm.register("email")}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="loginPassword">Password</Label>
                  <PasswordInput
                    id="loginPassword"
                    placeholder="••••••••"
                    className="bg-secondary border-0"
                    {...loginForm.register("password")}
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-destructive">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full gradient-primary border-0 text-primary-foreground shadow-sm hover:shadow-md transition-shadow"
                  disabled={loginLoading}>
                  {loginLoading ? "Signing In..." : "Sign In"}
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </form>
            )}

            <p className="text-center text-sm text-muted-foreground">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                className="text-primary font-medium hover:underline"
                onClick={() => setIsSignup(!isSignup)}>
                {isSignup ? "Sign in" : "Sign up"}
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
