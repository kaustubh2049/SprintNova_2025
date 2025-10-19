'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Trophy, Medal, TrendingUp, Users, Award, Calendar, Search, Star, ChevronUp, Crown, Target, BarChart3, Loader2, AlertCircle } from "lucide-react"
import { 
  calculateClassTally, 
  calculateDepartmentTally, 
  convertToChartData, 
  calculateFestTally,
  generateExportData,
  getMedalDistribution
} from "@/lib/utils/standings"
import { Winner, ClassTally, DepartmentTally, FestFilter } from "@/lib/types/standings"
import { fetchAllWinners, fetchWinnersByFest, fetchMedalCountsByDepartment, fetchMedalCountsByClass } from "@/lib/fetch-functions"

const MedalIcon = ({ type, className = "" }: { type: string, className?: string }) => {
  const medalClasses = {
    gold: "medal-gold glow-gold",
    silver: "medal-silver glow-silver", 
    bronze: "medal-bronze glow-bronze"
  }
  
  return (
    <Medal className={`h-5 w-5 ${medalClasses[type as keyof typeof medalClasses]} ${className}`} />
  )
}

const ClassCard = ({ classData, rank }: { classData: ClassTally, rank: number }) => {
  const festColors = {
    "Computer Science": "border-blue-500 bg-blue-500/10",
    "Information Technology": "border-green-500 bg-green-500/10", 
    "Electronics": "border-purple-500 bg-purple-500/10"
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold glow-gold"><Crown className="h-3 w-3 mr-1" />1st</Badge>
    if (rank === 2) return <Badge className="bg-gradient-to-r from-gray-400 to-gray-600 text-white font-bold glow-silver">2nd</Badge>
    if (rank === 3) return <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold glow-bronze">3rd</Badge>
    return <Badge variant="outline" className="text-gray-400">{rank}th</Badge>
  }

  return (
    <Card className={`hover-lift cursor-pointer border-2 ${festColors[classData.department as keyof typeof festColors] || "border-gray-300 bg-gray-50"} bg-white shadow-lg`}>
      {rank <= 3 && (
        <div className="absolute -top-2 -right-2 z-10">
          {getRankBadge(rank)}
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl text-gray-900 mb-2">{classData.className}</CardTitle>
            <CardDescription className="text-gray-600 text-sm">
              {classData.department}
            </CardDescription>
          </div>
          <Badge className={`${festColors[classData.department as keyof typeof festColors] || "border-gray-300 bg-gray-100"} text-gray-700 border`}>
            Rank #{rank}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-center gap-2 mb-1">
              <MedalIcon type="gold" />
              <span className="text-yellow-600 font-bold text-lg">{classData.medals.gold}</span>
            </div>
            <div className="text-xs text-gray-600">Gold</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center gap-2 mb-1">
              <MedalIcon type="silver" />
              <span className="text-gray-600 font-bold text-lg">{classData.medals.silver}</span>
            </div>
            <div className="text-xs text-gray-600">Silver</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center justify-center gap-2 mb-1">
              <MedalIcon type="bronze" />
              <span className="text-orange-600 font-bold text-lg">{classData.medals.bronze}</span>
            </div>
            <div className="text-xs text-gray-600">Bronze</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-neon-green/10 to-electric-blue/10 rounded-lg border border-neon-green/30">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Trophy className="h-5 w-5 text-neon-green" />
              <span className="text-neon-green font-bold text-lg">{classData.medals.total}</span>
            </div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Target className="h-4 w-4 text-electric-blue" />
            Events Won
          </h4>
          <div className="text-sm text-gray-600">
            {classData.events.length > 0 ? classData.events.slice(0, 3).join(", ") : "No events yet"}
            {classData.events.length > 3 && (
              <span className="text-gray-500"> +{classData.events.length - 3} more</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const DepartmentCard = ({ deptData, rank }: { deptData: DepartmentTally, rank: number }) => {
  const festColors = {
    "Computer Science": "border-blue-500 bg-blue-500/10",
    "Information Technology": "border-green-500 bg-green-500/10", 
    "Electronics": "border-purple-500 bg-purple-500/10"
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold glow-gold"><Crown className="h-3 w-3 mr-1" />1st</Badge>
    if (rank === 2) return <Badge className="bg-gradient-to-r from-gray-400 to-gray-600 text-white font-bold glow-silver">2nd</Badge>
    if (rank === 3) return <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold glow-bronze">3rd</Badge>
    return <Badge variant="outline" className="text-gray-400">{rank}th</Badge>
  }

  return (
    <Card className={`hover-lift cursor-pointer border-2 ${festColors[deptData.department as keyof typeof festColors] || "border-gray-300 bg-gray-50"} bg-white shadow-lg`}>
      {rank <= 3 && (
        <div className="absolute -top-2 -right-2 z-10">
          {getRankBadge(rank)}
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl text-gray-900 mb-2">{deptData.department}</CardTitle>
            <CardDescription className="text-gray-600 text-sm">
              {deptData.classes.length} classes participating
            </CardDescription>
          </div>
          <Badge className={`${festColors[deptData.department as keyof typeof festColors] || "border-gray-300 bg-gray-100"} text-gray-700 border`}>
            Rank #{rank}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-center gap-2 mb-1">
              <MedalIcon type="gold" />
              <span className="text-yellow-600 font-bold text-lg">{deptData.medals.gold}</span>
            </div>
            <div className="text-xs text-gray-600">Gold</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center gap-2 mb-1">
              <MedalIcon type="silver" />
              <span className="text-gray-600 font-bold text-lg">{deptData.medals.silver}</span>
            </div>
            <div className="text-xs text-gray-600">Silver</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center justify-center gap-2 mb-1">
              <MedalIcon type="bronze" />
              <span className="text-orange-600 font-bold text-lg">{deptData.medals.bronze}</span>
            </div>
            <div className="text-xs text-gray-600">Bronze</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-neon-green/10 to-electric-blue/10 rounded-lg border border-neon-green/30">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Trophy className="h-5 w-5 text-neon-green" />
              <span className="text-neon-green font-bold text-lg">{deptData.medals.total}</span>
            </div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Users className="h-4 w-4 text-electric-blue" />
            Classes
          </h4>
          <div className="text-sm text-gray-600">
            {deptData.classes.slice(0, 3).join(", ")}
            {deptData.classes.length > 3 && (
              <span className="text-gray-500"> +{deptData.classes.length - 3} more</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="back-to-top"
          aria-label="Back to top"
        >
          <ChevronUp className="h-5 w-5 text-white" />
        </button>
      )}
    </>
  )
}

export default function StandingsPage() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [medalFilter, setMedalFilter] = useState("all")
  const [viewType, setViewType] = useState("class")
  const [winners, setWinners] = useState<Winner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch winners data from Supabase
  useEffect(() => {
    async function loadWinners() {
      try {
        setLoading(true)
        const { data, error } = await fetchAllWinners()
        
        if (error) {
          setError('Failed to load winners data')
          console.error('Error fetching winners:', error)
          return
        }

        // Transform Supabase data to match our Winner type
        const transformedWinners: Winner[] = data?.map((winner: any) => ({
          id: winner.id,
          event_id: winner.event_id,
          student_name: winner.student_name,
          class_name: winner.class_name || winner.class,
          department: winner.department,
          medal: winner.medal,
          event_name: winner.events?.name || 'Unknown Event',
          fest_name: winner.events?.fests?.name || 'Unknown Fest',
          created_at: winner.created_at
        })) || []

        setWinners(transformedWinners)
      } catch (err) {
        setError('Failed to load standings data')
        console.error('Error loading winners:', err)
      } finally {
        setLoading(false)
      }
    }

    loadWinners()
  }, [])

  // Calculate standings using utility functions
  const classTally = calculateClassTally(winners)
  const departmentTally = calculateDepartmentTally(winners)
  const festTally = calculateFestTally(winners)
  
  // Get medal distribution statistics
  const medalStats = getMedalDistribution(classTally)

  const filteredClassData = classTally.filter(classItem => {
    const matchesTab = selectedTab === "all" || 
      winners.some(winner => 
        winner.class_name === classItem.className && winner.fest_name?.toLowerCase() === selectedTab
      )
    const matchesSearch = searchQuery === "" || 
      classItem.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.department.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesMedal = medalFilter === "all" || 
      (medalFilter === "gold" && classItem.medals.gold > 0) ||
      (medalFilter === "silver" && classItem.medals.silver > 0) ||
      (medalFilter === "bronze" && classItem.medals.bronze > 0)
    
    return matchesTab && matchesSearch && matchesMedal
  })

  const filteredDeptData = departmentTally.filter(deptItem => {
    const matchesTab = selectedTab === "all" || 
      winners.some(winner => 
        winner.department === deptItem.department && winner.fest_name?.toLowerCase() === selectedTab
      )
    const matchesSearch = searchQuery === "" || 
      deptItem.department.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesMedal = medalFilter === "all" || 
      (medalFilter === "gold" && deptItem.medals.gold > 0) ||
      (medalFilter === "silver" && deptItem.medals.silver > 0) ||
      (medalFilter === "bronze" && deptItem.medals.bronze > 0)
    
    return matchesTab && matchesSearch && matchesMedal
  })

  const festStats = {
    spandan: winners.filter(w => w.fest_name === "Spandan").length,
    transmission: winners.filter(w => w.fest_name === "Transmission").length,
    sparx: winners.filter(w => w.fest_name === "Sparx").length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-tech-light flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-neon-green mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading standings data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-tech-light flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <AlertCircle className="h-12 w-12 mx-auto mb-2" />
            <p className="text-lg">{error}</p>
          </div>
          <Button onClick={() => window.location.reload()} className="gradient-primary text-white">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-tech-light">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-neon-green to-electric-blue bg-clip-text text-transparent">
            Medal Tally & Standings
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Track class-wise and department-wise performance across Spandan, Transmission, and Sparx fests
          </p>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="hover-lift bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-lg">
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <div className="text-3xl font-bold text-yellow-600">{medalStats.gold}</div>
              <div className="text-sm text-gray-600">Gold Medals</div>
            </CardContent>
          </Card>
          
          <Card className="hover-lift bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 shadow-lg">
            <CardContent className="p-6 text-center">
              <Medal className="h-8 w-8 mx-auto mb-2 text-gray-600" />
              <div className="text-3xl font-bold text-gray-600">{medalStats.silver}</div>
              <div className="text-sm text-gray-600">Silver Medals</div>
            </CardContent>
          </Card>
          
          <Card className="hover-lift bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg">
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <div className="text-3xl font-bold text-orange-600">{medalStats.bronze}</div>
              <div className="text-sm text-gray-600">Bronze Medals</div>
            </CardContent>
          </Card>
          
          <Card className="hover-lift bg-gradient-to-br from-neon-green/10 to-electric-blue/10 border-neon-green/30 shadow-lg">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-neon-green" />
              <div className="text-3xl font-bold text-neon-green">{winners.length}</div>
              <div className="text-sm text-gray-600">Total Winners</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search classes or departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-neon-green focus:ring-neon-green shadow-sm"
            />
          </div>
          <Select value={medalFilter} onValueChange={setMedalFilter}>
            <SelectTrigger className="w-full md:w-48 bg-white border-gray-300 text-gray-900 shadow-sm">
              <SelectValue placeholder="Filter by medal" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-300">
              <SelectItem value="all" className="text-gray-900">All Medals</SelectItem>
              <SelectItem value="gold" className="text-gray-900">Gold</SelectItem>
              <SelectItem value="silver" className="text-gray-900">Silver</SelectItem>
              <SelectItem value="bronze" className="text-gray-900">Bronze</SelectItem>
            </SelectContent>
          </Select>
          <Select value={viewType} onValueChange={setViewType}>
            <SelectTrigger className="w-full md:w-48 bg-white border-gray-300 text-gray-900 shadow-sm">
              <SelectValue placeholder="View type" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-300">
              <SelectItem value="class" className="text-gray-900">Classes</SelectItem>
              <SelectItem value="department" className="text-gray-900">Departments</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fest Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white border border-gray-300 shadow-sm">
            <TabsTrigger 
              value="spandan" 
              className="tab-glow data-[state=active]:bg-pink-100 data-[state=active]:text-pink-600 data-[state=active]:border-pink-300 data-[state=active]:glow-neon-green"
            >
              Spandan ({festStats.spandan})
            </TabsTrigger>
            <TabsTrigger 
              value="transmission"
              className="tab-glow data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600 data-[state=active]:border-blue-300 data-[state=active]:glow-electric-blue"
            >
              Transmission ({festStats.transmission})
            </TabsTrigger>
            <TabsTrigger 
              value="sparx"
              className="tab-glow data-[state=active]:bg-green-100 data-[state=active]:text-green-600 data-[state=active]:border-green-300 data-[state=active]:glow-neon-green"
            >
              Sparx ({festStats.sparx})
            </TabsTrigger>
            <TabsTrigger 
              value="all"
              className="tab-glow data-[state=active]:bg-gray-100 data-[state=active]:text-gray-700 data-[state=active]:border-gray-300 data-[state=active]:glow-electric-blue"
            >
              All Fests ({winners.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-6">
            {viewType === "class" ? (
              filteredClassData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredClassData.map((classItem, index) => (
                    <ClassCard 
                      key={classItem.className} 
                      classData={classItem} 
                      rank={index + 1}
                    />
                  ))}
                </div>
              ) : (
                <Card className="bg-white border-gray-300 shadow-lg">
                  <CardContent className="py-12 text-center">
                    <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">No classes found matching your criteria</p>
                    <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
                  </CardContent>
                </Card>
              )
            ) : (
              filteredDeptData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDeptData.map((deptItem, index) => (
                    <DepartmentCard 
                      key={deptItem.department} 
                      deptData={deptItem} 
                      rank={index + 1}
                    />
                  ))}
                </div>
              ) : (
                <Card className="bg-white border-gray-300 shadow-lg">
                  <CardContent className="py-12 text-center">
                    <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">No departments found matching your criteria</p>
                    <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
                  </CardContent>
                </Card>
              )
            )}
          </TabsContent>
        </Tabs>
        
        <BackToTopButton />
      </div>
    </div>
  )
}