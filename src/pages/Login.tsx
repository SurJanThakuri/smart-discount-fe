import { useState } from "react";
import { Brain, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
            <Brain className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">SmartDiscount</h1>
          <p className="text-sm text-muted-foreground mt-1">AI-Powered Retail Intelligence</p>
        </div>

        <Card className="shadow-card-lg border-0">
          <CardHeader className="pb-2 text-center">
            <h2 className="text-lg font-semibold text-foreground">
              {isSignup ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isSignup ? "Start optimizing your shop today" : "Sign in to your dashboard"}
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {isSignup && (
              <div className="grid gap-2">
                <Label>Shop Name</Label>
                <Input placeholder="My Retail Store" className="bg-secondary border-0" />
              </div>
            )}
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input type="email" placeholder="owner@shop.com" className="bg-secondary border-0" />
            </div>
            <div className="grid gap-2">
              <Label>Password</Label>
              <Input type="password" placeholder="••••••••" className="bg-secondary border-0" />
            </div>
            <Button
              className="w-full gradient-primary border-0 text-primary-foreground"
              onClick={() => navigate("/")}
            >
              {isSignup ? "Create Account" : "Sign In"}
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                className="text-primary font-medium hover:underline"
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup ? "Sign in" : "Sign up"}
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
