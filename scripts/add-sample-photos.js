const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Read .env file
const envPath = path.join(__dirname, '..', '.env')
const envContent = fs.readFileSync(envPath, 'utf-8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && valueParts.length) {
    env[key.trim()] = valueParts.join('=').trim()
  }
})

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const samplePhotos = [
  // Sparx (Sports) Photos
  {
    title: 'Basketball Championship',
    description: 'Intense final match of the basketball tournament',
    image_url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    fest_name: 'Sparx',
    event_name: 'Basketball'
  },
  {
    title: 'Cricket Finals',
    description: 'Thrilling cricket match moments',
    image_url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800',
    fest_name: 'Sparx',
    event_name: 'Cricket'
  },
  {
    title: 'Football Tournament',
    description: 'Action-packed football championship',
    image_url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
    fest_name: 'Sparx',
    event_name: 'Football'
  },
  {
    title: 'Athletics Meet',
    description: 'Track and field events showcase',
    image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
    fest_name: 'Sparx',
    event_name: 'Athletics'
  },
  
  // Spandan (Cultural) Photos
  {
    title: 'Classical Dance Performance',
    description: 'Mesmerizing traditional dance showcase',
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    fest_name: 'Spandan',
    event_name: 'Dance'
  },
  {
    title: 'Music Concert',
    description: 'Live band performance at cultural night',
    image_url: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=800',
    fest_name: 'Spandan',
    event_name: 'Music'
  },
  {
    title: 'Drama Competition',
    description: 'Theatrical performances by talented students',
    image_url: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
    fest_name: 'Spandan',
    event_name: 'Drama'
  },
  {
    title: 'Fashion Show',
    description: 'Glamorous fashion show finale',
    image_url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800',
    fest_name: 'Spandan',
    event_name: 'Fashion'
  },
  {
    title: 'Art Exhibition',
    description: 'Student artwork and installations',
    image_url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
    fest_name: 'Spandan',
    event_name: 'Art'
  },
  
  // Transmission (Technical) Photos
  {
    title: 'Robotics Competition',
    description: 'Advanced robotics showcase and battles',
    image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
    fest_name: 'Transmission',
    event_name: 'Robotics'
  },
  {
    title: 'Coding Hackathon',
    description: '24-hour coding marathon',
    image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    fest_name: 'Transmission',
    event_name: 'Hackathon'
  },
  {
    title: 'Tech Exhibition',
    description: 'Innovative projects and prototypes',
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    fest_name: 'Transmission',
    event_name: 'Exhibition'
  },
  {
    title: 'AI Workshop',
    description: 'Machine learning and AI demonstrations',
    image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    fest_name: 'Transmission',
    event_name: 'Workshop'
  },
  {
    title: 'Drone Racing',
    description: 'High-speed drone competition',
    image_url: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800',
    fest_name: 'Transmission',
    event_name: 'Drone Racing'
  },
  {
    title: 'Gaming Tournament',
    description: 'Esports championship finals',
    image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
    fest_name: 'Transmission',
    event_name: 'Gaming'
  },
]

async function addSamplePhotos() {
  console.log('🚀 Starting to add sample photos...\n')

  // Get fests
  const { data: fests } = await supabase.from('fests').select('*')
  if (!fests || fests.length === 0) {
    console.log('❌ No fests found. Please create fests first.')
    return
  }

  // Get events
  const { data: events } = await supabase.from('events').select('*')
  if (!events || events.length === 0) {
    console.log('❌ No events found. Please create events first.')
    return
  }

  console.log(`✅ Found ${fests.length} fests and ${events.length} events\n`)

  let successCount = 0
  let errorCount = 0

  for (const photo of samplePhotos) {
    // Find matching fest
    const fest = fests.find(f => f.name.toLowerCase().includes(photo.fest_name.toLowerCase()))
    if (!fest) {
      console.log(`⚠️  Skipping "${photo.title}" - Fest "${photo.fest_name}" not found`)
      errorCount++
      continue
    }

    // Find matching event
    const event = events.find(e => 
      e.name.toLowerCase().includes(photo.event_name.toLowerCase()) &&
      e.fest_id === fest.id
    )
    if (!event) {
      console.log(`⚠️  Skipping "${photo.title}" - Event "${photo.event_name}" not found`)
      errorCount++
      continue
    }

    // Insert photo
    const { error } = await supabase.from('gallery').insert({
      fest_id: fest.id,
      event_id: event.id,
      title: photo.title,
      description: photo.description,
      image_url: photo.image_url
    })

    if (error) {
      console.log(`❌ Error adding "${photo.title}": ${error.message}`)
      errorCount++
    } else {
      console.log(`✅ Added: ${photo.title} (${photo.fest_name} - ${photo.event_name})`)
      successCount++
    }
  }

  console.log(`\n🎉 Done! Added ${successCount} photos successfully`)
  if (errorCount > 0) {
    console.log(`⚠️  ${errorCount} photos were skipped`)
  }
  console.log('\n📸 Visit http://localhost:3000/gallery to see your photos!')
}

addSamplePhotos().catch(console.error)
