'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  Send, 
  Clock, 
  Eye, 
  Upload, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  FileText, 
  Download, 
  CheckCircle, 
  AlertCircle,
  Plus,
  ChevronDown,
  ChevronUp,
  Mail,
  Users,
  Bell,
  Star,
  Loader2
} from "lucide-react"
import { formatDate } from "@/lib/utils"
import { fetchAllNotices, fetchRecentNotices } from "@/lib/fetch-functions"

// Mock data for demonstration
const mockNotices = [
  {
    id: 1,
    subject: "Spandan 2024 - Cultural Fest Registration Open",
    message: "Dear Students, We are excited to announce that registration for Spandan 2024, our annual cultural fest, is now open! The fest will feature various competitions including dance, music, drama, and art exhibitions. Registration deadline: March 15, 2024. For more details, contact the cultural committee.",
    preview: "Dear Students, We are excited to announce that registration for Spandan 2024, our annual cultural fest, is now open! The fest will feature various competitions...",
    date: "2024-02-20T10:30:00Z",
    sender: "Student Council Office",
    category: "announcement",
    fest: "spandan",
    isNew: true,
    attachments: ["spandan-2024-brochure.pdf"],
    recipients: "all_students"
  },
  {
    id: 2,
    subject: "Transmission 2024 - Technical Project Submissions",
    message: "Attention all technical enthusiasts! Transmission 2024 is calling for innovative project submissions. Categories include: Software Development, Hardware Projects, AI/ML Applications, and IoT Solutions. Submit your projects by March 10, 2024. Winners will receive certificates and cash prizes.",
    preview: "Attention all technical enthusiasts! Transmission 2024 is calling for innovative project submissions. Categories include: Software Development, Hardware Projects...",
    date: "2024-02-18T14:15:00Z",
    sender: "Technical Committee",
    category: "announcement",
    fest: "transmission",
    isNew: false,
    attachments: ["transmission-2024-guidelines.pdf"],
    recipients: "all_students"
  },
  {
    id: 3,
    subject: "Sparx 2024 - Sports Tournament Results",
    message: "Congratulations to all participants! Here are the final results for Sparx 2024 sports tournaments: Basketball - 1st: CSE Department, 2nd: IT Department, 3rd: ECE Department. Football - 1st: ECE Department, 2nd: CSE Department, 3rd: IT Department. Well done everyone!",
    preview: "Congratulations to all participants! Here are the final results for Sparx 2024 sports tournaments: Basketball - 1st: CSE Department...",
    date: "2024-02-15T16:45:00Z",
    sender: "Sports Committee",
    category: "results",
    fest: "sparx",
    isNew: false,
    attachments: ["sparx-2024-results.pdf"],
    recipients: "all_students"
  },
  {
    id: 4,
    subject: "General Notice - Library Hours Extended",
    message: "Due to upcoming examinations, the library will remain open until 10:00 PM from Monday to Friday, starting March 1, 2024. Students are encouraged to make use of the extended hours for their studies. Please maintain silence and follow library rules.",
    preview: "Due to upcoming examinations, the library will remain open until 10:00 PM from Monday to Friday, starting March 1, 2024...",
    date: "2024-02-12T09:00:00Z",
    sender: "Library Administration",
    category: "general",
    fest: null,
    isNew: false,
    attachments: [],
    recipients: "all_students"
  }
]

const mockMailHistory = [
  { id: 1, subject: "Spandan 2024 Registration", status: "sent", date: "2024-02-20T10:30:00Z", recipients: 150 },
  { id: 2, subject: "Transmission Project Guidelines", status: "sent", date: "2024-02-18T14:15:00Z", recipients: 120 },
  { id: 3, subject: "Sparx Results Announcement", status: "sent", date: "2024-02-15T16:45:00Z", recipients: 200 },
  { id: 4, subject: "Library Hours Notice", status: "scheduled", date: "2024-02-12T09:00:00Z", recipients: 180 },
  { id: 5, subject: "Exam Schedule Update", status: "failed", date: "2024-02-10T11:20:00Z", recipients: 0 }
]

