"use client"

import { useState, useEffect } from "react"
import { AdminAuthCheck } from "@/components/admin-auth-check"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { getMedalEmoji } from "@/lib/utils"

function AdminWinnersContent() {
  const [winners, setWinners] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingWinner, setEditingWinner] = useState<any>(null)

  const [formData, setFormData] = useState({
    event_id: '',
    fest_id: '',
    student_name: '',
    class: '',
    department: '',
    medal: 'gold' as 'gold' | 'silver' | 'bronze',
    position: 1
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const [winnersData, eventsData] = await Promise.all([
      supabase.from('winners').select('*, events(name, fests(name))').order('created_at', { ascending: false }),
      supabase.from('events').select('*, fests(name)').order('event_date', { ascending: false })
    ])
    
    if (winnersData.data) setWinners(winnersData.data)
    if (eventsData.data) setEvents(eventsData.data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Get fest_id from selected event
    const selectedEvent = events.find(ev => ev.id === formData.event_id)
    const dataToSubmit = {
      ...formData,
      fest_id: selectedEvent?.fest_id || formData.fest_id
    }
    
    if (editingWinner) {
      await supabase.from('winners').update(dataToSubmit).eq('id', editingWinner.id)
    } else {
      await supabase.from('winners').insert([dataToSubmit])
    }

    setDialogOpen(false)
    resetForm()
    loadData()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this winner?')) {
      await supabase.from('winners').delete().eq('id', id)
      loadData()
    }
  }

  const handleEdit = (winner: any) => {
    setEditingWinner(winner)
    setFormData({
      event_id: winner.event_id,
      fest_id: winner.fest_id,
      student_name: winner.student_name,
      class: winner.class,
      department: winner.department,
      medal: winner.medal,
      position: winner.position || 1
    })
    setDialogOpen(true)
  }

  const resetForm = () => {
    setEditingWinner(null)
    setFormData({
      event_id: '',
      fest_id: '',
      student_name: '',
      class: '',
      department: '',
      medal: 'gold',
      position: 1
    })
  }

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Winner Management</h1>
          <p className="text-muted-foreground">Add, edit, or delete winners</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Winner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingWinner ? 'Edit Winner' : 'Add New Winner'}</DialogTitle>
              <DialogDescription>
                {editingWinner ? 'Update winner details' : 'Add a new winner'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="event_id">Event</Label>
                <select
                  id="event_id"
                  value={formData.event_id}
                  onChange={(e) => setFormData({...formData, event_id: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select an event</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.fests?.name} - {event.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="student_name">Student Name</Label>
                <Input
                  id="student_name"
                  value={formData.student_name}
                  onChange={(e) => setFormData({...formData, student_name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="class">Class</Label>
                <Input
                  id="class"
                  placeholder="e.g., CSE 3A"
                  value={formData.class}
                  onChange={(e) => setFormData({...formData, class: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  placeholder="e.g., Computer Engineering"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="medal">Medal</Label>
                <select
                  id="medal"
                  value={formData.medal}
                  onChange={(e) => setFormData({...formData, medal: e.target.value as any})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="gold">🥇 Gold</option>
                  <option value="silver">🥈 Silver</option>
                  <option value="bronze">🥉 Bronze</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingWinner ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {winners.map(winner => (
          <Card key={winner.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{getMedalEmoji(winner.medal)}</span>
                    <CardTitle className="text-lg">{winner.student_name}</CardTitle>
                  </div>
                  <CardDescription>
                    <div>{winner.class_name}</div>
                    <div>{winner.department}</div>
                    <div className="mt-1 text-xs">
                      {winner.events?.fests?.name} - {winner.events?.name}
                    </div>
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(winner)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(winner.id)}>
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

export default function AdminWinnersPage() {
  return (
    <AdminAuthCheck>
      <AdminWinnersContent />
    </AdminAuthCheck>
  )
}
