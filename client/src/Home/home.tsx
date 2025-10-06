
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import {
  Building2,
  Users,
  Heart,
  GraduationCap,
  DollarSign,
  TrendingUp,
  Shield,
  Menu,
  X,
} from "lucide-react"

const features = [
  {
    icon: Users,
    title: "User Management",
    description: "Comprehensive user management system with role-based access control and permissions.",
    color: "blue",
  },
  {
    icon: Heart,
    title: "Donor Management",
    description: "Track and manage donors, donations, and fundraising campaigns effectively.",
    color: "red",
  },
  {
    icon: GraduationCap,
    title: "Student Management",
    description: "Complete student information system with academic records and enrollment tracking.",
    color: "green",
  },
  {
    icon: DollarSign,
    title: "Payment Processing",
    description: "Secure payment processing with multiple payment methods and transaction history.",
    color: "yellow",
  },
  {
    icon: TrendingUp,
    title: "Analytics & Reporting",
    description: "Detailed analytics and reporting tools to track performance and growth.",
    color: "purple",
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    description: "Enterprise-grade security with data encryption and compliance standards.",
    color: "gray",
  },
]




export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    // Check if user is already logged in
    const userInfo = localStorage.getItem("userInfo")
    if (userInfo) {
      // Redirect to dashboard if already logged in
      window.location.href = "/dashboard"
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Financial Manager</span>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
             
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/SignIn">
                <Button variant="ghost">Sign In</Button>
              </Link>
             
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
            
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <Link to="/SignIn">
                    <Button variant="ghost" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

     
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
         
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
         
          <div className="text-center mt-8 text-xs text-gray-500">
  © {new Date().getFullYear()}{" "}
  <a href="https://hornsolution.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">
    Horn Solution
  </a>. All rights reserved.
</div>

        </div>
      </footer>
    </div>
  )
}
