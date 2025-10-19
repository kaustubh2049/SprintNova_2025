"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { AdminAuthCheck } from "@/components/admin-auth-check"

function AdminFestsContent() {
  const [fests, setFests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingFest, setEditingFest] = useState<any>(null)

  const [formData, setFormData] = useState({
    name: '',
    type: 'cultural' as 'cultural' | 'technical' | 'sports',
    description: '',
    start_date: '',
    end_date: '',
    banner_url: ''
  })

  useEffect(() => {
    loadFests()
  }, [])

  const loadFests = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('fests')
      .select('*')
      .order('start_date', { ascending: false })
    
    if (data) setFests(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingFest) {
      const { error } = await supabase
        .from('fests')
        .update(formData)
        .eq('id', editingFest.id)
    } else {
      const { error } = await supabase
        .from('fests')
        .insert([formData])
    }

    setDialogOpen(false)
    resetForm()
    loadFests()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this fest?')) {
      await supabase.from('fests').delete().eq('id', id)
      loadFests()
    }
  }

  const handleEdit = (fest: any) => {
    setEditingFest(fest)
    setFormData({
      name: fest.name,
      type: fest.type,
      description: fest.description,
      start_date: fest.start_date,
      end_date: fest.end_date,
      banner_url: fest.banner_url || ''
    })
    setDialogOpen(true)
  }

  const resetForm = () => {
    setEditingFest(null)
    setFormData({
      name: '',
      type: 'cultural',
      description: '',
      start_date: '',
      end_date: '',
      banner_url: ''
    })
  }

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Fest Management</h1>
          <p className="text-muted-foreground">Add, edit, or delete fests</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Fest
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingFest ? 'Edit Fest' : 'Add New Fest'}</DialogTitle>
              <DialogDescription>
                {editingFest ? 'Update fest details' : 'Create a new fest'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Fest Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="cultural">Cultural</option>
                  <option value="technical">Technical</option>
                  <option value="sports">Sports</option>
                </select>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="banner_url">Banner URL (optional)</Label>
                <Input
                  id="banner_url"
                  type="url"
                  value={formData.banner_url}
                  onChange={(e) => setFormData({...formData, banner_url: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingFest ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {fests.map(fest => (
          <Card key={fest.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle>{fest.name}</CardTitle>
                    <Badge>{fest.type}</Badge>
                  </div>
                  <CardDescription>{fest.description}</CardDescription>
                  <p className="text-sm text-muted-foreground mt-2">
                    {new Date(fest.start_date).toLocaleDateString()} - {new Date(fest.end_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(fest)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(fest.id)}>
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

export default function AdminFestsPage() {
  return (
    <AdminAuthCheck>
      <AdminFestsContent />
    </AdminAuthCheck>
  )
}
