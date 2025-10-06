"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, ArrowLeft } from "lucide-react"
import { AppDispatch } from "@/Page/Redex/Store"
import { CrCategoryFn, resetCrCategoryState } from "@/Page/Redex/Slices/Category/CrDonors"

interface CategoryFormData {
  name: string
  description?: string
}

interface CreateCategoryProps {
  onBack?: () => void
  onSuccess?: () => void
}


interface RootState {
  CrCategory: {
    isSuccess: boolean
    isError: boolean
    ErrorMessage?: string
    isLoading: boolean
  }
}



const CreateCategory = ({ onBack }: CreateCategoryProps) => {
  const [formData, setFormData] = useState<CategoryFormData>({ name: "", description: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const toastId = "Category-toast"

  const categoryState = useSelector((state: RootState) => state.CrCategory)

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: keyof CategoryFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error("Please fix the errors below")
      return
    }
    toast.loading("Creating Category...", { id: toastId })
    dispatch(CrCategoryFn(formData))
  }

  useEffect(() => {
    if (categoryState.isSuccess) {
      toast.success("Category created successfully", { id: toastId })
      dispatch(resetCrCategoryState())
      navigate("/dashboard/Category")
    }
    if (categoryState.isError) {
      toast.error(categoryState.ErrorMessage || "Failed to create category", { id: toastId })
    }
  }, [categoryState, dispatch, navigate])

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        )}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create Category</h1>
          <p className="text-muted-foreground mt-1">Add a new category to organize your content</p>
        </div>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Plus className="h-5 w-5 text-primary" />
            Category Details
          </CardTitle>
          <CardDescription>Provide the basic information for your new category</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Category Name *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter category name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`bg-input border-border ${errors.name ? "border-destructive" : ""}`}
                disabled={categoryState.isLoading}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-foreground">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter category description (optional)"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="bg-input border-border min-h-[100px] resize-none"
                disabled={categoryState.isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Provide a brief description to help others understand this category
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={categoryState.isLoading}
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              >
                {categoryState.isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create Category
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormData({ name: "", description: "" })}
                disabled={categoryState.isLoading}
                className="border-border"
              >
                Clear Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateCategory
