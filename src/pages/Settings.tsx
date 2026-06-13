import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { User, Shield, Palette, Lock, Cpu, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { useCurrentUser, useUpdateProfile, useChangePassword, useLogoutAll } from "@/hooks/useAuth";
import { fetchMLHealth, reloadMLModels } from "@/api/discounts";

interface ProfileData {
  fullName: string;
  email: string;
  shopName: string;
  contactNumber: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const currentUser = useCurrentUser();
  const { mutate: saveProfile, isPending: isSaving } = useUpdateProfile();
  const { mutate: changePwd, isPending: isChangingPwd } = useChangePassword();
  const { logoutAll } = useLogoutAll();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [pwdDialogOpen, setPwdDialogOpen] = useState(false);
  const [mlStatus, setMlStatus] = useState<{ status: string } | null>(null);
  const [mlChecking, setMlChecking] = useState(false);
  const [mlReloading, setMlReloading] = useState(false);

  const profileForm = useForm<ProfileData>({
    defaultValues: {
      fullName: currentUser?.fullName ?? "",
      email: currentUser?.email ?? "",
      shopName: currentUser?.shopName ?? "",
      contactNumber: currentUser?.contactNumber ?? "",
    },
  });

  const pwdForm = useForm<ChangePasswordData>();

  const handleSaveProfile = (data: ProfileData) => {
    saveProfile(data, {
      onSuccess: () => {
        setIsEditingProfile(false);
      },
    });
  };

  const handleChangePassword = (data: ChangePasswordData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    changePwd(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      {
        onSuccess: () => {
          setPwdDialogOpen(false);
          pwdForm.reset();
        },
      },
    );
  };

  const checkMLHealth = async () => {
    setMlChecking(true);
    try {
      const result = await fetchMLHealth();
      setMlStatus(result);
    } catch {
      setMlStatus({ status: "unreachable" });
    } finally {
      setMlChecking(false);
    }
  };

  const handleReloadML = async () => {
    setMlReloading(true);
    try {
      const result = await reloadMLModels();
      toast.success(`ML models reloaded: ${result.status}`);
      await checkMLHealth();
    } catch {
      toast.error("Failed to reload ML models");
    } finally {
      setMlReloading(false);
    }
  };

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-3xl space-y-6">
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  Manage your personal information
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="gradient-primary text-primary-foreground text-lg font-semibold">
                  {(currentUser?.fullName ?? "SO")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
            <Separator />
            {isEditingProfile ? (
              <form
                onSubmit={profileForm.handleSubmit(handleSaveProfile)}
                className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" {...profileForm.register("fullName")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...profileForm.register("email")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Phone</Label>
                  <Input id="contactNumber" {...profileForm.register("contactNumber")} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="shopName">Shop Name</Label>
                  <Input id="shopName" {...profileForm.register("shopName")} />
                </div>
                <div className="flex gap-2 sm:col-span-2">
                  <Button
                    type="submit"
                    className="gradient-primary border-0 text-primary-foreground"
                    disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditingProfile(false);
                      profileForm.reset({
                        fullName: currentUser?.fullName ?? "",
                        email: currentUser?.email ?? "",
                        shopName: currentUser?.shopName ?? "",
                        contactNumber: currentUser?.contactNumber ?? "",
                      });
                    }}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Full Name</Label>
                  <p className="text-sm text-foreground">
                    {currentUser?.fullName ?? "N/A"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <p className="text-sm text-foreground">
                    {currentUser?.email ?? "N/A"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <p className="text-sm text-foreground">
                    {currentUser?.contactNumber ?? "N/A"}
                  </p>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Shop Name</Label>
                  <p className="text-sm text-foreground">
                    {currentUser?.shopName ?? "N/A"}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setIsEditingProfile(true);
                    profileForm.reset({
                      fullName: currentUser?.fullName ?? "",
                      email: currentUser?.email ?? "",
                      shopName: currentUser?.shopName ?? "",
                      contactNumber: currentUser?.contactNumber ?? "",
                    });
                  }}
                  className="gradient-primary border-0 text-primary-foreground">
                  Edit Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how the app looks</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="theme" className="mb-2 block">
                Theme
              </Label>
              <select
                id="theme"
                value={theme || "system"}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-secondary border-0 text-sm">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>ML Service</CardTitle>
                <CardDescription>AI recommendation engine status</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {mlStatus === null ? (
                  <span className="text-sm text-muted-foreground">Not checked</span>
                ) : mlStatus.status === "unreachable" ? (
                  <>
                    <XCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm text-destructive">Offline</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm text-success">{mlStatus.status}</span>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={checkMLHealth} disabled={mlChecking}>
                  <RefreshCw className={`h-3.5 w-3.5 mr-1 ${mlChecking ? "animate-spin" : ""}`} />
                  {mlChecking ? "Checking..." : "Check Health"}
                </Button>
                <Button size="sm" variant="outline" onClick={handleReloadML} disabled={mlReloading || mlStatus?.status === "unreachable"}>
                  <RefreshCw className={`h-3.5 w-3.5 mr-1 ${mlReloading ? "animate-spin" : ""}`} />
                  {mlReloading ? "Reloading..." : "Reload Models"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Dialog open={pwdDialogOpen} onOpenChange={setPwdDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Lock className="h-4 w-4 mr-2" /> Change Password
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={pwdForm.handleSubmit(handleChangePassword)}
                  className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <PasswordInput
                      id="currentPassword"
                      {...pwdForm.register("currentPassword", { required: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <PasswordInput
                      id="newPassword"
                      {...pwdForm.register("newPassword", { required: true, minLength: 8 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <PasswordInput
                      id="confirmPassword"
                      {...pwdForm.register("confirmPassword", { required: true })}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="gradient-primary border-0 text-primary-foreground"
                    disabled={isChangingPwd}>
                    {isChangingPwd ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <div className="pt-2 border-t">
              <Button variant="destructive" className="w-full" onClick={logoutAll}>
                Logout All Sessions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
