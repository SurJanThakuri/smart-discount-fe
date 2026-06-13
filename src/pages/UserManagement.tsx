import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  UserPlus,
  MoreHorizontal,
  Pencil,
  UserX,
  UserCheck,
  UserMinus,
  Ban,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useShopUsers,
  useCreateShopUser,
  useUpdateUser,
  useDeleteUser,
  useUpdateUserStatus,
} from "@/hooks/useAuth";
import type { ShopUser } from "@/types/index";

const roleColors: Record<string, string> = {
  ADMIN: "bg-primary/10 text-primary border-primary/20",
  MANAGER: "bg-warning/10 text-warning border-warning/20",
  STAFF: "bg-muted text-muted-foreground border-border",
};

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ShopUser | null>(null);

  // Add user form state
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("STAFF");

  // Edit user form state
  const [editFullName, setEditFullName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("STAFF");
  const [editStatus, setEditStatus] = useState<"ACTIVE" | "INACTIVE" | "SUSPENDED">("ACTIVE");

  const { data: shopData, isLoading } = useShopUsers();
  const { mutate: createUser, isPending: isCreating } = useCreateShopUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const { mutate: updateStatus } = useUpdateUserStatus();

  const users = shopData?.users ?? [];
  const summary = shopData?.summary;

  const filtered = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAddUser = () => {
    createUser(
      { fullName: newFullName, email: newEmail, password: newPassword, role: newRole as "ADMIN" | "MANAGER" | "STAFF" },
      {
        onSuccess: () => {
          setAddOpen(false);
          setNewFullName("");
          setNewEmail("");
          setNewPassword("");
          setNewRole("STAFF");
        },
      },
    );
  };

  const openEditDialog = (user: ShopUser) => {
    setEditingUser(user);
    setEditFullName(user.fullName);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditStatus(user.status as "ACTIVE" | "INACTIVE" | "SUSPENDED");
    setEditOpen(true);
  };

  const handleEditUser = () => {
    if (!editingUser) return;
    updateUser(
      {
        userId: editingUser.id,
        data: { fullName: editFullName, email: editEmail, role: editRole as "ADMIN" | "MANAGER" | "STAFF" },
      },
      {
        onSuccess: () => {
          if (editStatus !== editingUser.status) {
            updateStatus({ userId: editingUser.id, status: editStatus });
          }
          setEditOpen(false);
          setEditingUser(null);
        },
      },
    );
  };

  const handleRemoveUser = (user: ShopUser) => {
    if (!window.confirm(`Remove ${user.fullName} from the shop?`)) return;
    deleteUser(user.id);
  };

  const handleStatusChange = (user: ShopUser, status: "ACTIVE" | "INACTIVE" | "SUSPENDED") => {
    updateStatus({ userId: user.id, status });
  };

  return (
    <DashboardLayout title="User Management">
      {summary && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="shadow-sm border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{summary.totalUsers}</p>
              <p className="text-xs text-muted-foreground">Total Users</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-success">{summary.totalActiveUsers}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{summary.totalAdminUsers}</p>
              <p className="text-xs text-muted-foreground">Admins</p>
            </CardContent>
          </Card>
        </div>
      )}
      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-base font-semibold">
              Team Members
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-9 h-9 w-56 bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background transition-colors"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="gradient-primary border-0 text-primary-foreground shadow-sm hover:shadow-md transition-shadow">
                    <UserPlus className="h-4 w-4 mr-1" /> Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={newFullName}
                        onChange={(e) => setNewFullName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="staff@shop.com"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <PasswordInput
                        id="password"
                        placeholder="Min 8 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={newRole} onValueChange={setNewRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="STAFF">Staff</SelectItem>
                          <SelectItem value="MANAGER">Manager</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      className="gradient-primary border-0 text-primary-foreground"
                      disabled={isCreating || !newFullName || !newEmail || !newPassword}
                      onClick={handleAddUser}>
                      {isCreating ? "Creating..." : "Add User"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border/50 bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    </TableRow>
                  ))
                ) : filtered.length > 0 ? (
                  filtered.map((user, idx) => (
                    <TableRow key={user.id ?? idx}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="gradient-primary text-primary-foreground text-xs font-semibold">
                              {user.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.fullName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={roleColors[user.role] ?? ""}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            user.status === "ACTIVE"
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-muted text-muted-foreground border-border"
                          }>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(user)}>
                              <Pencil className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                {user.status === "ACTIVE" ? (
                                  <UserCheck className="h-4 w-4 mr-2 text-success" />
                                ) : user.status === "SUSPENDED" ? (
                                  <Ban className="h-4 w-4 mr-2 text-destructive" />
                                ) : (
                                  <UserMinus className="h-4 w-4 mr-2 text-muted-foreground" />
                                )}
                                Set Status
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(user, "ACTIVE")}
                                  disabled={user.status === "ACTIVE"}>
                                  <UserCheck className="h-4 w-4 mr-2 text-success" /> Active
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(user, "INACTIVE")}
                                  disabled={user.status === "INACTIVE"}>
                                  <UserMinus className="h-4 w-4 mr-2 text-muted-foreground" /> Inactive
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(user, "SUSPENDED")}
                                  disabled={user.status === "SUSPENDED"}>
                                  <Ban className="h-4 w-4 mr-2 text-destructive" /> Suspended
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleRemoveUser(user)}>
                              <UserX className="h-4 w-4 mr-2" /> Remove User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-8">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-fullName">Full Name</Label>
              <Input
                id="edit-fullName"
                placeholder="John Doe"
                value={editFullName}
                onChange={(e) => setEditFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="staff@shop.com"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STAFF">Staff</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={editStatus} onValueChange={(v) => setEditStatus(v as "ACTIVE" | "INACTIVE" | "SUSPENDED")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              className="gradient-primary border-0 text-primary-foreground"
              disabled={isUpdating || !editFullName || !editEmail}
              onClick={handleEditUser}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
