import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, UserPlus, MoreHorizontal, Users, ShieldCheck, UserX } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Staff";
  status: "Active" | "Inactive" | "Suspended";
  lastLogin: string;
}

const initialUsers: UserData[] = [
  { id: 1, name: "Suresh Kumar", email: "suresh@shop.com", role: "Admin", status: "Active", lastLogin: "2 hours ago" },
  { id: 2, name: "Priya Sharma", email: "priya@shop.com", role: "Manager", status: "Active", lastLogin: "1 day ago" },
  { id: 3, name: "Amit Patel", email: "amit@shop.com", role: "Staff", status: "Active", lastLogin: "3 hours ago" },
  { id: 4, name: "Ravi Singh", email: "ravi@shop.com", role: "Staff", status: "Inactive", lastLogin: "2 weeks ago" },
  { id: 5, name: "Neha Gupta", email: "neha@shop.com", role: "Manager", status: "Active", lastLogin: "5 hours ago" },
  { id: 6, name: "Vikram Joshi", email: "vikram@shop.com", role: "Staff", status: "Suspended", lastLogin: "1 month ago" },
];

const roleColors: Record<string, string> = {
  Admin: "bg-primary/10 text-primary border-primary/20",
  Manager: "bg-warning/10 text-warning border-warning/20",
  Staff: "bg-muted text-muted-foreground border-border",
};

const statusColors: Record<string, string> = {
  Active: "bg-success/10 text-success border-success/20",
  Inactive: "bg-muted text-muted-foreground border-border",
  Suspended: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function UserManagement() {
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "Active").length,
    admins: users.filter((u) => u.role === "Admin").length,
  };

  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newUser: UserData = {
      id: Date.now(),
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      role: (fd.get("role") as UserData["role"]) || "Staff",
      status: "Active",
      lastLogin: "Just now",
    };
    setUsers([newUser, ...users]);
    setDialogOpen(false);
    toast.success("User added successfully");
  };

  const handleStatusChange = (id: number, status: UserData["status"]) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status } : u)));
    toast.success(`User status updated to ${status}`);
  };

  return (
    <DashboardLayout title="User Management">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          {[
            { label: "Total Users", value: stats.total, icon: Users, color: "text-primary" },
            { label: "Active Users", value: stats.active, icon: ShieldCheck, color: "text-success" },
            { label: "Admins", value: stats.admins, icon: ShieldCheck, color: "text-warning" },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle>All Users</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-56 h-9 bg-secondary border-0"
                />
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gradient-primary border-0 text-primary-foreground">
                    <UserPlus className="h-4 w-4 mr-1" /> Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddUser} className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input name="name" required placeholder="Full name" className="bg-secondary border-0" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input name="email" type="email" required placeholder="email@shop.com" className="bg-secondary border-0" />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Select name="role" defaultValue="Staff">
                        <SelectTrigger className="bg-secondary border-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="Staff">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">
                      Add User
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-secondary text-foreground text-xs font-medium">
                            {user.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={roleColors[user.role]}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[user.status]}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{user.lastLogin}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleStatusChange(user.id, "Active")}>
                            Set Active
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(user.id, "Inactive")}>
                            Set Inactive
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleStatusChange(user.id, "Suspended")}
                          >
                            <UserX className="h-4 w-4 mr-1" /> Suspend
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
