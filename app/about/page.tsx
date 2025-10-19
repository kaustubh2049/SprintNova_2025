'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { 
  Mail, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Github,
  Users,
  Award,
  Star,
  Heart,
  Zap,
  Target,
  Crown,
  Shield,
  Trophy,
  Palette,
  Code,
  Camera,
  ChevronRight,
  ChevronDown,
  User,
  Calendar,
  MapPin,
  Loader2,
  AlertCircle
} from "lucide-react"
import { fetchAllFests, fetchUpcomingFests } from "@/lib/fetch-functions"

// Mock data for council members
const councilMembers = {
  core: [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      role: "Dean",
      department: "Administration",
      year: "Faculty",
      email: "sarah.johnson@xie.edu",
      linkedin: "sarah-johnson-xie",
      twitter: "sarahjohnson_xie",
      image: "/api/placeholder/200/200",
      bio: "Leading the vision and direction of XIE with over 15 years of academic excellence and student development experience.",
      achievements: ["15+ years experience", "Student Development Expert", "Academic Leadership"]
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      role: "General Secretary",
      department: "Computer Science",
      year: "4th Year",
      email: "rajesh.kumar@xie.edu",
      linkedin: "rajesh-kumar-cs",
      instagram: "rajesh_kumar_xie",
      image: "/api/placeholder/200/200",
      bio: "Passionate leader dedicated to student welfare and campus development. Organized 20+ successful events.",
      achievements: ["Event Organizer", "Student Advocate", "Campus Leader"]
    },
    {
      id: 3,
      name: "Priya Sharma",
      role: "Assistant General Secretary",
      department: "Information Technology",
      year: "3rd Year",
      email: "priya.sharma@xie.edu",
      linkedin: "priya-sharma-it",
      twitter: "priya_sharma_xie",
      image: "/api/placeholder/200/200",
      bio: "Supporting the general secretary in all administrative tasks and student coordination activities.",
      achievements: ["Administrative Expert", "Student Coordinator", "Team Player"]
    }
  ],
  sports: [
    {
      id: 4,
      name: "Arjun Singh",
      role: "Sports Secretary",
      department: "Electronics",
      year: "4th Year",
      email: "arjun.singh@xie.edu",
      linkedin: "arjun-singh-sports",
      instagram: "arjun_sports_xie",
      image: "/api/placeholder/200/200",
      bio: "Former state-level basketball player leading all sports activities and tournaments at XIE.",
      achievements: ["State Basketball Player", "Tournament Organizer", "Fitness Enthusiast"]
    },
    {
      id: 5,
      name: "Sneha Patel",
      role: "Assistant Sports Secretary",
      department: "Computer Science",
      year: "3rd Year",
      email: "sneha.patel@xie.edu",
      linkedin: "sneha-patel-sports",
      twitter: "sneha_sports_xie",
      image: "/api/placeholder/200/200",
      bio: "Coordinating sports events and managing team logistics for various inter-college competitions.",
      achievements: ["Event Coordinator", "Team Manager", "Sports Enthusiast"]
    },
    {
      id: 6,
      name: "Vikram Reddy",
      role: "Joint Sports Secretary",
      department: "Information Technology",
      year: "2nd Year",
      email: "vikram.reddy@xie.edu",
      linkedin: "vikram-reddy-sports",
      instagram: "vikram_sports_xie",
      image: "/api/placeholder/200/200",
      bio: "Supporting sports activities and helping organize fitness programs and recreational events.",
      achievements: ["Fitness Coordinator", "Event Support", "Team Builder"]
    }
  ],
  technical: [
    {
      id: 7,
      name: "Neha Gupta",
      role: "Technical Secretary",
      department: "Computer Science",
      year: "4th Year",
      email: "neha.gupta@xie.edu",
      linkedin: "neha-gupta-tech",
      github: "neha-gupta-xie",
      image: "/api/placeholder/200/200",
      bio: "Leading technical initiatives, hackathons, and coding competitions. Passionate about innovation and technology.",
      achievements: ["Hackathon Winner", "Tech Innovator", "Coding Expert"]
    },
    {
      id: 8,
      name: "Karan Mehta",
      role: "Assistant Technical Secretary",
      department: "Information Technology",
      year: "3rd Year",
      email: "karan.mehta@xie.edu",
      linkedin: "karan-mehta-tech",
      github: "karan-mehta-xie",
      image: "/api/placeholder/200/200",
      bio: "Supporting technical events and managing the college's digital infrastructure and online platforms.",
      achievements: ["Digital Infrastructure", "Tech Support", "Innovation Leader"]
    },
    {
      id: 9,
      name: "Divya Nair",
      role: "Joint Technical Secretary",
      department: "Electronics",
      year: "2nd Year",
      email: "divya.nair@xie.edu",
      linkedin: "divya-nair-tech",
      github: "divya-nair-xie",
      image: "/api/placeholder/200/200",
      bio: "Coordinating technical workshops and helping students with coding projects and technical guidance.",
      achievements: ["Workshop Coordinator", "Student Mentor", "Tech Enthusiast"]
    }
  ],
  cultural: [
    {
      id: 10,
      name: "Ananya Joshi",
      role: "Cultural Secretary",
      department: "Computer Science",
      year: "4th Year",
      email: "ananya.joshi@xie.edu",
      linkedin: "ananya-joshi-culture",
      instagram: "ananya_culture_xie",
      image: "/api/placeholder/200/200",
      bio: "Leading cultural events, festivals, and artistic activities. Passionate about promoting arts and culture.",
      achievements: ["Cultural Events Leader", "Art Enthusiast", "Festival Organizer"]
    },
    {
      id: 11,
      name: "Rahul Kumar",
      role: "Assistant Cultural Secretary",
      department: "Information Technology",
      year: "3rd Year",
      email: "rahul.kumar@xie.edu",
      linkedin: "rahul-kumar-culture",
      twitter: "rahul_culture_xie",
      image: "/api/placeholder/200/200",
      bio: "Supporting cultural activities and managing artistic performances and creative workshops.",
      achievements: ["Performance Manager", "Creative Coordinator", "Art Supporter"]
    },
    {
      id: 12,
      name: "Sakshi Verma",
      role: "Joint Cultural Secretary",
      department: "Electronics",
      year: "2nd Year",
      email: "sakshi.verma@xie.edu",
      linkedin: "sakshi-verma-culture",
      instagram: "sakshi_culture_xie",
      image: "/api/placeholder/200/200",
      bio: "Coordinating cultural workshops and helping organize artistic competitions and cultural exchanges.",
      achievements: ["Workshop Coordinator", "Art Competition Manager", "Cultural Ambassador"]
    }
  ]
}

