// Frontend: CrProduct.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import type { AppDispatch, RootState } from "@/Page/Redex/Store";
import { GetAllCategoryFn } from "@/Page/Redex/Slices/Category/AllCategory";
import {
  CrProductFn,
  resetCrProductState,
} from "@/Page/Redex/Slices/Product/CrProduct";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Package, DollarSign, Star, Phone, ImageIcon } from "lucide-react";

interface CrProductFormData {
  name: string;
  description: string;
  price: string;
  oldPrice: string;
  condition: string;
  rating: string;
  contactMethod: string;
  categoryCategoryid: string;
  imageUrl: File | null;
}

const CrProduct = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const toastId = "CrProduct-toast";

  const CrProductState = useSelector((state: RootState) => state.CrProduct);
  const GetAllCategory = useSelector(
    (state: RootState) => state.GetAllCategory
  );

  const [formData, setFormData] = useState<CrProductFormData>({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    condition: "NEW",
    rating: "",
    contactMethod: "",
    categoryCategoryid: "",
    imageUrl: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Load categories
  useEffect(() => {
    dispatch(GetAllCategoryFn({}));
  }, [dispatch]);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.categoryCategoryid)
      newErrors.categoryCategoryid = "Category is required";
    if (formData.price && parseFloat(formData.price) <= 0)
      newErrors.price = "Price must be greater than 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    field: keyof CrProductFormData,
    value: string | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      handleChange("imageUrl", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    toast.loading("Creating Product...", { id: toastId });

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("price", formData.price);
    payload.append("categoryCategoryid", formData.categoryCategoryid);
    if (formData.description)
      payload.append("description", formData.description);
    if (formData.oldPrice) payload.append("oldPrice", formData.oldPrice);
    if (formData.condition) payload.append("condition", formData.condition);
    if (formData.rating) payload.append("rating", formData.rating);
    if (formData.contactMethod)
      payload.append("contactMethod", formData.contactMethod);
    if (formData.imageUrl) payload.append("imageUrl", formData.imageUrl);

    dispatch(CrProductFn(payload));
  };

  useEffect(() => {
    if (CrProductState.isSuccess) {
      toast.success("Product created successfully", { id: toastId });
      dispatch(resetCrProductState());
      navigate("/dashboard/Product");
    }
    if (CrProductState.isError) {
      toast.error(CrProductState.ErrorMessage || "Failed to create product", {
        id: toastId,
      });
    }
  }, [CrProductState, dispatch, navigate]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Create New Product
          </h1>
          <p className="text-muted-foreground">
            Add a new product with details, pricing, and image.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" /> Product Info
                </CardTitle>
                <CardDescription>Basic details of the product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your product..."
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.categoryCategoryid}
                    onValueChange={(value) =>
                      handleChange("categoryCategoryid", value)
                    }
                  >
                    <SelectTrigger
                      className={
                        errors.categoryCategoryid ? "border-destructive" : ""
                      }
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {GetAllCategory.data?.map((category: any) => (
                        <SelectItem
                          key={category.Categoryid}
                          value={category.Categoryid.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryCategoryid && (
                    <p className="text-sm text-destructive">
                      {errors.categoryCategoryid}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => handleChange("condition", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEW">New</SelectItem>
                      <SelectItem value="USED">Used</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Right Column */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" /> Pricing & Contact
                </CardTitle>
                <CardDescription>
                  Set price, rating, and contact
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                      className={errors.price ? "border-destructive" : ""}
                    />
                    {errors.price && (
                      <p className="text-sm text-destructive">{errors.price}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="oldPrice">Old Price</Label>
                    <Input
                      id="oldPrice"
                      type="number"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      value={formData.oldPrice}
                      onChange={(e) => handleChange("oldPrice", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="rating"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      placeholder="4.5"
                      value={formData.rating}
                      onChange={(e) => handleChange("rating", e.target.value)}
                      className="max-w-24"
                    />
                    <span className="text-sm text-muted-foreground">
                      out of 5
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactMethod">Contact Method</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contactMethod"
                      placeholder="Phone or email"
                      value={formData.contactMethod}
                      onChange={(e) =>
                        handleChange("contactMethod", e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" /> Product Image
              </CardTitle>
              <CardDescription>Upload a product image</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <label htmlFor="image-upload">
                  <input
                    id="image-upload"
                    type="file"
                    name="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>

                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Image Preview:</p>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/products")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={CrProductState.isLoading}>
              {CrProductState.isLoading ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrProduct;
