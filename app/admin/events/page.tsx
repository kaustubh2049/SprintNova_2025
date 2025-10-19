"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { AdminAuthCheck } from "@/components/admin-auth-check"

function AdminEventsContent() {
  const [events, setEvents] = useState<any[]>([])
  const [fests, setFests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<any>(null)

  const [formData, setFormData] = useState({
    fest_id: '',
    name: '',
    description: '',
    event_date: '',
    venue: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const [eventsData, festsData] = await Promise.all([
      supabase.from('events').select('*, fests(*)').order('event_date', { ascending: false }),
      supabase.from('fests').select('*').order('name')
    ])
    
    if (eventsData.data) setEvents(eventsData.data)
    if (festsData.data) setFests(festsData.data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingEvent) {
      await supabase.from('events').update(formData).eq('id', editingEvent.id)
    } else {
      await supabase.from('events').insert([formData])
    }

    setDialogOpen(false)
    resetForm()
    loadData()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure? This will also delete all winners for this event.')) {
      await supabase.from('events').delete().eq('id', id)
      loadData()
    }
  }

  const handleEdit = (event: any) => {
    setEditingEvent(event)
    setFormData({
      fest_id: event.fest_id,
      name: event.name,
      description: event.description,
      event_date: event.event_date,
      venue: event.venue || ''
    })
    setDialogOpen(true)
  }

  const resetForm = () => {
    setEditingEvent(null)
    setFormData({
      fest_id: '',
      name: '',
      description: '',
      event_date: '',
      venue: ''
    })
  }

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Event Management</h1>
          <p className="text-muted-foreground">Add, edit, or delete events</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
              <DialogDescription>
                {editingEvent ? 'Update event details' : 'Create a new event'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fest_id">Fest</Label>
                <select
                  id="fest_id"
                  value={formData.fest_id}
                  onChange={(e) => setFormData({...formData, fest_id: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select a fest</option>
                  {fests.map(fest => (
                    <option key={fest.id} value={fest.id}>{fest.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="name">Event Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <Label htmlFor="event_date">Event Date</Label>
                <Input
                  id="event_date"
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="venue">Venue (optional)</Label>
                <Input
                  id="venue"
                  value={formData.venue}
                  onChange={(e) => setFormData({...formData, venue: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingEvent ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {events.map(event => (
          <Card key={event.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{event.name}</CardTitle>
                  <CardDescription className="mt-2">{event.description}</CardDescription>
                  <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                    <span>Fest: {event.fests?.name}</span>
                    <span>Date: {new Date(event.event_date).toLocaleDateString()}</span>
                    {event.venue && <span>Venue: {event.venue}</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(event)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(event.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function AdminEventsPage() {
  return (
    <AdminAuthCheck>
      <AdminEventsContent />
    </AdminAuthCheck>
  )
}
