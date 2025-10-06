import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  LayoutDashboard,
  Users,
  Heart,
  GraduationCap,
  CreditCard,
  LogOut,
  ChevronRight,
  Building2,
  UserCheck,
  Gift,
  BookOpen,
  Wallet,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/Page/Redex/Store";
import { useNavigate } from "react-router-dom";
import { logout } from "@/Page/Auth/UserInfo";
type NavigationSubItem = {
  title: string;
  url: string;
  icon: React.ElementType;
};

type NavigationItem = {
  title: string;
  icon: React.ElementType;
  url?: string;
  badge?: string | null;
  items?: NavigationSubItem[];
};

const navigationItems: NavigationItem[] = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    url: "/dashboard",
    badge: null,
  },
  {
    title: "User Management",
    icon: Users,
    items: [{ title: "All Users", url: "/dashboard/Users", icon: UserCheck }],
  },
  {
    title: "Product Management",
    icon: Heart,
    items: [
      { title: "All Product", url: "/dashboard/Product", icon: Heart },
      {
        title: "Product Categories",
        url: "/dashboard/CreateProduct",
        icon: Gift,
      },
    ],
  },

  {
    title: "Category Management",
    icon: GraduationCap,
    items: [
      {
        title: "All Category",
        url: "/dashboard/Category",
        icon: GraduationCap,
      },
      { title: "Category", url: "/dashboard/CrCategory", icon: BookOpen },
    ],
  },
  {
    title: "ProductSection",
    icon: CreditCard,
    items: [
      {
        title: "All ProductSection",
        url: "/dashboard/ProductSection",
        icon: CreditCard,
      },
      {
        title: "ProductSection Methods",
        url: "/dashboard/CreateProductSection",
        icon: Wallet,
      },
    ],
  },
];

export function DashboardSidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigate();
  const userInfo = useSelector((state: RootState) => state.userInfo);

  const handleLogout = () => {
    dispatch(logout());
    navigation("/SignIn");
  };
  const location = useLocation();

  return (
    <Sidebar className="border-r border-gray-200 ">
      <SidebarHeader className="border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Alltech Computers
            </h2>
            <p className="text-xs text-gray-500">Management System</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <Collapsible className="group/collapsible">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="w-full justify-between hover:bg-blue-50 hover:text-blue-700 data-[state=open]:bg-blue-50 data-[state=open]:text-blue-700">
                          <div className="flex items-center space-x-3">
                            <item.icon className="h-4 w-4" />
                            <span className="font-medium">{item.title}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {item.badge && (
                              <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-700 text-xs"
                              >
                                {item.badge}
                              </Badge>
                            )}
                            <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                          </div>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="ml-4 mt-1 space-y-1">
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={location.pathname === subItem.url}
                                className="hover:bg-blue-50 hover:text-blue-700 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700 data-[active=true]:font-medium"
                              >
                                <Link
                                  to={subItem.url}
                                  className="flex items-center space-x-3"
                                >
                                  <subItem.icon className="h-4 w-4" />
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                      className="hover:bg-blue-50 hover:text-blue-700 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700 data-[active=true]:font-medium"
                    >
                      <Link
                        to={item.url || "#"}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="h-4 w-4" />
                          <span className="font-medium">{item.title}</span>
                        </div>
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-700 text-xs"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start p-2 h-auto hover:bg-blue-50"
            >
              <div className="flex items-center space-x-3 w-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={userInfo?.avatar || "/placeholder.svg"}
                    alt={userInfo?.name}
                  />
                  <AvatarFallback className="bg-blue-600 text-white text-sm">
                    {userInfo?.name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("") || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {userInfo?.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {userInfo?.email}
                  </p>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
