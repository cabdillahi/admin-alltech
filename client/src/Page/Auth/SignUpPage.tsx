"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, User,  Loader2, Phone } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../Redex/Store"
import {  useNavigate } from "react-router-dom"
import { registerFn, resetRegisterState } from "../Redex/Slices/Users/SingUp"

type UserRole = "ADMIN" |   "USER"

 
export default function SignUpPage() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { isLoading, isSuccess, isError, ErrorMessage } = useSelector((state: RootState) => state.Register)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [name, setname] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setpassword] = useState("")
  const [confirmpassword, setConfirmpassword] = useState("")
  const [role, setRole] = useState<UserRole>("USER")

  const toastId = "registertoast"

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!name || !email || !phone || !password || !confirmpassword) {
      return toast.error("All fields are required.", { id: toastId })
    }
    if (password !== confirmpassword) {
      return toast.error("Passwords do not match.", { id: toastId })
    }

    const data = { name, email, password, phone, role }
    toast.loading("Saving new user...", { id: toastId })
    dispatch(registerFn(data))
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success("User registered successfully", { id: toastId })
      navigate("/dashboard/Users")
    } else if (isError) {
      toast.error(ErrorMessage || "Registration failed", { id: toastId })
    }
    return () => {
      dispatch(resetRegisterState())
    }
  }, [isSuccess, isError, ErrorMessage, dispatch, navigate])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4"> {/* Simpler, cleaner background */}
      <div className="w-full max-w-lg"> {/* Increased max-width for better 2x2 layout */}
       
        <Card className="shadow-lg border border-gray-200 rounded-xl"> {/* Enhanced shadow and border */}
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center">Create User </CardTitle> {/* Larger title */}
            <CardDescription className="text-center text-base">Enter your information to create an account</CardDescription> {/* Larger description */}
          </CardHeader>
          <CardContent className="space-y-6"> {/* Increased overall spacing */}
            <form onSubmit={handleSubmit} className="space-y-6"> {/* Increased overall spacing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* 2x2 layout for these fields */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      type="text"
                      className="pl-10 h-10 border-gray-300 focus:border-blue-500\" 
                      value={name}
                      onChange={(e) => setname(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      placeholder="Enter your email"
                      type="email"
                      className="pl-10 h-10 border-gray-300 focus:border-blue-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="phone"
                      placeholder="Enter your phone number"
                      type="tel"
                      className="pl-10 h-10 border-gray-300 focus:border-blue-500"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                    <SelectTrigger className="h-10 border-gray-300 focus:border-blue-500"> {/* Added height and focus style */}
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Administrator</SelectItem>
                      <SelectItem value="USER">USER Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    placeholder="Create a password"
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10 h-10 border-gray-300 focus:border-blue-500"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Must be at least 8 characters long</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    type={showConfirmPassword ? "text" : "password"}
                    className="pl-10 pr-10 h-10 border-gray-300 focus:border-blue-500"
                    value={confirmpassword}
                    onChange={(e) => setConfirmpassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
           
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base" disabled={isLoading}> {/* Larger button, larger text */}
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>
          
          
           
          </CardContent>
        </Card>
       
      </div>
    </div>
  )
}
