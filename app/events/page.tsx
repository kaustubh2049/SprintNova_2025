'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Search, Trophy, Medal, Star, ChevronUp, Users, Award } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { supabase } from "@/lib/supabase"

// Helper function to map fest type to slug
const getFestSlug = (festType: string) => {
  const festMap: Record<string, string> = {
    'cultural': 'spandan',
    'technical': 'transmission',
    'sports': 'sparx'
  }
  return festMap[festType?.toLowerCase()] || 'spandan'
}

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

const EventCard = ({ event, onCardClick }: { event: any, onCardClick: (event: any) => void }) => {
  const festColors = {
    spandan: "border-pink-500 bg-pink-500/10",
    transmission: "border-blue-500 bg-blue-500/10", 
    sparx: "border-green-500 bg-green-500/10"
  }

  return (
    <Card 
      className={`hover-lift cursor-pointer border-2 ${festColors[event.fest as keyof typeof festColors]} bg-white shadow-lg`}
      onClick={() => onCardClick(event)}
    >
      {event.featured && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold glow-gold">
            <Star className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl text-gray-900 mb-2">{event.name}</CardTitle>
            <CardDescription className="text-gray-600 text-sm">
              {event.description}
            </CardDescription>
          </div>
          <Badge className={`${festColors[event.fest as keyof typeof festColors]} text-gray-700 border`}>
            {event.festName}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(event.date)}</span>
          <MapPin className="h-4 w-4 ml-2" />
          <span>{event.venue}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Users className="h-4 w-4" />
          <span>{event.totalParticipants} participants</span>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-neon-green" />
            Winners
          </h4>
          <div className="space-y-1">
            {event.winners.slice(0, 3).map((winner: any, index: number) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <MedalIcon type={winner.medal} />
                <span className="text-gray-900 font-medium">{winner.name}</span>
                <span className="text-gray-500">- {winner.class}</span>
              </div>
            ))}
            {event.winners.length > 3 && (
              <p className="text-xs text-gray-500">+{event.winners.length - 3} more winners</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const EventModal = ({ event, isOpen, onClose }: { event: any, isOpen: boolean, onClose: () => void }) => {
  if (!event) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white border-gray-300 text-gray-900">
        <DialogHeader>
          <DialogTitle className="text-2xl text-neon-green">{event.name}</DialogTitle>
          <DialogDescription className="text-gray-600">
            {event.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-electric-blue" />
              <span className="text-gray-900">{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-electric-blue" />
              <span className="text-gray-900">{event.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-electric-blue" />
              <span className="text-gray-900">{event.totalParticipants} participants</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-electric-blue" />
              <span className="text-gray-900">{event.festName} Fest</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-neon-green" />
              All Winners
            </h3>
            <div className="grid gap-3">
              {event.winners.map((winner: any, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <MedalIcon type={winner.medal} className="h-6 w-6" />
                  <div className="flex-1">
                    <div className="text-gray-900 font-medium">{winner.name}</div>
                    <div className="text-gray-600 text-sm">{winner.class}</div>
                  </div>
                  <Badge className={`${
                    winner.medal === 'gold' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                    winner.medal === 'silver' ? 'bg-gray-100 text-gray-700 border-gray-300' :
                    'bg-orange-100 text-orange-700 border-orange-300'
                  }`}>
                    {winner.medal.charAt(0).toUpperCase() + winner.medal.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
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

export default function EventsPage() {
  const [selectedTab, setSelectedTab] = useState("spandan")
  const [searchQuery, setSearchQuery] = useState("")
  const [medalFilter, setMedalFilter] = useState("all")
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    setLoading(true)
    try {
      // Fetch events with their fest information
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*, fests(*)')
        .order('event_date', { ascending: false })

      if (eventsError) throw eventsError

      // Fetch all winners
      const { data: winnersData, error: winnersError } = await supabase
        .from('winners')
        .select('*')
        .order('position', { ascending: true })

      if (winnersError) throw winnersError

      // Transform data to match the component's expected format
      const transformedEvents = eventsData?.map((event: any) => {
        const eventWinners = winnersData?.filter((w: any) => w.event_id === event.id) || []
        const festSlug = getFestSlug(event.fests?.type)
        
        return {
          id: event.id,
          name: event.name,
          description: event.description,
          date: event.event_date,
          venue: event.venue || 'TBA',
          fest: festSlug,
          festName: event.fests?.name || 'Unknown',
          winners: eventWinners.map((w: any) => ({
            name: w.student_name,
            class: w.class,
            medal: w.medal
          })),
          featured: eventWinners.length > 0 && eventWinners.some((w: any) => w.medal === 'gold'),
          totalParticipants: eventWinners.length
        }
      }) || []

      setEvents(transformedEvents)
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const filteredEvents = events.filter(event => {
    const matchesTab = selectedTab === "all" || event.fest === selectedTab
    const matchesSearch = searchQuery === "" || 
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.winners.some((winner: any) => 
        winner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        winner.class.toLowerCase().includes(searchQuery.toLowerCase())
      )
    const matchesMedal = medalFilter === "all" || 
      event.winners.some((winner: any) => winner.medal === medalFilter)
    
    return matchesTab && matchesSearch && matchesMedal
  })

  const festStats = {
    spandan: events.filter(e => e.fest === "spandan").length,
    transmission: events.filter(e => e.fest === "transmission").length,
    sparx: events.filter(e => e.fest === "sparx").length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-tech-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-tech-light">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-neon-green to-electric-blue bg-clip-text text-transparent">
            Events & Winners
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover all events from Spandan (Cultural), Transmission (Technical), and Sparx (Sports) with their winners and achievements
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search events, winners, or classes..."
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
              All Events ({events.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-6">
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onCardClick={handleEventClick}
                  />
                ))}
              </div>
            ) : (
              <Card className="bg-white border-gray-300 shadow-lg">
                <CardContent className="py-12 text-center">
                  <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No events found matching your criteria</p>
                  <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <EventModal 
          event={selectedEvent} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
        
        <BackToTopButton />
      </div>
    </div>
  )
}
