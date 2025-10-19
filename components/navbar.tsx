"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { 
  Trophy, 
  Calendar, 
  Image as ImageIcon, 
  FileText, 
  TrendingUp, 
  LayoutDashboard, 
  Users, 
  Settings,
  BarChart3,
  Mail,
  Medal,
  Plus,
  ChevronDown,
  LogOut,
  User
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Navbar() {
  const pathname = usePathname()
  const { user } = useUser()
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false)
  
  const isAdmin = user && process.env.NEXT_PUBLIC_ADMIN_USER_IDS?.split(',').includes(user.id)
  const isAdminPage = pathname.startsWith('/admin')

  // Public navigation items
  const publicNavItems = [
    { href: "/", label: "Home", icon: Trophy },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/standings", label: "Standings", icon: TrendingUp },
    { href: "/about", label: "About", icon: Users },
    { href: "/gallery", label: "Gallery", icon: ImageIcon },
    { href: "/notices", label: "Notices", icon: FileText },
  ]

  // Admin navigation items
  const adminNavItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/fests", label: "Fests", icon: Calendar },
    { href: "/admin/events", label: "Events", icon: Trophy },
    { href: "/admin/winners", label: "Winners", icon: Medal },
    { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
    { href: "/admin/emails", label: "Emails", icon: Mail },
    { href: "/admin/drafts", label: "Drafts", icon: FileText },
    { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  ]

  // Quick admin actions
  const quickActions = [
    { href: "/admin/gallery", label: "Upload Photo", icon: Plus },
    { href: "/admin/winners", label: "Add Winner", icon: Medal },
    { href: "/admin/drafts", label: "New Draft", icon: FileText },
  ]

  // Use appropriate nav items based on context
  const navItems = isAdminPage ? adminNavItems : publicNavItems

  return (
    <nav className={cn(
      "border-b backdrop-blur-sm sticky top-0 z-50",
      isAdminPage 
        ? "bg-gradient-to-r from-blue-50/80 to-purple-50/80 border-blue-200" 
        : "bg-white/50"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href={isAdminPage ? "/admin" : "/"} className="flex items-center gap-2 font-bold text-xl">
              <Image 
                src="/images/whatsapp-logo.jpeg" 
                alt="XIE Council Logo" 
                width={40} 
                height={40} 
                className="rounded-sm"
              />
              <span className="hidden sm:inline">
                {isAdminPage ? "Admin Panel" : "XIE Council"}
              </span>
            </Link>
            
            <div className="hidden md:flex gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={pathname === item.href ? "default" : "ghost"}
                      className={cn(
                        "gap-2",
                        isAdminPage && pathname === item.href && "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Admin Quick Actions */}
            {isAdmin && !isAdminPage && (
              <DropdownMenu open={isAdminMenuOpen} onOpenChange={setIsAdminMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600">
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Admin</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {quickActions.map((action) => {
                    const Icon = action.icon
                    return (
                      <DropdownMenuItem key={action.href} asChild>
                        <Link href={action.href} className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {action.label}
                        </Link>
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Admin Mode Toggle */}
            {isAdmin && (
              <div className="flex items-center gap-2">
                {isAdminPage ? (
                  <Link href="/">
                    <Button variant="outline" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">Public View</span>
                    </Button>
                  </Link>
                ) : (
                  <Link href="/admin">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Settings className="h-4 w-4" />
                      <span className="hidden sm:inline">Admin</span>
                    </Button>
                  </Link>
                )}
              </div>
            )}
            
            {/* Authentication */}
            {user ? (
              <div className="flex items-center gap-2">
                <UserButton 
                  afterSignOutUrl={isAdminPage ? "/" : "/"} 
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8"
                    }
                  }}
                />
                {isAdminPage && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      sessionStorage.removeItem('admin_authenticated')
                      window.location.href = '/'
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ) : (
              <Link href="/sign-in">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex gap-1 pb-2 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "gap-2 whitespace-nowrap",
                    isAdminPage && pathname === item.href && "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </div>

        {/* Admin Status Banner */}
        {isAdminPage && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center py-2 text-sm font-medium">
            <div className="flex items-center justify-center gap-2">
              <Settings className="h-4 w-4" />
              Admin Mode Active - You have full access to all management features
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
