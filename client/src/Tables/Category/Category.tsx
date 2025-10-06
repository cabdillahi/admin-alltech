"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Filter, SortAsc, SortDesc } from "lucide-react"
import { AppDispatch } from "@/Page/Redex/Store"
import { GetAllCategoryFn } from "@/Page/Redex/Slices/Category/AllCategory"
import { Link } from "react-router-dom"

interface Category {
  id: number
  name: string
  description?: string
  isactive: boolean
  isdeleted: boolean
  createdAt: string
  User?: { name: string }
  Product?: any[]
  userUserid?: number
}




interface RootState {
  GetAllCategory: {
    data: Category[]
    isLoading: boolean
    isError: boolean
    ErrorMessage?: string
    meta?: {
      total: number
      totalPages: number
      currentPage: number
    }
  }
}


const CategoryList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const GetAllCategory = useSelector((state: RootState) => state.GetAllCategory)

  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 10,
      sortBy,
      sortOrder,
      ...(searchTerm && { search: searchTerm }),
      ...(filterStatus !== "all" && { isactive: filterStatus === "active" }),
    }

    dispatch(GetAllCategoryFn(params))
  }, [dispatch, searchTerm, sortBy, sortOrder, filterStatus, currentPage])

  const loading = GetAllCategory.isLoading
  const categories = GetAllCategory.data || []
  const totalPages = GetAllCategory.meta?.totalPages || 1
  const totalItems = GetAllCategory.meta?.total || 0





  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground mt-1">Manage your content categories</p>
        </div>
       <Link to="/dashboard/CrCategory">
      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
        <Plus className="h-4 w-4" />
        Add Category
      </Button>
        </Link>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-card-foreground">Category Management</CardTitle>
          <CardDescription>View and manage all your categories in one place</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input border-border"
              />
            </div>

            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-full sm:w-[180px] bg-input border-border">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={`${sortBy}-${sortOrder}`}
              onValueChange={(value) => {
                const [field, order] = value.split("-")
                setSortBy(field)
                setSortOrder(order as "asc" | "desc")
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px] bg-input border-border">
                {sortOrder === "asc" ? <SortAsc className="h-4 w-4 mr-2" /> : <SortDesc className="h-4 w-4 mr-2" />}
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
                <SelectItem value="name-desc">Name Z-A</SelectItem>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold text-foreground">Name</TableHead>
                  <TableHead className="font-semibold text-foreground">Description</TableHead>
                  <TableHead className="font-semibold text-foreground">Status</TableHead>
                  <TableHead className="font-semibold text-foreground">Products</TableHead>
                  <TableHead className="font-semibold text-foreground">Created</TableHead>
                  <TableHead className="font-semibold text-foreground">Created By</TableHead>
                  <TableHead className="font-semibold text-foreground w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        Loading categories...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No categories found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium text-foreground">{category.name}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">
                        {category.description || "No description"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={category.isactive ? "default" : "secondary"}
                          className={
                            category.isactive
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground"
                          }
                        >
                          {category.isactive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{category.Product?.length || 0} items</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(category.createdAt)}</TableCell>
                      <TableCell className="text-muted-foreground">{category.User?.name || "Unknown"}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2">
                              <Edit className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-destructive">
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {categories.length} of {totalItems} categories
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="border-border"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="border-border"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default CategoryList