const NoticeCard = ({ notice, onViewFull }: { notice: any, onViewFull: (notice: any) => void }) => {
  const festColors: { [key: string]: string } = {
    spandan: "border-pink-500 bg-pink-50",
    transmission: "border-blue-500 bg-blue-50",
    sparx: "border-green-500 bg-green-50",
    general: "border-gray-500 bg-gray-50"
  }

  const categoryColors: { [key: string]: string } = {
    announcement: "bg-blue-100 text-blue-700 border-blue-300",
    results: "bg-green-100 text-green-700 border-green-300",
    general: "bg-gray-100 text-gray-700 border-gray-300"
  }

  return (
    <Card 
      className={`hover-lift cursor-pointer border-l-4 ${festColors[notice.fest || 'general']} bg-white shadow-lg hover:shadow-xl transition-all duration-300`}
      onClick={() => onViewFull(notice)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg text-gray-900">{notice.subject}</CardTitle>
              {notice.isNew && (
                <Badge className="bg-gradient-to-r from-neon-green to-electric-blue text-white text-xs font-bold glow-neon-green">
                  NEW
                </Badge>
              )}
            </div>
            <CardDescription className="text-gray-600 text-sm">
              {notice.preview}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={categoryColors[notice.category]}>
              {notice.category.charAt(0).toUpperCase() + notice.category.slice(1)}
            </Badge>
            {notice.fest && (
              <Badge className="bg-gradient-to-r from-neon-green to-electric-blue text-white text-xs">
                {notice.fest.charAt(0).toUpperCase() + notice.fest.slice(1)}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{notice.sender}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(notice.date)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {notice.attachments.length > 0 && (
              <div className="flex items-center gap-1 text-blue-600">
                <FileText className="h-4 w-4" />
                <span>{notice.attachments.length}</span>
              </div>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              className="gradient-primary text-white border-0 hover:shadow-lg"
              onClick={(e) => {
                e.stopPropagation()
                onViewFull(notice)
              }}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const NoticeModal = ({ notice, isOpen, onClose }: { notice: any, isOpen: boolean, onClose: () => void }) => {
  if (!notice) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white border-gray-300 text-gray-900">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl text-gray-900 mb-2">{notice.subject}</DialogTitle>
              <DialogDescription className="text-gray-600">
                From: {notice.sender} • {formatDate(notice.date)}
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-gradient-to-r from-neon-green to-electric-blue text-white">
                {notice.category.charAt(0).toUpperCase() + notice.category.slice(1)}
              </Badge>
              {notice.fest && (
                <Badge className="bg-gray-100 text-gray-700 border-gray-300">
                  {notice.fest.charAt(0).toUpperCase() + notice.fest.slice(1)}
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{notice.message}</p>
          </div>
          
          {notice.attachments.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-electric-blue" />
                Attachments
              </h3>
              <div className="space-y-2">
                {notice.attachments.map((attachment: string, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{attachment}</span>
                    </div>
                    <Button size="sm" variant="outline" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

const ComposeForm = ({ onSubmit, onPreview, onSchedule }: { 
  onSubmit: (data: any) => void, 
  onPreview: (data: any) => void,
  onSchedule: (data: any) => void 
}) => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    recipients: 'all_students',
    attachments: [] as string[],
    scheduledDate: '',
    scheduledTime: ''
  })

  const [isScheduled, setIsScheduled] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isScheduled) {
      onSchedule(formData)
    } else {
      onSubmit(formData)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files.map(f => f.name)]
    }))
  }

  return (
    <Card className="bg-white shadow-lg border border-gray-200">
      <CardHeader className="gradient-primary/5 border-b border-gray-200">
        <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
          <Mail className="h-5 w-5 text-neon-green" />
          Compose New Notice
        </CardTitle>
        <CardDescription className="text-gray-600">
          Send official notices and announcements to students and faculty
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
            <Input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-neon-green focus:ring-2 focus:ring-neon-green/20"
              placeholder="Enter notice subject"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recipients *</label>
            <Select value={formData.recipients} onValueChange={(value) => setFormData({...formData, recipients: value})}>
              <SelectTrigger className="w-full p-3 border border-gray-300 rounded-lg focus:border-neon-green focus:ring-2 focus:ring-neon-green/20">
                <SelectValue placeholder="Select recipients" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                <SelectItem value="all_students" className="text-gray-900">All Students</SelectItem>
                <SelectItem value="all_faculty" className="text-gray-900">All Faculty</SelectItem>
                <SelectItem value="council_members" className="text-gray-900">Council Members</SelectItem>
                <SelectItem value="crs" className="text-gray-900">Class Representatives</SelectItem>
                <SelectItem value="custom" className="text-gray-900">Custom Email List</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
            <Textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-neon-green focus:ring-2 focus:ring-neon-green/20 min-h-[200px]"
              placeholder="Enter your notice message here..."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Attachments (Optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-neon-green transition-colors">
              <input 
                type="file" 
                className="hidden" 
                id="file-upload" 
                multiple 
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-gray-500">
                  <Upload className="mx-auto h-12 w-12 mb-4 text-gray-400" />
                  <p className="text-sm">Click to upload files or drag and drop</p>
                  <p className="text-xs text-gray-400">PDF, DOC, JPG, PNG up to 10MB each</p>
                </div>
              </label>
            </div>
            {formData.attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                    <span className="text-sm text-gray-700">{file}</span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        attachments: prev.attachments.filter((_, i) => i !== index)
                      }))}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isScheduled}
                onChange={(e) => setIsScheduled(e.target.checked)}
                className="rounded border-gray-300 text-neon-green focus:ring-neon-green"
              />
              <span className="text-sm text-gray-700">Schedule for later</span>
            </label>
          </div>
          
          {isScheduled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <Input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-neon-green focus:ring-2 focus:ring-neon-green/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <Input
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-neon-green focus:ring-2 focus:ring-neon-green/20"
                />
              </div>
            </div>
          )}
          
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              onClick={() => onPreview(formData)}
              className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              type="submit"
              className="flex-1 gradient-primary text-white hover:shadow-lg transition-all duration-300"
            >
              {isScheduled ? (
                <>
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Now
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

const MailHistory = ({ history }: { history: any[] }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-700 border-green-300'
      case 'scheduled': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'failed': return 'bg-red-100 text-red-700 border-red-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle className="h-4 w-4" />
      case 'scheduled': return <Clock className="h-4 w-4" />
      case 'failed': return <AlertCircle className="h-4 w-4" />
      default: return <Mail className="h-4 w-4" />
    }
  }

  return (
    <Card className="bg-white shadow-lg border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
          <Mail className="h-5 w-5 text-electric-blue" />
          Mail History
        </CardTitle>
        <CardDescription className="text-gray-600">
          Track your sent notices and their status
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="space-y-2">
          {history.map((item) => (
            <div key={item.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.subject}</h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span>{formatDate(item.date)}</span>
                    <span>{item.recipients} recipients</span>
                  </div>
                </div>
                <Badge className={getStatusColor(item.status)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(item.status)}
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </div>
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function NoticesPage() {
  const [selectedTab, setSelectedTab] = useState("compose")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [festFilter, setFestFilter] = useState("all")
  const [selectedNotice, setSelectedNotice] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isComposeCollapsed, setIsComposeCollapsed] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [notices, setNotices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch notices from Supabase
  useEffect(() => {
    async function loadNotices() {
      try {
        setLoading(true)
        const { data, error } = await fetchAllNotices()
        
        if (error) {
          setError('Failed to load notices')
          console.error('Error fetching notices:', error)
          return
        }

        // Transform Supabase data to match our notice format
        const transformedNotices = data?.map((notice: any) => ({
          id: notice.id,
          subject: notice.title,
          message: notice.content,
          preview: notice.content.substring(0, 150) + '...',
          date: notice.published_at || notice.created_at,
          sender: notice.created_by || 'Student Council',
          category: 'announcement', // Default category
          fest: null, // Could be determined from content analysis
          isNew: new Date(notice.published_at || notice.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          attachments: notice.file_url ? [notice.file_url] : [],
          recipients: 'all_students'
        })) || []

        setNotices(transformedNotices)
      } catch (err) {
        setError('Failed to load notices')
        console.error('Error loading notices:', err)
      } finally {
        setLoading(false)
      }
    }

    loadNotices()
  }, [])

  const handleNoticeView = (notice: any) => {
    setSelectedNotice(notice)
    setIsModalOpen(true)
  }

  const handleSendNotice = (data: any) => {
    console.log('Sending notice:', data)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handlePreviewNotice = (data: any) => {
    console.log('Previewing notice:', data)
    // Open preview modal
  }

  const handleScheduleNotice = (data: any) => {
    console.log('Scheduling notice:', data)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = searchQuery === "" || 
      notice.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.sender.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = categoryFilter === "all" || notice.category === categoryFilter
    const matchesFest = festFilter === "all" || notice.fest === festFilter
    
    return matchesSearch && matchesCategory && matchesFest
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-tech-light flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-neon-green mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading notices...</p>
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
            Notice & Email System
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Compose and send official notices, or browse recent announcements from the Student Council
          </p>
        </div>

        {/* Success Notification */}
        {showSuccess && (
          <div className="fixed top-4 right-4 z-50 bg-white border border-green-300 rounded-lg shadow-lg p-4 animate-fade-in">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Notice sent successfully!</span>
            </div>
          </div>
        )}

        <div className="w-full">
          {/* Notice Board - Full Width */}
          <div className="w-full">
            <Card className="bg-white shadow-lg border border-gray-200">
              <CardHeader className="gradient-primary/5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                      <Bell className="h-5 w-5 text-neon-green" />
                      Recent Notices & Announcements
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Stay updated with the latest news and announcements
                    </CardDescription>
                  </div>
                  <Badge className="bg-gradient-to-r from-neon-green to-electric-blue text-white">
                    {filteredNotices.length} notices
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search notices..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-neon-green focus:ring-neon-green shadow-sm"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full md:w-48 bg-white border-gray-300 text-gray-900 shadow-sm">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300">
                      <SelectItem value="all" className="text-gray-900">All Categories</SelectItem>
                      <SelectItem value="announcement" className="text-gray-900">Announcements</SelectItem>
                      <SelectItem value="results" className="text-gray-900">Results</SelectItem>
                      <SelectItem value="general" className="text-gray-900">General</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={festFilter} onValueChange={setFestFilter}>
                    <SelectTrigger className="w-full md:w-48 bg-white border-gray-300 text-gray-900 shadow-sm">
                      <SelectValue placeholder="Fest" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300">
                      <SelectItem value="all" className="text-gray-900">All Fests</SelectItem>
                      <SelectItem value="spandan" className="text-gray-900">Spandan</SelectItem>
                      <SelectItem value="transmission" className="text-gray-900">Transmission</SelectItem>
                      <SelectItem value="sparx" className="text-gray-900">Sparx</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Notices List */}
                <div className="space-y-4">
                  {filteredNotices.length > 0 ? (
                    filteredNotices.map(notice => (
                      <NoticeCard 
                        key={notice.id} 
                        notice={notice} 
                        onViewFull={handleNoticeView}
                      />
                    ))
                  ) : (
                    <Card className="bg-white border-gray-300 shadow-lg">
                      <CardContent className="py-12 text-center">
                        <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg">No notices found matching your criteria</p>
                        <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mail History - Admin Only */}
        <div className="mt-8">
          <MailHistory history={mockMailHistory} />
        </div>

        {/* Notice Modal */}
        <NoticeModal 
          notice={selectedNotice} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </div>
    </div>
  )
}
