import Header from "@/components/header"
import { Outlet } from "react-router"

export default function Layout() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200">
      <Header />
      <Outlet />
    </main>
  )
}

