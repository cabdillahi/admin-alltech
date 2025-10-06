"use client"

import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { DashboardSidebar } from "./Sidebar"
import { DashboardHeader } from "./Hedaer"
import { SidebarProvider } from "../ui/sidebar"

export default function DashRouter() {
  const navigate = useNavigate()
  const location = useLocation()
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo")
    if (!userInfo) {
      navigate("/SignIn")
      return
    }

    const { role } = JSON.parse(userInfo)
    if (role === "USER") {
      navigate("/profile")
    } else {
      setAllowed(true)
    }
  }, [navigate])

  if (!allowed) return null

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col">
          <DashboardHeader currentPath={location.pathname} />
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
