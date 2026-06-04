import { Bell, Search } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/useAuth";

interface TopNavbarProps {
  title?: string;
}

export function TopNavbar({ title = "Dashboard" }: TopNavbarProps) {
  const user = useCurrentUser();
  const initials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "SO";

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 gap-4">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
        <h2 className="text-lg font-semibold text-foreground tracking-tight">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9 w-72 h-9 bg-secondary/50 border-transparent focus:bg-background focus:border-ring transition-all rounded-full text-sm"
          />
        </div>

        <ThemeToggle />

        <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </button>

        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="gradient-primary text-primary-foreground text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-foreground leading-tight">
              {user?.fullName ?? "Shop Owner"}
            </p>
            <p className="text-xs text-muted-foreground">
              {user?.shopName ?? "My Shop"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
