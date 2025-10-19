"use client"

import { useState, useEffect, useRef } from "react"
import { AdminAuthCheck } from "@/components/admin-auth-check"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2, Upload, X, ImageIcon, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Image from "next/image"

function AdminGalleryContent() {
  const [gallery, setGallery] = useState<any[]>([])
  const [fests, setFests] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    fest_id: '',
    event_id: '',
    title: '',
    description: '',
    image_url: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const [galleryData, festsData, eventsData] = await Promise.all([
      supabase.from('gallery').select('*, fests(name), events(name)').order('created_at', { ascending: false }),
      supabase.from('fests').select('*').order('name'),
      supabase.from('events').select('*').order('name')
    ])
    
    if (galleryData.data) setGallery(galleryData.data)
    if (festsData.data) setFests(festsData.data)
    if (eventsData.data) setEvents(eventsData.data)
    setLoading(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        return
      }
      
      setSelectedFile(file)
      
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      
      // Auto-fill title from filename
      const fileName = file.name.split('.')[0]
      setFormData(prev => ({ ...prev, title: fileName }))
    }
  }

  const uploadToSupabase = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `gallery/${fileName}`

    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      throw new Error(`Upload failed: ${error.message}`)
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    return publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile && !formData.image_url) {
      alert('Please select an image file or provide an image URL')
      return
    }

    try {
      setUploading(true)
      setUploadProgress(0)

      let imageUrl = formData.image_url

      // Upload file if selected
      if (selectedFile) {
        setUploadProgress(50)
        imageUrl = await uploadToSupabase(selectedFile)
        setUploadProgress(100)
      }
      
      const data = {
        ...formData,
        event_id: formData.event_id || null,
        image_url: imageUrl
      }
      
      const { error } = await supabase.from('gallery').insert([data])
      
      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      // Show success message
      console.log('Photo uploaded successfully!')
      
      setDialogOpen(false)
      resetForm()
      loadData()
      
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      await supabase.from('gallery').delete().eq('id', id)
      loadData()
    }
  }

  const resetForm = () => {
    setFormData({
      fest_id: '',
      event_id: '',
      title: '',
      description: '',
      image_url: ''
    })
    setSelectedFile(null)
    setPreviewUrl(null)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeSelectedFile = () => {
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Gallery Management</h1>
          <p className="text-muted-foreground">Upload and manage event photos</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Photo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Photo</DialogTitle>
              <DialogDescription>
                Upload a photo to the gallery
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* File Upload Section */}
              <div>
                <Label htmlFor="image_upload">Upload Image</Label>
                <div className="mt-2">
                  {!selectedFile ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <input
                        ref={fileInputRef}
                        type="file"
                        id="image_upload"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <div className="space-y-2">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="text-sm text-gray-600">
                          <label htmlFor="image_upload" className="cursor-pointer">
                            <span className="font-medium text-blue-600 hover:text-blue-500">
                              Click to upload
                            </span>
                            {' '}or drag and drop
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                              {previewUrl && (
                                <Image
                                  src={previewUrl}
                                  alt="Preview"
                                  fill
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {selectedFile.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={removeSelectedFile}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* OR Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>

              {/* Image URL Input */}
              <div>
                <Label htmlFor="image_url">Image URL (Alternative)</Label>
                <Input
                  id="image_url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  disabled={!!selectedFile}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedFile ? 'Disabled when file is selected' : 'Provide a direct image URL'}
                </p>
              </div>

              {/* Fest Selection */}
              <div>
                <Label htmlFor="fest_id">Fest *</Label>
                <select
                  id="fest_id"
                  value={formData.fest_id}
                  onChange={(e) => setFormData({...formData, fest_id: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                  aria-label="Select a fest"
                >
                  <option value="">Select a fest</option>
                  {fests.map(fest => (
                    <option key={fest.id} value={fest.id}>{fest.name}</option>
                  ))}
                </select>
              </div>

              {/* Event Selection */}
              <div>
                <Label htmlFor="event_id">Event (optional)</Label>
                <select
                  id="event_id"
                  value={formData.event_id}
                  onChange={(e) => setFormData({...formData, event_id: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  aria-label="Select an event (optional)"
                >
                  <option value="">Select an event (optional)</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>{event.name}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Describe the photo..."
                />
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={uploading || (!selectedFile && !formData.image_url)}
                  className="min-w-[100px]"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Add Photo
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map(item => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative aspect-video bg-muted">
              {item.image_url && (
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  )}
                  <div className="flex gap-2 mt-2 text-xs">
                    {item.fests && (
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                        {item.fests.name}
                      </span>
                    )}
                    {item.events && (
                      <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded">
                        {item.events.name}
                      </span>
                    )}
                  </div>
                </div>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function AdminGalleryPage() {
  return (
    <AdminAuthCheck>
      <AdminGalleryContent />
    </AdminAuthCheck>
  )
}
