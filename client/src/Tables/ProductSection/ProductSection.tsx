"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Package,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Edit,
  Trash2,
  GripVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { AppDispatch, RootState } from "@/Page/Redex/Store";
import { GetAllProductSectionFn } from "@/Page/Redex/Slices/ProductSection/AllProductSection";

const ProductSectionList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("displayOrder");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const GetAllProductSection = useSelector((state: RootState) => state.GetAllProductSection);

  const sections = GetAllProductSection.data?.data || [];
  const totalPages = GetAllProductSection.data?.meta?.totalPages || 1;

  const sectionTypes = [
    "Featured Products",
    "New Arrivals",
    "Best Sellers",
    "On Sale",
    "Recommended",
    "Trending",
    "Category Showcase",
    "Brand Spotlight",
  ];

  const fetchSections = () => {
    const params: {
      page: string;
      limit: string;
      sortBy: string;
      sortOrder: string;
      sectionType?: string;
      search?: string;
    } = {
      page: currentPage.toString(),
      limit: pageSize.toString(),
      sortBy,
      sortOrder,
    };
    if (filterType !== "all") params.sectionType = filterType;
    if (searchTerm) params.search = searchTerm;

    dispatch(GetAllProductSectionFn(params));
  };

  useEffect(() => {
    fetchSections();
  }, [currentPage, pageSize, sortBy, sortOrder, searchTerm, filterType]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: string) => {
    setFilterType(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    const [field, order] = value.split("-");
    setSortBy(field);
    setSortOrder(order);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground">Product Sections</h1>
            <p className="text-muted-foreground">Manage and organize your product display sections</p>
          </div>
          <Button
            onClick={() => navigate("/dashboard/CreateProductSection")}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Section
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-border bg-card">
          <CardContent className="p-6 flex flex-col sm:flex-row gap-4 sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search sections..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 bg-input border-border"
              />
            </div>

            {/* Filter */}
            <Select value={filterType} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-full sm:w-48 bg-input border-border">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {sectionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={`${sortBy}-${sortOrder}`} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full sm:w-48 bg-input border-border">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="displayOrder-asc">Order (Low to High)</SelectItem>
                <SelectItem value="displayOrder-desc">Order (High to Low)</SelectItem>
                <SelectItem value="sectionType-asc">Type (A to Z)</SelectItem>
                <SelectItem value="sectionType-desc">Type (Z to A)</SelectItem>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Sections */}
        {GetAllProductSection.isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-border bg-card animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                    <div className="h-8 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sections.length === 0 ? (
          <Card className="border-border bg-card">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No sections found</h3>
              <p className="text-muted-foreground text-center mb-6">
                {searchTerm || filterType !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by creating your first product section"}
              </p>
              {!searchTerm && filterType === "all" && (
                <Button
                  onClick={() => navigate("/dashboard/CreateProductSection")}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Section
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => (
              <Card key={section.id} className="border-border bg-card hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                        {section.sectionType}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          Order: {section.displayOrder}
                        </Badge>
                        <Badge variant={section.isactive ? "default" : "secondary"} className="text-xs">
                          {section.isactive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      <p>Created: {new Date(section.createdAt).toLocaleDateString()}</p>
                      {section.User && <p>By: {section.User.name || section.User.email}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 border-border text-foreground hover:bg-muted bg-transparent">
                        <Eye className="mr-2 h-3 w-3" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 border-border text-foreground hover:bg-muted bg-transparent">
                        <Edit className="mr-2 h-3 w-3" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Card className="border-border bg-card">
            <CardContent className="p-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="border-border text-foreground hover:bg-muted"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="border-border text-foreground hover:bg-muted"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProductSectionList;
