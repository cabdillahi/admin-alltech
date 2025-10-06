import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CalendarDays, Users, Package, FolderOpen, BarChart3, Activity, Clock } from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import type { AppDispatch, RootState } from "@/Page/Redex/Store"
import { useDispatch, useSelector } from "react-redux"
import { GetDashboardFn } from "@/Page/Redex/Slices/Dashboard/Dashboard"

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>()
  const dashboard = useSelector((state: RootState) => state.dashboard)

  useEffect(() => {
    dispatch(GetDashboardFn())
  }, [dispatch])

  // Loading state
  if (dashboard.isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80 bg-muted rounded-lg"></div>
              <div className="h-80 bg-muted rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (dashboard.isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Dashboard</CardTitle>
            <CardDescription>{dashboard.ErrorMessage}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => dispatch(GetDashboardFn())} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const data = dashboard.data

  if (!data) {
    return null
  }

  // Calculate totals and percentages
  const totalUsers = data.users.reduce((sum, user) => sum + user.count, 0)
  const activeCategories = data.categories.active
  const totalCategories = data.categories.total
  const categoryActivePercentage = totalCategories > 0 ? (activeCategories / totalCategories) * 100 : 0

  // Prepare chart data
  const userRoleData = data.users.map((user) => ({
    role: user.role,
    count: user.count,
    percentage: totalUsers > 0 ? ((user.count / totalUsers) * 100).toFixed(1) : "0",
  }))

  const productConditionData = data.products.byCondition.map((condition) => ({
    condition: condition.condition,
    count: condition.count,
    percentage: data.products.total > 0 ? ((condition.count / data.products.total) * 100).toFixed(1) : "0",
  }))

  const sectionTypeData = data.productSections.byType.map((section) => ({
    type: section.type,
    count: section.count,
  }))

  const trendsData = data.trends.products.map((trend) => ({
    month: new Date(trend.month).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    products: trend.total,
  }))

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive overview of your business metrics and performance
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Total Users</CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Across {data.users.length} role{data.users.length !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Total Products</CardTitle>
              <Package className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{data.products.total.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+{data.products.newThisMonth} this month</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Active Categories</CardTitle>
              <FolderOpen className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{activeCategories}</div>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={categoryActivePercentage} className="flex-1 h-2" />
                <span className="text-xs text-muted-foreground">{categoryActivePercentage.toFixed(0)}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Product Sections</CardTitle>
              <BarChart3 className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {data.productSections.byType.reduce((sum, section) => sum + section.count, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {data.productSections.byType.length} section type{data.productSections.byType.length !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Roles Distribution */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">User Roles Distribution</CardTitle>
              <CardDescription>Breakdown of users by role</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userRoleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    // @ts-ignore
                    label={({ role, percentage }) => `${role} (${percentage}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    
                    {userRoleData.map((
                      // @ts-ignore
                      entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Product Trends */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Product Growth Trends</CardTitle>
              <CardDescription>New products added over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="products"
                    stroke="hsl(var(--accent))"
                    fill="hsl(var(--accent) / 0.2)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Product Conditions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Product Conditions</CardTitle>
              <CardDescription>Distribution by product condition</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productConditionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="condition" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Section Types */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Section Types</CardTitle>
              <CardDescription>Product sections by type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sectionTypeData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis dataKey="type" type="category" stroke="hsl(var(--muted-foreground))" width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Products */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Activity className="h-5 w-5 text-accent" />
                Recent Products
              </CardTitle>
              <CardDescription>Latest products added to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentActivity.products.map((product) => (
                  <div key={product.Productid} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                          {product.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm text-card-foreground">{product.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>by {product.User?.fullName || "Unknown"}</span>
                          {product.Category && (
                            <Badge variant="secondary" className="text-xs">
                              {product.Category.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(product.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Categories */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <FolderOpen className="h-5 w-5 text-accent" />
                Recent Categories
              </CardTitle>
              <CardDescription>Latest categories created</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentActivity.categories.map((category) => (
                  <div
                    key={category.Categoryid}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {category.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm text-card-foreground">{category.name}</p>
                        <p className="text-xs text-muted-foreground">by {category.User?.fullName || "Unknown"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(category.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
