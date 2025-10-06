
import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, Building2, Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { AppDispatch, RootState } from "../Redex/Store"
import { setUser } from "./UserInfo"
import { LoginFn, resetlogin } from "../Redex/Slices/Users/SingIn"
export default function SignInPage() {
  const toastId: string = "login"
  const [email, setemail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const login = useSelector((state: RootState) => state.Login)
const navigate = useNavigate()


  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      navigate("/dashboard")
    }
  }, [navigate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      return toast.error("Please provide the email and password.", { id: toastId })
    }
    toast.loading("Loading! Please wait...", { id: toastId })
    dispatch(LoginFn({ email: email, password: password }))
  }

  useEffect(() => {
    if (login.isSuccess && login.data?.result) {
      const { email, name, token, role  }: any = login.data.result
      dispatch(setUser({ name, email, token, role  }))
      toast.success("Login successful!", { id: toastId })
    navigate("/dashboard")
    }
    if (login.isError) {
      toast.error(login.ErrorMessage, { id: toastId })
    }
    dispatch(resetlogin())
  }, [login.isSuccess, login.isError, dispatch, login.data?.result, login.ErrorMessage, navigate])



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-600 mt-2">Sign in to your Coracet account</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl font-semibold text-center">Sign in</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    placeholder="Enter your email"
                    type="email"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm text-gray-600">
                  Remember me
                </Label>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={login.isLoading}>
                {login.isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

          

          
          
          </CardContent>
        </Card>

       <div className="text-center mt-8 text-xs text-gray-500">
  © {new Date().getFullYear()}{" "}
  <a href="https://hornsolution.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">
    Horn Solution
  </a>. All rights reserved.
</div>

      </div>
    </div>
  )
}
