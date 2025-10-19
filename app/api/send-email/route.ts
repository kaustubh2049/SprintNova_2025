import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { sendEmail } from '@/lib/email'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId || !process.env.ADMIN_USER_IDS?.split(',').includes(userId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { draft_id, subject, recipients, customMessage } = await request.json()

    if (!subject || !recipients || recipients.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let emailContent = customMessage || ''
    let draftContent = ''

    // If draft_id is provided, fetch the draft content
    if (draft_id) {
      const { data: draft } = await supabase
        .from('drafts')
        .select('*')
        .eq('id', draft_id)
        .single()

      if (draft) {
        draftContent = draft.content
      }
    }

    // Build HTML email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(to right, #2563eb, #9333ea); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .custom-message { background: white; padding: 20px; margin-bottom: 20px; border-left: 4px solid #2563eb; border-radius: 4px; }
            .draft-content { background: white; padding: 20px; border-radius: 4px; white-space: pre-wrap; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏆 XIE Student Council</h1>
              <p>Xavier Institute of Engineering</p>
            </div>
            <div class="content">
              ${customMessage ? `<div class="custom-message"><p>${customMessage.replace(/\n/g, '<br>')}</p></div>` : ''}
              ${draftContent ? `<div class="draft-content">${draftContent.replace(/\n/g, '<br>')}</div>` : ''}
              <div class="footer">
                <p>This is an official communication from XIE Student Council</p>
                <p>&copy; ${new Date().getFullYear()} Xavier Institute of Engineering</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    // Send email
    const result = await sendEmail({
      to: recipients,
      subject,
      html: htmlContent
    })

    // Log email
    await supabaseAdmin.from('email_logs').insert([{
      draft_id: draft_id || null,
      subject,
      recipients,
      sent_at: new Date().toISOString(),
      status: result.success ? 'sent' : 'failed'
    }])

    if (result.success) {
      return NextResponse.json({ success: true, messageId: result.messageId })
    } else {
      return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 })
    }
  } catch (error) {
    console.error('Email API error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
