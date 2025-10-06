import { GetAllProductFn } from "@/Page/Redex/Slices/Product/AllProduct";
import { DeleteProductFn } from "@/Page/Redex/Slices/Product/delete-product";
import type { AppDispatch, RootState } from "@/Page/Redex/Store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Package, Plus, Search, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Product {
  Productid: number;
  name: string;
  description?: string;
  price: number;
  oldPrice?: number;
  condition: string;
  rating?: number;
  imageUrl: string;
  contactMethod?: string;
  Category?: { name: string };
  User?: { name: string };
  createdAt: string;
}

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const pageSize = 12;

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const AllProduct = useSelector((state: RootState) => state.AllProduct);
  const GetAllCategory = useSelector(
    (state: RootState) => state.GetAllCategory
  );

  useEffect(() => {
    dispatch(GetAllProductFn());
  }, [dispatch]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (
        searchTerm ||
        selectedCategory !== "all" ||
        priceRange.min ||
        priceRange.max
      ) {
        const params = {
          page: currentPage.toString(),
          limit: pageSize.toString(),
          sortBy,
          sortOrder,
          ...(searchTerm && { search: searchTerm }),
          ...(selectedCategory !== "all" && {
            categoryCategoryid: selectedCategory,
          }),
          ...(priceRange.min && { minPrice: priceRange.min }),
          ...(priceRange.max && { maxPrice: priceRange.max }),
        };
        dispatch(GetAllProductFn(params));
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    dispatch,
    currentPage,
    sortBy,
    sortOrder,
    searchTerm,
    selectedCategory,
    priceRange,
  ]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handlePriceFilter = (type: "min" | "max", value: string) => {
    setPriceRange((prev) => ({ ...prev, [type]: value }));
    setCurrentPage(1);
  };

  const handleDeleteProduct = (productId: number, productName: string) => {
    setProductToDelete({ id: productId, name: productName });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    setDeletingProductId(productToDelete.id);
    setDeleteDialogOpen(false);

    try {
      await dispatch(DeleteProductFn(productToDelete.id)).unwrap();
      toast.success("Product deleted successfully", {
        description: `"${productToDelete.name}" has been removed from your products.`,
      });
      dispatch(GetAllProductFn());
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product", {
        description: "Please try again later.",
      });
    } finally {
      setDeletingProductId(null);
      setProductToDelete(null);
    }
  };

  const products = AllProduct?.data?.data ?? [];
  const meta = AllProduct?.data?.meta ?? {
    total: 0,
    totalPages: 1,
    currentPage: 1,
    limit: pageSize,
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Products
            </h1>
            <p className="text-muted-foreground">
              {meta.total} products available
            </p>
          </div>
          <Button
            onClick={() => navigate("/dashboard/CreateProduct")}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Select
                  value={selectedCategory}
                  onValueChange={handleCategoryFilter}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Array.isArray(GetAllCategory?.data) &&
                      GetAllCategory.data.map((category: any) => (
                        <SelectItem
                          key={category.Categoryid}
                          value={category.Categoryid.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <div className="flex gap-1">
                  <Input
                    placeholder="Min price"
                    value={priceRange.min}
                    onChange={(e) => handlePriceFilter("min", e.target.value)}
                    className="w-24"
                    type="number"
                  />
                  <Input
                    placeholder="Max price"
                    value={priceRange.max}
                    onChange={(e) => handlePriceFilter("max", e.target.value)}
                    className="w-24"
                    type="number"
                  />
                </div>

                <Select
                  value={`${sortBy}-${sortOrder}`}
                  onValueChange={(value) => {
                    const [field, order] = value.split("-");
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt-desc">Newest First</SelectItem>
                    <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                    <SelectItem value="price-asc">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-desc">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="name-asc">Name: A to Z</SelectItem>
                    <SelectItem value="name-desc">Name: Z to A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {AllProduct?.isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : AllProduct?.isError ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Error loading products
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                {AllProduct.ErrorMessage ||
                  "Something went wrong. Please try again."}
              </p>
              <Button onClick={() => dispatch(GetAllProductFn())}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground text-center mb-4">
                Try adjusting your search criteria or add some products to get
                started.
              </p>
              <Button onClick={() => navigate("/dashboard/create-product")}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Image</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product: any) => (
                    <TableRow key={product.Productid}>
                      <TableCell>
                        <div className="w-16 h-16 bg-muted rounded-md overflow-hidden">
                          <img
                            src={product.imageUrl || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">
                            {product.name}
                          </p>
                          {product.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {product.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {product.Category?.name || "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{product.condition}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-semibold text-primary">
                            ${product.price}
                          </p>
                          {product.oldPrice && (
                            <p className="text-xs text-muted-foreground line-through">
                              ${product.oldPrice}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.rating ? (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">
                              {product.rating}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {product.User?.name || "—"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleDeleteProduct(
                                product.Productid,
                                product.name
                              )
                            }
                            disabled={deletingProductId === product.Productid}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {meta.totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from(
                  { length: Math.min(5, meta.totalPages) },
                  (_, i) => {
                    const startPage = Math.max(
                      1,
                      Math.min(currentPage - 2, meta.totalPages - 4)
                    );
                    const page = startPage + i;
                    if (page > meta.totalPages) return null;

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < meta.totalPages)
                        setCurrentPage(currentPage + 1);
                    }}
                    className={
                      currentPage === meta.totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductList;
