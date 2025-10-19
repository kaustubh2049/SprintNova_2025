import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowLeft, Download } from "lucide-react"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { notFound } from "next/navigation"

export const revalidate = 60

async function getDraft(id: string) {
  const { data, error } = await supabase
    .from('drafts')
    .select('*')
    .eq('id', id)
    .eq('status', 'published')
    .single()
  
  return data
}

export default async function DraftDetailPage({ params }: { params: { id: string } }) {
  const draft = await getDraft(params.id)
  
  if (!draft) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/drafts">
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Notices
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <Badge>Official Notice</Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {formatDate(draft.published_at || draft.created_at)}
            </div>
          </div>
          <CardTitle className="text-3xl">{draft.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-base leading-relaxed">
              {draft.content}
            </div>
          </div>

          {draft.file_url && (
            <div className="pt-6 border-t">
              <h3 className="font-semibold mb-3">Attachments</h3>
              <a href={draft.file_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download Attachment
                </Button>
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
