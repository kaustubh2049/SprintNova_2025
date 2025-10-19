"use client"

import { useState, useEffect } from "react"
import { AdminAuthCheck } from "@/components/admin-auth-check"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Send } from "lucide-react"
import { supabase } from "@/lib/supabase"

function AdminDraftsContent() {
  const [drafts, setDrafts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingDraft, setEditingDraft] = useState<any>(null)

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    file_url: '',
    status: 'draft' as 'draft' | 'published'
  })

  useEffect(() => {
    loadDrafts()
  }, [])

  const loadDrafts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('drafts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setDrafts(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const data = {
      ...formData,
      created_by: 'admin',
      published_at: formData.status === 'published' ? new Date().toISOString() : null
    }
    
    if (editingDraft) {
      await supabase.from('drafts').update(data).eq('id', editingDraft.id)
    } else {
      await supabase.from('drafts').insert([data])
    }

    setDialogOpen(false)
    resetForm()
    loadDrafts()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this draft?')) {
      await supabase.from('drafts').delete().eq('id', id)
      loadDrafts()
    }
  }

  const handlePublish = async (draft: any) => {
    await supabase
      .from('drafts')
      .update({ 
        status: 'published', 
        published_at: new Date().toISOString() 
      })
      .eq('id', draft.id)
    
    loadDrafts()
  }

  const handleEdit = (draft: any) => {
    setEditingDraft(draft)
    setFormData({
      title: draft.title,
      content: draft.content,
      file_url: draft.file_url || '',
      status: draft.status
    })
    setDialogOpen(true)
  }

  const resetForm = () => {
    setEditingDraft(null)
    setFormData({
      title: '',
      content: '',
      file_url: '',
      status: 'draft'
    })
  }

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Draft Management</h1>
          <p className="text-muted-foreground">Create and publish official notices</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Draft
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingDraft ? 'Edit Draft' : 'Create New Draft'}</DialogTitle>
              <DialogDescription>
                {editingDraft ? 'Update draft details' : 'Create a new official notice'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <Label htmlFor="file_url">Attachment URL (optional)</Label>
                <Input
                  id="file_url"
                  type="url"
                  placeholder="https://your-storage.com/document.pdf"
                  value={formData.file_url}
                  onChange={(e) => setFormData({...formData, file_url: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingDraft ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {drafts.map(draft => (
          <Card key={draft.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle>{draft.title}</CardTitle>
                    <Badge variant={draft.status === 'published' ? 'default' : 'secondary'}>
                      {draft.status}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {draft.content}
                  </CardDescription>
                  <p className="text-xs text-muted-foreground mt-2">
                    {draft.status === 'published' 
                      ? `Published: ${new Date(draft.published_at).toLocaleDateString()}`
                      : `Created: ${new Date(draft.created_at).toLocaleDateString()}`
                    }
                  </p>
                </div>
                <div className="flex gap-2">
                  {draft.status === 'draft' && (
                    <Button variant="outline" size="sm" onClick={() => handlePublish(draft)}>
                      <Send className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => handleEdit(draft)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(draft.id)}>
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

export default function AdminDraftsPage() {
  return (
    <AdminAuthCheck>
      <AdminDraftsContent />
    </AdminAuthCheck>
  )
}
