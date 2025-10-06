
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Settings,  LogOut, } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/Page/Redex/Store"
import { useNavigate } from "react-router-dom"
import { logout } from "@/Page/Auth/UserInfo"

interface DashboardHeaderProps {
  currentPath: string
}

export function DashboardHeader({ currentPath }: DashboardHeaderProps) {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigate()
  const userInfo = useSelector((state: RootState) => state.userInfo)

  const handleLogout = () => {
    dispatch(logout())
    navigation("/SignIn")
  }

  const getPageTitle = (path: string) => {
    const pathMap: { [key: string]: string } = {
      "/dashboard": "Dashboard Overview",
      "/dashboard/users": "User Management",
      "/dashboard/Product": "Product Management",
      "/dashboard/Category": "Category Management",
      "/dashboard/ProductSection": "ProductSection",
    }
    return pathMap[path] || "Dashboard"
  }



  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="md:hidden" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{getPageTitle(currentPath)}</h1>
            <p className="text-sm text-gray-500">Welcome back, {userInfo?.name?.split(" ")[0] || "User"}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
       

         

         
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userInfo?.avatar || "/placeholder.svg"} alt={userInfo?.name} />
                  <AvatarFallback className="bg-blue-600 text-white text-sm">
                    {userInfo?.name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("") || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userInfo?.name}</p>
                  <p className="text-xs leading-none text-gray-500">{userInfo?.email }</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
