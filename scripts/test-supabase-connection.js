// Test Supabase Connection
// Run this with: node scripts/test-supabase-connection.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('\n🔍 Testing Supabase Connection...\n')

if (!supabaseUrl || supabaseUrl === 'your_supabase_url') {
  console.log('❌ NEXT_PUBLIC_SUPABASE_URL not set in .env file')
  console.log('📝 Please add your Supabase URL to .env file\n')
  process.exit(1)
}

if (!supabaseKey || supabaseKey === 'your_supabase_anon_key') {
  console.log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY not set in .env file')
  console.log('📝 Please add your Supabase anon key to .env file\n')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('✅ Environment variables loaded')
    console.log(`   URL: ${supabaseUrl}`)
    console.log(`   Key: ${supabaseKey.substring(0, 20)}...`)
    console.log('')

    // Test 1: Check fests table
    console.log('📊 Testing fests table...')
    const { data: fests, error: festsError } = await supabase
      .from('fests')
      .select('*')
    
    if (festsError) {
      console.log(`❌ Error fetching fests: ${festsError.message}`)
      console.log('💡 Make sure you ran 01-create-tables.sql\n')
      return
    }
    
    console.log(`✅ Fests table: ${fests.length} records found`)
    if (fests.length > 0) {
      console.log(`   Sample: ${fests[0].name} (${fests[0].type})`)
    }
    console.log('')

    // Test 2: Check events table
    console.log('📊 Testing events table...')
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
    
    if (eventsError) {
      console.log(`❌ Error fetching events: ${eventsError.message}\n`)
      return
    }
    
    console.log(`✅ Events table: ${events.length} records found`)
    if (events.length > 0) {
      console.log(`   Sample: ${events[0].name}`)
    }
    console.log('')

    // Test 3: Check winners table
    console.log('📊 Testing winners table...')
    const { data: winners, error: winnersError } = await supabase
      .from('winners')
      .select('*')
    
    if (winnersError) {
      console.log(`❌ Error fetching winners: ${winnersError.message}\n`)
      return
    }
    
    console.log(`✅ Winners table: ${winners.length} records found`)
    if (winners.length > 0) {
      console.log(`   Sample: ${winners[0].student_name} - ${winners[0].medal} medal`)
    }
    console.log('')

    // Test 4: Check gallery table
    console.log('📊 Testing gallery table...')
    const { data: gallery, error: galleryError } = await supabase
      .from('gallery')
      .select('*')
    
    if (galleryError) {
      console.log(`❌ Error fetching gallery: ${galleryError.message}\n`)
      return
    }
    
    console.log(`✅ Gallery table: ${gallery.length} records found`)
    if (gallery.length > 0) {
      console.log(`   Sample: ${gallery[0].title}`)
    }
    console.log('')

    // Test 5: Check drafts table
    console.log('📊 Testing drafts table...')
    const { data: drafts, error: draftsError } = await supabase
      .from('drafts')
      .select('*')
    
    if (draftsError) {
      console.log(`❌ Error fetching drafts: ${draftsError.message}\n`)
      return
    }
    
    console.log(`✅ Drafts table: ${drafts.length} records found`)
    if (drafts.length > 0) {
      console.log(`   Sample: ${drafts[0].title}`)
    }
    console.log('')

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🎉 Connection Test Summary:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`✅ Fests: ${fests.length}`)
    console.log(`✅ Events: ${events.length}`)
    console.log(`✅ Winners: ${winners.length}`)
    console.log(`✅ Gallery: ${gallery.length}`)
    console.log(`✅ Drafts: ${drafts.length}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    
    if (fests.length === 0) {
      console.log('💡 No data found. Run 02-insert-sample-data.sql to add sample data')
    } else {
      console.log('🎊 Everything looks good! Your database is ready.')
    }
    console.log('')

  } catch (error) {
    console.log('❌ Unexpected error:', error.message)
    console.log('')
  }
}

testConnection()
