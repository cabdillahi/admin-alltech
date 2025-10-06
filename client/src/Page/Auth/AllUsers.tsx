"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Filter, Users, UserPlus, MoreHorizontal, Mail, Phone } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../Redex/Store"
import { GetAllUsersFn } from "../Redex/Slices/Users/AllUsers"
import { useNavigate } from "react-router-dom"

interface User {
  Userid: number
  name: string
  email: string
  phone?: string
  role: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  isdeleted: boolean
  isactive: boolean
}

// Skeleton Components
const UserRowSkeleton = () => (
  <TableRow>
    <TableCell>
      <div className="flex items-center space-x-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-24 rounded-full" />
    </TableCell>
    <TableCell>
      <div className="space-y-2">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-3 w-32" />
      </div>
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-16 rounded-full" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-20" />
    </TableCell>
    <TableCell className="text-right">
      <Skeleton className="h-8 w-8 rounded" />
    </TableCell>
  </TableRow>
)

const StatsCardSkeleton = () => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="ml-4 space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-12" />
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function AllUsers() {
  const dispatch = useDispatch<AppDispatch>()
    // @ts-expect-error
  const AllUsers = useSelector((state: RootState) => state.GetAllUsers) as {
    data: any
    isLoading: boolean
    isError: boolean
    isSuccess: boolean
    errorMessage: string
  }

  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  useEffect(() => {
    dispatch(GetAllUsersFn())
  }, [dispatch])

  useEffect(() => {
    if (AllUsers.data && AllUsers.data.result && Array.isArray(AllUsers.data.result)) {
      filterUsers()
    }
  }, [AllUsers.data, searchTerm, roleFilter])

  const filterUsers = () => {
    if (!AllUsers.data?.result || !Array.isArray(AllUsers.data.result)) {
      setFilteredUsers([])
      return
    }

    let filtered = AllUsers.data.result

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (user: User) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by role
    if (roleFilter !== "all") {
      filtered = filtered.filter((user: User) => user.role === roleFilter)
    }

    setFilteredUsers(filtered)
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "FINANCE_OFFICER":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "DONOR":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "STUDENT_VIEWER":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }
   const navigate = useNavigate()
  const handleCreateUser = () => {
    navigate("/dashboard/CreateUser")
  }
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get users array from the API response structure { result: [...users] }
  const users = AllUsers.data?.result || []

  // Safe filter function that checks if users is an array
  const safeFilter = (filterFn: (user: User) => boolean): number => {
    return Array.isArray(users) ? users.filter(filterFn).length : 0
  }

  if (AllUsers.isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error loading users</div>
          <p className="text-gray-600">{AllUsers.errorMessage}</p>
          <Button onClick={() => dispatch(GetAllUsersFn())} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Users</h1>
              <p className="text-gray-600 mt-2">Manage all Coracet users and their roles</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreateUser}>
      <UserPlus className="h-4 w-4 mr-2" />
      Add New User
    </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {AllUsers.isLoading ? (
            <>
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
            </>
          ) : (
            <>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-semibold text-sm">A</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Admins</p>
                      <p className="text-2xl font-bold text-gray-900">{safeFilter((u: User) => u.role === "ADMIN")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">D</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Donors</p>
                      <p className="text-2xl font-bold text-gray-900">{safeFilter((u: User) => u.role === "DONOR")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-sm">F</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Finance Officers</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {safeFilter((u: User) => u.role === "FINANCE_OFFICER")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Search and filter users by name, email, or role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name or email..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={AllUsers.isLoading}
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Select value={roleFilter} onValueChange={setRoleFilter} disabled={AllUsers.isLoading}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="DONOR">Donor</SelectItem>
                    <SelectItem value="FINANCE_OFFICER">Finance Officer</SelectItem>
                    <SelectItem value="STUDENT_VIEWER">Student Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              All Users{" "}
              {AllUsers.isLoading ? <Skeleton className="inline-block h-6 w-8 ml-2" /> : `(${filteredUsers.length})`}
            </CardTitle>
            <CardDescription>A list of all users in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {AllUsers.isLoading
                    ? // Show skeleton rows while loading
                      Array.from({ length: 5 }).map((_, index) => <UserRowSkeleton key={index} />)
                    : filteredUsers.map((user) => (
                        <TableRow key={user.Userid}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  {getInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">ID: {user.Userid}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getRoleBadgeColor(user.role)}>{user.role.replace("_", " ")}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-600">
                                <Mail className="h-3 w-3 mr-1" />
                                {user.email}
                              </div>
                              {user.phone && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {user.phone}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.isActive ? "default" : "secondary"}>
                              {user.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">{formatDate(user.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit User</DropdownMenuItem>
                                <DropdownMenuItem>Reset Password</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  {user.isActive ? "Deactivate" : "Activate"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </div>
            {!AllUsers.isLoading && filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-600">
                  {searchTerm || roleFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "No users have been added to the system yet."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