const MemberCard = ({ member, index }: { member: any, index: number }) => {
  const [isHovered, setIsHovered] = useState(false)

  const getRoleIcon = (role: string) => {
    if (role.includes('Dean')) return <Crown className="h-5 w-5 text-yellow-600" />
    if (role.includes('General')) return <Shield className="h-5 w-5 text-blue-600" />
    if (role.includes('Sports')) return <Trophy className="h-5 w-5 text-green-600" />
    if (role.includes('Technical')) return <Code className="h-5 w-5 text-purple-600" />
    if (role.includes('Cultural')) return <Palette className="h-5 w-5 text-pink-600" />
    return <User className="h-5 w-5 text-gray-600" />
  }

  const getRoleColor = (role: string) => {
    if (role.includes('Dean')) return "border-yellow-300 bg-yellow-50"
    if (role.includes('General')) return "border-blue-300 bg-blue-50"
    if (role.includes('Sports')) return "border-green-300 bg-green-50"
    if (role.includes('Technical')) return "border-purple-300 bg-purple-50"
    if (role.includes('Cultural')) return "border-pink-300 bg-pink-50"
    return "border-gray-300 bg-gray-50"
  }

  return (
    <Card 
      className={`
        hover-lift cursor-pointer border-2 ${getRoleColor(member.role)} bg-white shadow-lg
        transform transition-all duration-500 hover:scale-105 hover:shadow-2xl
        ${isHovered ? 'glow-neon-green' : ''}
      `}
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="text-center pb-4">
        <div className="relative mx-auto mb-4">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-neon-green/20 to-electric-blue/20 p-1">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              <User className="h-12 w-12 text-gray-400" />
            </div>
          </div>
          {member.achievements.includes('Event Organizer') && (
            <div className="absolute -top-2 -right-2">
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs glow-gold">
                <Star className="h-3 w-3 mr-1" />
                Leader
              </Badge>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <CardTitle className="text-lg text-gray-900">{member.name}</CardTitle>
          <div className="flex items-center justify-center gap-2">
            {getRoleIcon(member.role)}
            <CardDescription className="text-sm font-medium text-gray-700">
              {member.role}
            </CardDescription>
          </div>
          <div className="text-xs text-gray-500">
            {member.department} • {member.year}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 mb-4 text-center leading-relaxed">
          {member.bio}
        </p>
        
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1 justify-center">
            {member.achievements.slice(0, 2).map((achievement: string, idx: number) => (
              <Badge key={idx} variant="outline" className="text-xs text-gray-600 border-gray-300">
                {achievement}
              </Badge>
            ))}
          </div>
          
          <div className="flex justify-center gap-2 pt-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
              onClick={() => window.open(`mailto:${member.email}`)}
            >
              <Mail className="h-4 w-4" />
            </Button>
            {member.linkedin && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                onClick={() => window.open(`https://linkedin.com/in/${member.linkedin}`)}
              >
                <Linkedin className="h-4 w-4" />
              </Button>
            )}
            {member.twitter && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-gray-500 hover:text-blue-400 hover:bg-blue-50"
                onClick={() => window.open(`https://twitter.com/${member.twitter}`)}
              >
                <Twitter className="h-4 w-4" />
              </Button>
            )}
            {member.instagram && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-gray-500 hover:text-pink-600 hover:bg-pink-50"
                onClick={() => window.open(`https://instagram.com/${member.instagram}`)}
              >
                <Instagram className="h-4 w-4" />
              </Button>
            )}
            {member.github && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                onClick={() => window.open(`https://github.com/${member.github}`)}
              >
                <Github className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const HeroSection = () => {
  const [currentText, setCurrentText] = useState(0)
  const texts = [
    "The Heart of Campus Life",
    "Leading with Excellence",
    "Building Tomorrow's Leaders",
    "Inspiring Innovation"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 via-electric-blue/5 to-pink-500/5">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-2 h-2 bg-neon-green/20 rounded-full"></div>
          <div className="absolute top-20 right-20 w-3 h-3 bg-electric-blue/20 rounded-full"></div>
          <div className="absolute bottom-20 left-20 w-2 h-2 bg-pink-500/20 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-3 h-3 bg-neon-green/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-electric-blue/20 rounded-full"></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-pink-500/20 rounded-full"></div>
        </div>
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-6">
          <Badge className="bg-gradient-to-r from-neon-green to-electric-blue text-white px-4 py-2 text-sm font-semibold glow-neon-green">
            <Users className="h-4 w-4 mr-2" />
            Student Council 2024
          </Badge>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-neon-green via-electric-blue to-pink-500 bg-clip-text text-transparent animate-fade-in">
          Meet the Student Council of XIE
        </h1>
        
        <div className="h-16 flex items-center justify-center mb-6">
          <p className="text-xl md:text-2xl text-gray-600 transition-all duration-500 animate-fade-in">
            {texts[currentText]}
          </p>
        </div>
        
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed animate-fade-in">
          The team that organizes, leads, and represents the spirit of Xavier Institute of Engineering.
        </p>
        
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
            <span>12 Active Members</span>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <span>4 Departments</span>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <span>50+ Events Organized</span>
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-neon-green/20 rounded-full animate-bounce"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-electric-blue/20 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-20 left-20 w-3 h-3 bg-pink-500/20 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
    </div>
  )
}

const StatsSection = () => {
  const stats = [
    { icon: <Users className="h-8 w-8" />, value: "12", label: "Council Members", color: "text-blue-600" },
    { icon: <Award className="h-8 w-8" />, value: "50+", label: "Events Organized", color: "text-green-600" },
    { icon: <Heart className="h-8 w-8" />, value: "1000+", label: "Students Served", color: "text-pink-600" },
    { icon: <Zap className="h-8 w-8" />, value: "4", label: "Active Departments", color: "text-purple-600" }
  ]

  return (
    <div className="py-16 bg-gradient-to-r from-white via-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center group hover:scale-105 transition-all duration-300"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <div className={`${stat.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AboutPage() {
  const [selectedTab, setSelectedTab] = useState("core")
  const [viewMode, setViewMode] = useState("grid")

  const tabData = [
    { id: "core", label: "Core Leadership", icon: <Crown className="h-4 w-4" />, members: councilMembers.core },
    { id: "sports", label: "Sports Council", icon: <Trophy className="h-4 w-4" />, members: councilMembers.sports },
    { id: "technical", label: "Technical Council", icon: <Code className="h-4 w-4" />, members: councilMembers.technical },
    { id: "cultural", label: "Cultural Council", icon: <Palette className="h-4 w-4" />, members: councilMembers.cultural }
  ]

  return (
    <div className="min-h-screen bg-tech-light">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Leadership Team</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Meet the dedicated individuals who work tirelessly to enhance campus life and student experience at XIE.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg border border-gray-200">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "gradient-primary text-white" : "text-gray-600"}
            >
              Grid View
            </Button>
            <Button
              variant={viewMode === "hierarchy" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("hierarchy")}
              className={viewMode === "hierarchy" ? "gradient-primary text-white" : "text-gray-600"}
            >
              Hierarchy View
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white border border-gray-300 shadow-sm">
            {tabData.map((tab) => (
              <TabsTrigger 
                key={tab.id}
                value={tab.id}
                className="tab-glow data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-green/10 data-[state=active]:to-electric-blue/10 data-[state=active]:text-gray-900 data-[state=active]:border-neon-green/30 data-[state=active]:glow-neon-green"
              >
                <div className="flex items-center gap-2">
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabData.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tab.label}</h3>
                <p className="text-gray-600">
                  {tab.members.length} dedicated members leading {tab.label.toLowerCase()} initiatives
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tab.members.map((member, index) => (
                  <MemberCard 
                    key={member.id} 
                    member={member} 
                    index={index}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-neon-green/5 to-electric-blue/5 border border-neon-green/20 shadow-lg">
            <CardContent className="py-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Join Our Community</h3>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Interested in becoming part of the Student Council? We're always looking for passionate students who want to make a difference on campus.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="gradient-primary text-white px-8 py-3 hover:shadow-lg transition-all duration-300">
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Us
                </Button>
                <Button variant="outline" className="px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Users className="h-5 w-5 mr-2" />
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
