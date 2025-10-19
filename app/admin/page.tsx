"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Trophy, Image, Mail, FileText, BarChart3, Medal, Settings, Sparkles, ArrowRight, Award, Lock } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function AdminPage() {
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    setMounted(true)
    // Check if already authenticated in session
    const auth = sessionStorage.getItem('admin_authenticated')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple password check - change this to your desired password
    if (password === 'admin123') {
      sessionStorage.setItem('admin_authenticated', 'true')
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Incorrect password")
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated')
    setIsAuthenticated(false)
    setPassword("")
  }

  if (!mounted) return null

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="border-2">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Login
              </CardTitle>
              <CardDescription>
                Enter password to access admin dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Input
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-lg py-6"
                    autoFocus
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Default password: admin123
                  </p>
                </div>
                <Button type="submit" className="w-full py-6 text-lg">
                  Login to Admin Dashboard
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  const adminSections = [
    {
      title: "Fest Management",
      description: "Add, update, or delete fests and events",
      icon: Calendar,
      href: "/admin/fests",
      color: "from-blue-500 to-cyan-500",
      features: ["Create new fests", "Manage events", "Set schedules"]
    },
    {
      title: "Event Management",
      description: "Manage all event details and results",
      icon: Trophy,
      href: "/admin/events",
      color: "from-purple-500 to-pink-500",
      features: ["Add events", "Upload results", "Track participation"]
    },
    {
      title: "Winner Management",
      description: "Add winners and manage medal tallies",
      icon: Medal,
      href: "/admin/winners",
      color: "from-yellow-500 to-orange-500",
      features: ["Add winners", "Assign medals", "Auto-update standings"]
    },
    {
      title: "Gallery Management",
      description: "Upload and organize event photos",
      icon: Image,
      href: "/admin/gallery",
      color: "from-green-500 to-emerald-500",
      features: ["Upload photos", "Organize by event", "Manage albums"]
    },
    {
      title: "Email Management",
      description: "Manage mailing lists and send emails",
      icon: Mail,
      href: "/admin/emails",
      color: "from-indigo-500 to-purple-500",
      features: ["Manage lists", "Send emails", "Track delivery"]
    },
    {
      title: "Draft Mails",
      description: "Preview and schedule draft emails",
      icon: FileText,
      href: "/admin/drafts",
      color: "from-pink-500 to-rose-500",
      features: ["Create drafts", "Preview emails", "Schedule sending"]
    },
    {
      title: "Reports & Analytics",
      description: "View performance reports and statistics",
      icon: BarChart3,
      href: "/admin/reports",
      color: "from-cyan-500 to-blue-500",
      features: ["Top performers", "Department stats", "Download reports"]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/3 w-[400px] h-[400px] bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="container mx-auto px-4 py-12 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg mt-1">
                  Manage your student council website with ease
                </p>
              </div>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" size="lg">
            Logout
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Fests</p>
                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">3</p>
                  </div>
                  <Calendar className="h-12 w-12 text-blue-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Active Events</p>
                    <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">24</p>
                  </div>
                  <Trophy className="h-12 w-12 text-purple-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Total Winners</p>
                    <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">156</p>
                  </div>
                  <Award className="h-12 w-12 text-yellow-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Gallery Photos</p>
                    <p className="text-3xl font-bold text-green-700 dark:text-green-300">342</p>
                  </div>
                  <Image className="h-12 w-12 text-green-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Admin Sections */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Admin Features</h2>
          <p className="text-gray-600 dark:text-gray-300">Quick access to all management tools</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section, index) => (
            <motion.div
              key={section.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={section.href}>
                <Card className="group hover:shadow-2xl transition-all duration-500 cursor-pointer h-full border-2 hover:border-primary relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                  {/* Gradient bar */}
                  <div className={`h-2 bg-gradient-to-r ${section.color}`} />
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className={`absolute inset-0 bg-gradient-to-r ${section.color} opacity-5 blur-xl`} />
                  </div>

                  <CardHeader className="relative">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <section.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                      {section.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {section.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {section.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}

                    <div className="flex items-center gap-2 text-primary font-semibold pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Manage</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </CardContent>

                  {/* Corner decoration */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 p-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-6 w-6" />
                <h3 className="text-2xl font-bold">Quick Tip</h3>
              </div>
              <p className="text-white/90 text-lg">
                Use the Reports & Analytics section to download performance data and track top performers across departments.
              </p>
            </div>
            <Link href="/admin/reports">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                View Reports
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
