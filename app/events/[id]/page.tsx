import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Trophy, ArrowLeft } from "lucide-react"
import { formatDate, getMedalEmoji } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"

export const revalidate = 60

async function getEvent(id: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*, fests(*)')
    .eq('id', id)
    .single()
  
  return data
}

async function getWinners(eventId: string) {
  const { data, error } = await supabase
    .from('winners')
    .select('*')
    .eq('event_id', eventId)
    .order('medal', { ascending: true })
  
  return data || []
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id)
  
  if (!event) {
    notFound()
  }

  const winners = await getWinners(params.id)

  const goldWinners = winners.filter(w => w.medal === 'gold')
  const silverWinners = winners.filter(w => w.medal === 'silver')
  const bronzeWinners = winners.filter(w => w.medal === 'bronze')

  const WinnerCard = ({ winner }: { winner: any }) => (
    <div className="p-4 border rounded-lg bg-card">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold text-lg">{winner.student_name}</div>
          <div className="text-sm text-muted-foreground">{winner.class_name}</div>
          <div className="text-sm text-muted-foreground">{winner.department}</div>
        </div>
        <div className="text-3xl">{getMedalEmoji(winner.medal)}</div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/events">
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Button>
      </Link>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <Badge className="mb-2">
                {event.fests.type.charAt(0).toUpperCase() + event.fests.type.slice(1)}
              </Badge>
              <CardTitle className="text-3xl mb-2">{event.name}</CardTitle>
              <CardDescription className="text-base">{event.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Fest:</span>
              <span>{event.fests.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Date:</span>
              <span>{formatDate(event.event_date)}</span>
            </div>
            {event.venue && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Venue:</span>
                <span>{event.venue}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Winners</h2>
        
        {winners.length > 0 ? (
          <div className="space-y-6">
            {goldWinners.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  🥇 Gold Medal
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {goldWinners.map(winner => (
                    <WinnerCard key={winner.id} winner={winner} />
                  ))}
                </div>
              </div>
            )}

            {silverWinners.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  🥈 Silver Medal
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {silverWinners.map(winner => (
                    <WinnerCard key={winner.id} winner={winner} />
                  ))}
                </div>
              </div>
            )}

            {bronzeWinners.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  🥉 Bronze Medal
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bronzeWinners.map(winner => (
                    <WinnerCard key={winner.id} winner={winner} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No winners announced yet for this event.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
