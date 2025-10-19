"use client"

import { useState, useEffect } from "react"
import { AdminAuthCheck } from "@/components/admin-auth-check"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Mail, Send, Clock } from "lucide-react"
import { supabase } from "@/lib/supabase"

function AdminEmailsContent() {
  const [emailLogs, setEmailLogs] = useState<any[]>([])
  const [drafts, setDrafts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [sending, setSending] = useState(false)

  const [formData, setFormData] = useState({
    draft_id: '',
    subject: '',
    recipients: '',
    customMessage: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const [logsData, draftsData] = await Promise.all([
      supabase.from('email_logs').select('*').order('sent_at', { ascending: false }).limit(50),
      supabase.from('drafts').select('*').eq('status', 'published').order('published_at', { ascending: false })
    ])
    
    if (logsData.data) setEmailLogs(logsData.data)
    if (draftsData.data) setDrafts(draftsData.data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)

    try {
      const recipients = formData.recipients.split(',').map(email => email.trim())
      
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draft_id: formData.draft_id || null,
          subject: formData.subject,
          recipients,
          customMessage: formData.customMessage
        })
      })

      const result = await response.json()

      if (result.success) {
        alert('Email sent successfully!')
        setDialogOpen(false)
        resetForm()
        loadData()
      } else {
        alert('Failed to send email: ' + result.error)
      }
    } catch (error) {
      alert('Error sending email')
    } finally {
      setSending(false)
    }
  }

  const resetForm = () => {
    setFormData({
      draft_id: '',
      subject: '',
      recipients: '',
      customMessage: ''
    })
  }

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Email Management</h1>
          <p className="text-muted-foreground">Send emails and view email history</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Send className="h-4 w-4" />
              Send Email
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Send Email</DialogTitle>
              <DialogDescription>
                Send an email to council members, faculty, or CRs
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="draft_id">Select Draft (optional)</Label>
                <select
                  id="draft_id"
                  value={formData.draft_id}
                  onChange={(e) => {
                    const draft = drafts.find(d => d.id === e.target.value)
                    setFormData({
                      ...formData, 
                      draft_id: e.target.value,
                      subject: draft ? draft.title : formData.subject
                    })
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">No draft (custom email)</option>
                  {drafts.map(draft => (
                    <option key={draft.id} value={draft.id}>{draft.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="recipients">Recipients (comma-separated emails)</Label>
                <textarea
                  id="recipients"
                  placeholder="email1@example.com, email2@example.com"
                  value={formData.recipients}
                  onChange={(e) => setFormData({...formData, recipients: e.target.value})}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <Label htmlFor="customMessage">Custom Message (optional)</Label>
                <textarea
                  id="customMessage"
                  placeholder="Add a custom message to include with the draft..."
                  value={formData.customMessage}
                  onChange={(e) => setFormData({...formData, customMessage: e.target.value})}
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={sending}>
                  {sending ? 'Sending...' : 'Send Email'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Email Templates */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Email Templates</CardTitle>
          <CardDescription>Common recipient groups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Council Members</h3>
              <p className="text-sm text-muted-foreground mb-2">
                All student council members
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Use Template
              </Button>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Faculty Advisors</h3>
              <p className="text-sm text-muted-foreground mb-2">
                All faculty advisors
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Use Template
              </Button>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Class Representatives</h3>
              <p className="text-sm text-muted-foreground mb-2">
                All CRs from all classes
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Use Template
              </Button>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Email History */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Email History</h2>
        <div className="space-y-4">
          {emailLogs.length > 0 ? (
            emailLogs.map(log => (
              <Card key={log.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="h-4 w-4" />
                        <CardTitle className="text-lg">{log.subject}</CardTitle>
                        <Badge variant={log.status === 'sent' ? 'default' : 'destructive'}>
                          {log.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {new Date(log.sent_at).toLocaleString()}
                        </div>
                        <div className="mt-1">
                          Recipients: {log.recipients.length} email(s)
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No emails sent yet.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminEmailsPage() {
  return (
    <AdminAuthCheck>
      <AdminEmailsContent />
    </AdminAuthCheck>
  )
}
