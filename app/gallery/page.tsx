"use client"

import { fetchAllGalleryImages, fetchAllFests } from "@/lib/fetch-functions"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { ImageIcon, Calendar, Sparkles, Camera, X, ZoomIn } from "lucide-react"
import dynamic from "next/dynamic"
import ThreeDCarousel, { ThreeDCarouselItem } from "@/components/three-d-carousel"
import { ThreeDMarquee, MarqueeImage } from "@/components/three-d-marquee"
import { useState, useEffect } from "react"

// Dynamically import the 3D component (client-side only)
const ThreeDImageRing = dynamic(
  () => import("@/components/ui/three-d-image-ring"),
  { ssr: false }
)

export const revalidate = 60

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([])
  const [fests, setFests] = useState<any[]>([])
  const [selectedImage, setSelectedImage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>('all')
  const [showGalleryModal, setShowGalleryModal] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // Use our new fetch functions
        const [galleryResult, festsResult] = await Promise.all([
          fetchAllGalleryImages(),
          fetchAllFests()
        ])
        
        if (galleryResult.error) {
          console.error('Error fetching gallery:', galleryResult.error)
        } else {
          setImages(galleryResult.data || [])
        }
        
        if (festsResult.error) {
          console.error('Error fetching fests:', festsResult.error)
        } else {
          setFests(festsResult.data || [])
        }
      } catch (error) {
        console.error('Error loading gallery data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const getFestColor = (type: string) => {
    switch (type) {
      case 'cultural': return 'from-pink-500 to-rose-500'
      case 'technical': return 'from-blue-500 to-cyan-500'
      case 'sports': return 'from-green-500 to-emerald-500'
      default: return 'from-purple-500 to-indigo-500'
    }
  }

  const handleCarouselClick = (festId: string) => {
    setActiveTab(festId)
    setShowGalleryModal(true)
  }

  const ImageCard = ({ image, index }: { image: any, index: number }) => (
    <div 
      className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 hover:scale-105 cursor-pointer"
      style={{
        animation: `fadeInUp 0.6s ease-out ${index * 0.05}s both`
      }}
      onClick={() => setSelectedImage(image)}
    >
      {/* Image Container with Overlay */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
        {image.image_url ? (
          <>
            <Image
              src={image.image_url}
              alt={image.title}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Hover Content */}
            <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
              <div className="text-white">
                <h3 className="font-bold text-xl mb-2 drop-shadow-lg">{image.title}</h3>
                {image.description && (
                  <p className="text-sm text-gray-200 drop-shadow-md line-clamp-2">
                    {image.description}
                  </p>
                )}
              </div>
            </div>

            {/* Sparkle Effect on Hover */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
            </div>

            {/* Zoom Icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/30">
              <div className="bg-white/90 dark:bg-gray-800/90 p-4 rounded-full shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
                <ZoomIn className="h-8 w-8 text-primary" />
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
            <Camera className="h-16 w-16 text-gray-400 animate-pulse" />
          </div>
        )}
      </div>

      {/* Card Footer */}
      <CardContent className="p-4 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg truncate flex-1 group-hover:text-primary transition-colors">
            {image.title}
          </h3>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {image.fests && (
            <Badge 
              className={`bg-gradient-to-r ${getFestColor(image.fests.type)} text-white border-0 shadow-md hover:shadow-lg transition-shadow`}
            >
              {image.fests.name}
            </Badge>
          )}
          {image.events && (
            <Badge variant="outline" className="border-2 hover:bg-accent transition-colors">
              {image.events.name}
            </Badge>
          )}
        </div>
      </CardContent>

      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  )

  // Prepare carousel items from images grouped by fest
  const carouselItems: ThreeDCarouselItem[] = fests.slice(0, 6).map(fest => {
    const festImages = images.filter(img => img.fest_id === fest.id)
    const firstImage = festImages[0]
    return {
      id: fest.id,
      title: fest.name,
      brand: fest.type.charAt(0).toUpperCase() + fest.type.slice(1) + ' Fest',
      description: fest.description || `Explore ${festImages.length} amazing photos from ${fest.name}`,
      tags: [fest.type, `${festImages.length} Photos`],
      imageUrl: firstImage?.image_url || '/images/events/xie_event_1.jpg',
      link: `#${fest.id}`
    }
  })

  // Fallback carousel items
  const defaultCarouselItems: ThreeDCarouselItem[] = [
    {
      id: '1',
      title: 'Cultural Extravaganza',
      brand: 'Spandan 2024',
      description: 'Experience the vibrant cultural performances, traditional dances, and artistic expressions that make Spandan unforgettable',
      tags: ['Cultural', 'Dance', 'Music'],
      imageUrl: '/images/events/xie_event_1.jpg',
      link: '/events'
    },
    {
      id: '2',
      title: 'Tech Innovation Hub',
      brand: 'Transmission 2024',
      description: 'Witness cutting-edge technology, innovative projects, and brilliant minds showcasing the future of engineering',
      tags: ['Technical', 'Innovation', 'Robotics'],
      imageUrl: '/images/events/xie_event_2.jpg',
      link: '/events'
    },
    {
      id: '3',
      title: 'Sports Championship',
      brand: 'Sparx 2024',
      description: 'Celebrating athletic excellence, team spirit, and competitive sportsmanship across various sporting events',
      tags: ['Sports', 'Athletics', 'Competition'],
      imageUrl: '/images/home_events/WhatsApp Image 2025-10-18 at 16.24.06_d60c6742.jpg',
      link: '/events'
    },
  ]

  const displayCarouselItems = carouselItems.length > 0 ? carouselItems : defaultCarouselItems

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
            <Camera className="absolute inset-0 m-auto h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">Loading Gallery...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="container mx-auto px-4 py-16 relative">
        {/* Hero Header */}
        <div className="text-center mb-16 relative">
          {/* Decorative Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <Camera className="h-96 w-96 text-primary animate-pulse" />
          </div>
          
          <div className="relative space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-full border border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
              <Sparkles className="h-5 w-5 text-primary animate-spin-slow" />
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ✨ Memories Captured Forever
              </span>
              <Sparkles className="h-5 w-5 text-pink-500 animate-spin-slow" />
            </div>

            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
                <span className="inline-block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                  Event Gallery
                </span>
              </h1>
              
              {/* Decorative Line */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-1 w-20 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full" />
                <Camera className="h-6 w-6 text-purple-500" />
                <div className="h-1 w-20 bg-gradient-to-r from-transparent via-pink-500 to-transparent rounded-full" />
              </div>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-medium">
                Relive the <span className="text-blue-600 font-bold">magic</span> of our fests through{" "}
                <span className="text-purple-600 font-bold">stunning photographs</span> and{" "}
                <span className="text-pink-600 font-bold">unforgettable moments</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {images.length > 0 ? `${images.length}+ Photos` : 'Coming Soon'}
                </span>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">Explore Memories</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Image Ring Showcase */}
        <div className="mb-20 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-full border border-primary/20 shadow-lg mb-6">
              <Camera className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                360° Gallery View
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Immersive Photo Experience
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Drag to rotate and explore our gallery in stunning 3D
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-700">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
              <div className="relative h-[500px] md:h-[600px]">
                <ThreeDImageRing
                  images={images.slice(0, 10).map(img => img.image_url).filter(Boolean).length > 0 
                    ? images.slice(0, 10).map(img => img.image_url).filter(Boolean)
                    : [
                        '/images/events/xie_event_1.jpg',
                        '/images/events/xie_event_2.jpg',
                        '/images/home_events/WhatsApp Image 2025-10-18 at 16.24.06_d60c6742.jpg',
                        '/images/home_events/WhatsApp Image 2025-10-18 at 16.24.08_a8cec1dc.jpg',
                        '/images/home_events/WhatsApp Image 2025-10-18 at 16.24.09_36e345de.jpg',
                        '/images/home_events/WhatsApp Image 2025-10-18 at 16.24.09_ab1dbd5f.jpg',
                        '/images/home_events/WhatsApp Image 2025-10-18 at 16.27.41_473908fb.jpg',
                        '/images/home_events/WhatsApp Image 2025-10-18 at 16.27.41_65d7fb79.jpg',
                        '/images/home_events/WhatsApp Image 2025-10-18 at 16.27.42_850db995.jpg',
                      ]
                  }
                  width={350}
                  perspective={2000}
                  imageDistance={550}
                  initialRotation={180}
                  animationDuration={1.8}
                  staggerDelay={0.12}
                  hoverOpacity={0.4}
                  draggable={true}
                  mobileScaleFactor={0.7}
                  backgroundColor="transparent"
                  containerClassName="h-full"
                  imageClassName="rounded-xl shadow-2xl border-4 border-white/20"
                />
              </div>
              <div className="absolute bottom-8 left-0 right-0 text-center">
                <p className="text-white/80 text-sm font-medium backdrop-blur-sm bg-black/30 inline-block px-6 py-2 rounded-full">
                  ✨ Drag to rotate • Hover to focus
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Carousel Showcase */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Featured Moments
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Swipe through our most memorable event highlights
            </p>
          </div>
          <ThreeDCarousel
            items={displayCarouselItems}
            autoRotate={true}
            rotateInterval={5000}
            cardHeight={500}
            onCardClick={(item) => handleCarouselClick(item.id)}
          />
        </div>

        {/* 3D Marquee Showcase */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Gallery in Motion
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience our photos in a stunning 3D animated grid
            </p>
          </div>
          
          <ThreeDMarquee
            images={
              images.length > 0
                ? images.slice(0, 16).map(img => ({
                    src: img.image_url,
                    alt: img.title,
                  }))
                : [
                    { src: '/images/events/xie_event_1.jpg', alt: 'XIE Event 1' },
                    { src: '/images/events/xie_event_2.jpg', alt: 'XIE Event 2' },
                    { src: '/images/home_events/WhatsApp Image 2025-10-18 at 16.24.06_d60c6742.jpg', alt: 'Home Event 1' },
                    { src: '/images/home_events/WhatsApp Image 2025-10-18 at 16.24.08_a8cec1dc.jpg', alt: 'Home Event 2' },
                    { src: '/images/home_events/WhatsApp Image 2025-10-18 at 16.24.09_36e345de.jpg', alt: 'Home Event 3' },
                    { src: '/images/home_events/WhatsApp Image 2025-10-18 at 16.24.09_ab1dbd5f.jpg', alt: 'Home Event 4' },
                    { src: '/images/home_events/WhatsApp Image 2025-10-18 at 16.27.41_473908fb.jpg', alt: 'Home Event 5' },
                    { src: '/images/home_events/WhatsApp Image 2025-10-18 at 16.27.41_65d7fb79.jpg', alt: 'Home Event 6' },
                    { src: '/images/home_events/WhatsApp Image 2025-10-18 at 16.27.42_850db995.jpg', alt: 'Home Event 7' },
                    { src: '/images/events/xie_event_1.jpg', alt: 'XIE Event 1 (Repeat)' },
                    { src: '/images/events/xie_event_2.jpg', alt: 'XIE Event 2 (Repeat)' },
                    { src: '/images/home_events/WhatsApp Image 2025-10-18 at 16.24.06_d60c6742.jpg', alt: 'Home Event 1 (Repeat)' },
                    { src: '/images/home_events/WhatsApp Image 2025-10-18 at 16.24.08_a8cec1dc.jpg', alt: 'Home Event 2 (Repeat)' },
                    { src: '/images/home_events/WhatsApp Image 2025-10-18 at 16.24.09_36e345de.jpg', alt: 'Home Event 3 (Repeat)' },
                    { src: '/images/home_events/WhatsApp Image 2025-10-18 at 16.24.09_ab1dbd5f.jpg', alt: 'Home Event 4 (Repeat)' },
                    { src: '/images/home_events/WhatsApp Image 2025-10-18 at 16.27.41_473908fb.jpg', alt: 'Home Event 5 (Repeat)' },
                  ]
            }
            cols={4}
            onImageClick={(image, index) => {
              const actualImage = images[index % images.length];
              if (actualImage) {
                setSelectedImage(actualImage);
              }
            }}
            className="shadow-2xl border border-gray-200 dark:border-gray-800"
          />
        </div>

        {/* Stats Bar */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Card className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <div className="text-3xl font-bold text-blue-600">{images.length}</div>
              <div className="text-sm text-blue-600/80">Total Photos</div>
            </Card>
            <Card className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <div className="text-3xl font-bold text-purple-600">{fests.length}</div>
              <div className="text-sm text-purple-600/80">Fests Covered</div>
            </Card>
            <Card className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="text-3xl font-bold text-green-600">
                {new Set(images.map(img => img.event_id).filter(Boolean)).size}
              </div>
              <div className="text-sm text-green-600/80">Events</div>
            </Card>
            <Card className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <div className="text-3xl font-bold text-orange-600">∞</div>
              <div className="text-sm text-orange-600/80">Memories</div>
            </Card>
          </div>
        )}

        {/* Gallery Modal */}
        {showGalleryModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-300">
            <div className="min-h-screen p-4 md:p-8">
              {/* Close Button */}
            <button
              onClick={() => setShowGalleryModal(false)}
              className="fixed top-4 right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110"
              aria-label="Close gallery modal"
            >
              <X className="h-6 w-6 text-white" />
            </button>

              {/* Modal Content */}
              <div className="max-w-7xl mx-auto pt-16">
                <div className="text-center mb-12">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                    Complete Gallery
                  </h2>
                  <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
                    Click on any photo to view in full screen
                  </p>
                </div>

                {/* Filter Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-white dark:bg-gray-900 shadow-xl p-2 rounded-2xl border border-gray-200 dark:border-gray-700">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl px-8 py-3 font-semibold transition-all duration-300"
                >
                  <ImageIcon className="h-5 w-5 mr-2" />
                  All Photos
                </TabsTrigger>
                {fests.map(fest => (
                  <TabsTrigger 
                    key={fest.id} 
                    value={fest.id}
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl px-8 py-3 font-semibold transition-all duration-300"
                  >
                    {fest.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* All Photos Tab */}
            <TabsContent value="all" className="mt-0">
              {images.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {images.map((image, index) => (
                    <ImageCard key={image.id} image={image} index={index} />
                  ))}
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-2 border-dashed border-blue-300 dark:border-blue-700">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute top-20 right-20 w-40 h-40 bg-purple-400 rounded-full blur-3xl animate-pulse delay-1000" />
                    <div className="absolute bottom-10 left-1/3 w-36 h-36 bg-pink-400 rounded-full blur-3xl animate-pulse delay-2000" />
                  </div>

                  <div className="relative py-24 px-8 text-center">
                    <div className="relative inline-block mb-8">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl opacity-30 animate-pulse" />
                      <div className="relative bg-white dark:bg-gray-800 p-8 rounded-full shadow-2xl">
                        <Camera className="h-24 w-24 text-blue-500 animate-pulse" />
                        <Sparkles className="h-10 w-10 text-yellow-400 absolute -top-2 -right-2 animate-bounce" />
                        <Sparkles className="h-8 w-8 text-pink-400 absolute -bottom-2 -left-2 animate-bounce delay-1000" />
                      </div>
                    </div>

                    <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      No Photos Yet
                    </h3>

                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                      The gallery is waiting to be filled with <span className="font-bold text-blue-600">amazing moments</span>!
                    </p>

                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                      <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-md border border-blue-200 dark:border-blue-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Awaiting Memories</span>
                      </div>
                     
                      <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-md border border-pink-200 dark:border-pink-700">
                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse delay-2000" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Stay Tuned</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 mt-8">
                      <div className="h-1 w-16 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full" />
                      <Camera className="h-5 w-5 text-purple-400" />
                      <div className="h-1 w-16 bg-gradient-to-r from-transparent via-pink-400 to-transparent rounded-full" />
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
                      ✨ Check back soon for stunning event photos
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Fest-specific Tabs */}
            {fests.map(fest => (
              <TabsContent key={fest.id} value={fest.id} className="mt-0">
                {images.filter(img => img.fest_id === fest.id).length > 0 ? (
                  <>
                    {/* Fest Header */}
                    <div className={`mb-8 p-8 rounded-2xl bg-gradient-to-r ${getFestColor(fest.type)} text-white shadow-xl relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-3">
                          <Sparkles className="h-6 w-6" />
                          <h2 className="text-3xl font-bold">{fest.name}</h2>
                        </div>
                        <p className="text-white/90 mb-4">{fest.description}</p>
                        <div className="flex items-center gap-2 text-white/80">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">
                            {new Date(fest.start_date).toLocaleDateString()} - {new Date(fest.end_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {images
                        .filter(img => img.fest_id === fest.id)
                        .map((image, index) => (
                          <ImageCard key={image.id} image={image} index={index} />
                        ))}
                    </div>
                  </>
                ) : (
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-2 border-dashed border-blue-300 dark:border-blue-700">
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl animate-pulse" />
                      <div className="absolute top-20 right-20 w-40 h-40 bg-purple-400 rounded-full blur-3xl animate-pulse delay-1000" />
                      <div className="absolute bottom-10 left-1/3 w-36 h-36 bg-pink-400 rounded-full blur-3xl animate-pulse delay-2000" />
                    </div>

                    <div className="relative py-24 px-8 text-center">
                      <div className="relative inline-block mb-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl opacity-30 animate-pulse" />
                        <div className="relative bg-white dark:bg-gray-800 p-8 rounded-full shadow-2xl">
                          <Camera className="h-24 w-24 text-blue-500 animate-pulse" />
                          <Sparkles className="h-10 w-10 text-yellow-400 absolute -top-2 -right-2 animate-bounce" />
                          <Sparkles className="h-8 w-8 text-pink-400 absolute -bottom-2 -left-2 animate-bounce delay-1000" />
                        </div>
                      </div>

                      <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        No Photos for {fest.name}
                      </h3>

                      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                        Photos from this <span className="font-bold text-purple-600">{fest.type}</span> fest will appear here soon!
                      </p>

                      <div className="flex flex-wrap justify-center gap-3 mb-8">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-md border border-blue-200 dark:border-blue-700">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Awaiting Memories</span>
                        </div>
                      
                      </div>

                      <div className="flex items-center justify-center gap-4 mt-8">
                        <div className="h-1 w-16 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full" />
                        <Camera className="h-5 w-5 text-purple-400" />
                        <div className="h-1 w-16 bg-gradient-to-r from-transparent via-pink-400 to-transparent rounded-full" />
                      </div>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
                        ✨ Check back soon for stunning event photos
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
              </div>
            </div>
          </div>
        )}

        {/* Expandable Image Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-300"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110 z-10"
              onClick={() => setSelectedImage(null)}
              aria-label="Close image modal"
            >
              <X className="h-6 w-6 text-white" />
            </button>

            <div 
              className="relative max-w-7xl max-h-[90vh] w-full animate-in zoom-in duration-500"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={selectedImage.image_url}
                  alt={selectedImage.title}
                  width={1920}
                  height={1080}
                  className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                />
              </div>

              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-8 rounded-b-2xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-white mb-3">
                      {selectedImage.title}
                    </h2>
                    {selectedImage.description && (
                      <p className="text-gray-200 text-lg mb-4">
                        {selectedImage.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3">
                      {selectedImage.fests && (
                        <Badge className={`bg-gradient-to-r ${getFestColor(selectedImage.fests.type)} text-white border-0 text-base px-4 py-2`}>
                          <Sparkles className="h-4 w-4 mr-2" />
                          {selectedImage.fests.name}
                        </Badge>
                      )}
                      {selectedImage.events && (
                        <Badge className="bg-white/20 text-white border-2 border-white/40 text-base px-4 py-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          {selectedImage.events.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  )
}
