import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { FileText, Calendar } from "lucide-react"
import { formatDate } from "@/lib/utils"

export const revalidate = 60

async function getDrafts() {
  const { data, error } = await supabase
    .from('drafts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  
  return data || []
}

export default async function DraftsPage() {
  const drafts = await getDrafts()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Official Notices & Drafts</h1>
        <p className="text-muted-foreground">
          View official announcements and notices from the student council
        </p>
      </div>

      {drafts.length > 0 ? (
        <div className="space-y-4">
          {drafts.map(draft => (
            <Link key={draft.id} href={`/drafts/${draft.id}`}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <Badge>Official</Badge>
                      </div>
                      <CardTitle className="text-xl mb-2">{draft.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Published on {formatDate(draft.published_at || draft.created_at)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {draft.content.substring(0, 200)}...
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No notices available yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
