"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Download, TrendingUp, Trophy, Award, Users, Calendar } from "lucide-react"
import { motion } from "framer-motion"

export default function ReportsPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalWinners: 0,
    totalEvents: 0,
    totalFests: 0,
    totalPhotos: 0
  })
  const [topPerformers, setTopPerformers] = useState<any[]>([])
  const [departmentStats, setDepartmentStats] = useState<any[]>([])
  const [medalTally, setMedalTally] = useState<any[]>([])

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    setLoading(true)

    // Fetch overall stats
    const [winners, events, fests, photos] = await Promise.all([
      supabase.from('winners').select('*'),
      supabase.from('events').select('*'),
      supabase.from('fests').select('*'),
      supabase.from('gallery').select('*')
    ])

    setStats({
      totalWinners: winners.data?.length || 0,
      totalEvents: events.data?.length || 0,
      totalFests: fests.data?.length || 0,
      totalPhotos: photos.data?.length || 0
    })

    // Fetch medal tally by class
    const { data: winnersData } = await supabase
      .from('winners')
      .select('class, medal')

    if (winnersData) {
      const tallyMap: Record<string, { gold: number, silver: number, bronze: number, total: number }> = {}
      
      winnersData.forEach((winner: any) => {
        if (!tallyMap[winner.class]) {
          tallyMap[winner.class] = { gold: 0, silver: 0, bronze: 0, total: 0 }
        }
        if (winner.medal === 'gold') tallyMap[winner.class].gold++
        if (winner.medal === 'silver') tallyMap[winner.class].silver++
        if (winner.medal === 'bronze') tallyMap[winner.class].bronze++
        tallyMap[winner.class].total++
      })

      const tallyArray = Object.entries(tallyMap).map(([className, medals]) => ({
        class: className,
        ...medals
      })).sort((a, b) => b.total - a.total)

      setMedalTally(tallyArray)
      setTopPerformers(tallyArray.slice(0, 5))
    }

    setLoading(false)
  }

  const downloadReport = (type: string) => {
    if (type === 'standings') {
      const csv = [
        ['Class', 'Gold', 'Silver', 'Bronze', 'Total'],
        ...medalTally.map(item => [item.class, item.gold, item.silver, item.bronze, item.total])
      ].map(row => row.join(',')).join('\n')

      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `standings-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
            <p className="text-lg font-semibold">Loading Reports...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Reports & Analytics
        </h1>
        <p className="text-muted-foreground">
          View performance statistics and download reports
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Fests</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.totalFests}</p>
                </div>
                <Calendar className="h-12 w-12 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Events</p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{stats.totalEvents}</p>
                </div>
                <Trophy className="h-12 w-12 text-purple-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Total Winners</p>
                  <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">{stats.totalWinners}</p>
                </div>
                <Award className="h-12 w-12 text-yellow-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Gallery Photos</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">{stats.totalPhotos}</p>
                </div>
                <Users className="h-12 w-12 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Performers */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Top 5 Performing Classes
                </CardTitle>
                <CardDescription>Based on total medals won</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {topPerformers.length > 0 ? (
              <div className="space-y-4">
                {topPerformers.map((performer, index) => (
                  <div key={performer.class} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-600' :
                        'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{performer.class}</p>
                        <p className="text-sm text-muted-foreground">
                          🥇 {performer.gold} 🥈 {performer.silver} 🥉 {performer.bronze}
                        </p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {performer.total}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-blue-600" />
              Download Reports
            </CardTitle>
            <CardDescription>Export data for analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => downloadReport('standings')} 
              className="w-full justify-between"
              variant="outline"
            >
              <span>Download Standings (CSV)</span>
              <Download className="h-4 w-4" />
            </Button>
            <Button 
              onClick={() => downloadReport('winners')} 
              className="w-full justify-between"
              variant="outline"
            >
              <span>Download Winners List (CSV)</span>
              <Download className="h-4 w-4" />
            </Button>
            <Button 
              onClick={() => downloadReport('events')} 
              className="w-full justify-between"
              variant="outline"
            >
              <span>Download Events Report (CSV)</span>
              <Download className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Complete Medal Tally */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Complete Medal Tally
          </CardTitle>
          <CardDescription>All classes ranked by total medals</CardDescription>
        </CardHeader>
        <CardContent>
          {medalTally.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Rank</th>
                    <th className="text-left p-3 font-semibold">Class</th>
                    <th className="text-center p-3 font-semibold">🥇 Gold</th>
                    <th className="text-center p-3 font-semibold">🥈 Silver</th>
                    <th className="text-center p-3 font-semibold">🥉 Bronze</th>
                    <th className="text-center p-3 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {medalTally.map((item, index) => (
                    <tr key={item.class} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-semibold">{index + 1}</td>
                      <td className="p-3 font-medium">{item.class}</td>
                      <td className="p-3 text-center">{item.gold}</td>
                      <td className="p-3 text-center">{item.silver}</td>
                      <td className="p-3 text-center">{item.bronze}</td>
                      <td className="p-3 text-center font-bold text-primary">{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No medal data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
