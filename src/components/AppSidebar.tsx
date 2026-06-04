import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Brain,
  BarChart3,
  Settings,
  LogOut,
  Users,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLogout } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Inventory", url: "/inventory", icon: Package },
  { title: "Sales", url: "/sales", icon: ShoppingCart },
  { title: "AI Recommendations", url: "/recommendations", icon: Brain },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Users", url: "/users", icon: Users },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { logout } = useLogout();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className={`flex items-center gap-3 transition-all duration-200 ${collapsed ? 'justify-center p-2' : 'p-4'}`}>
          <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-sm font-bold text-foreground leading-tight">
                SmartDiscount
              </h1>
              <p className="text-[10px] text-muted-foreground">AI Retail Platform</p>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={false}
                        className="relative flex items-center w-full transition-all duration-200 group text-muted-foreground hover:text-foreground hover:bg-secondary"
                        activeClassName="bg-primary/10 text-primary font-medium shadow-sm ring-1 ring-primary/20"
                      >
                        <item.icon className="mr-3 h-[18px] w-[18px] transition-transform group-hover:scale-110" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/settings" 
                className="relative flex items-center w-full transition-all duration-200 group text-muted-foreground hover:text-foreground hover:bg-secondary" 
                activeClassName="bg-primary/10 text-primary font-medium shadow-sm ring-1 ring-primary/20"
              >
                <Settings className="mr-3 h-[18px] w-[18px] transition-transform group-hover:rotate-45" />
                {!collapsed && <span>Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              onClick={logout}
              className="relative flex items-center w-full transition-all duration-200 group text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              <div>
                <LogOut className="mr-3 h-[18px] w-[18px] transition-transform group-hover:-translate-x-1" />
                {!collapsed && <span>Logout</span>}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
