"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Package, ArrowLeft } from "lucide-react"
import type { AppDispatch, RootState } from "@/Page/Redex/Store"
import { CrProductSectionFn, resetCrProductSectionState } from "@/Page/Redex/Slices/ProductSection/CrProductSection"
import { GetAllProductFn } from "@/Page/Redex/Slices/Product/AllProduct"

interface ProductSectionFormData {
  sectionType: string
  displayOrder: number
  productProductid: string
}

const CreateProductSection = () => {
  const [formData, setFormData] = useState<ProductSectionFormData>({
    sectionType: "",
    displayOrder: 1,
    productProductid: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const toastId = "product-section-toast"

  const CrProductSection = useSelector((state: RootState) => state.CProductSection)
  const AllProduct = useSelector((state: RootState) => state.AllProduct)

  useEffect(() => {
    dispatch(GetAllProductFn())
  }, [dispatch])

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.sectionType.trim()) newErrors.sectionType = "Section type is required"
    if (!formData.productProductid) newErrors.productProductid = "Product selection is required"
    if (formData.displayOrder < 1) newErrors.displayOrder = "Display order must be at least 1"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: keyof ProductSectionFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error("Please fix the errors below")
      return
    }
    toast.loading("Creating product section...", { id: toastId })
    dispatch(CrProductSectionFn(formData))
  }

  useEffect(() => {
    if (CrProductSection.isSuccess) {
      toast.success("Product section created successfully", { id: toastId })
      dispatch(resetCrProductSectionState())
      navigate("/dashboard/ProductSection")
    }
    if (CrProductSection.isError) {
      toast.error(CrProductSection.ErrorMessage || "Failed to create product section", { id: toastId })
    }
  }, [CrProductSection, dispatch, navigate])

  const sectionTypes = [

      "FEATURED",
      "LATEST",
      "TRENDING",

   
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/product-sections")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sections
          </Button>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Create Product Section</h1>
          <p className="text-muted-foreground">
            Organize your products into display sections for better customer experience
          </p>
        </div>

        {/* Form Card */}
        <Card className="border-border bg-card">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Package className="h-5 w-5 text-primary" />
              Section Details
            </CardTitle>
            <CardDescription>Configure how this section will appear in your product displays</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section Type */}
              <div className="space-y-2">
                <Label htmlFor="sectionType" className="text-sm font-medium text-foreground">
                  Section Type *
                </Label>
                <Select value={formData.sectionType} onValueChange={(value) => handleChange("sectionType", value)}>
                  <SelectTrigger className={`bg-input border-border ${errors.sectionType ? "border-destructive" : ""}`}>
                    <SelectValue placeholder="Choose section type" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.sectionType && <p className="text-sm text-destructive">{errors.sectionType}</p>}
              </div>

              {/* Product Selection */}
              <div className="space-y-2">
                <Label htmlFor="product" className="text-sm font-medium text-foreground">
                  Associated Product *
                </Label>
                <Select
                  value={formData.productProductid}
                  onValueChange={(value) => handleChange("productProductid", value)}
                  disabled={AllProduct.isLoading}
                >
                  <SelectTrigger className={`bg-input border-border ${errors.Productid ? "border-destructive" : ""}`}>
                    <SelectValue placeholder={AllProduct.isLoading ? "Loading products..." : "Select a product"} />
                  </SelectTrigger>
                 <SelectContent>
  {AllProduct.data?.data?.map((product: any) => (
    <SelectItem key={product.Productid} value={product.Productid?.toString()}>
      <div className="flex items-center gap-2">
        <span>{product.name}</span>
        <Badge variant="secondary" className="text-xs">
          ${product.price}
        </Badge>
      </div>
    </SelectItem>
  ))}
</SelectContent>

                </Select>
                {errors.Productid && <p className="text-sm text-destructive">{errors.Productid}</p>}
              </div>

              {/* Display Order */}
              <div className="space-y-2">
                <Label htmlFor="displayOrder" className="text-sm font-medium text-foreground">
                  Display Order *
                </Label>
                <Input
                  id="displayOrder"
                  type="number"
                  min="1"
                  value={formData.displayOrder}
                  onChange={(e) => handleChange("displayOrder", Number.parseInt(e.target.value) || 1)}
                  className={`bg-input border-border ${errors.displayOrder ? "border-destructive" : ""}`}
                  placeholder="Enter display order (1, 2, 3...)"
                />
                {errors.displayOrder && <p className="text-sm text-destructive">{errors.displayOrder}</p>}
                <p className="text-xs text-muted-foreground">Lower numbers appear first in the display order</p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={CrProductSection.isLoading}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {CrProductSection.isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Section...
                    </>
                  ) : (
                    "Create Product Section"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard/product-sections")}
                  className="border-border text-foreground hover:bg-muted"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CreateProductSection
