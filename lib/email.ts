import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export async function sendEmail({
  to,
  subject,
  html,
  attachments,
}: {
  to: string[]
  subject: string
  html: string
  attachments?: any[]
}) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: to.join(', '),
      subject,
      html,
      attachments,
    })

    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email sending failed:', error)
    return { success: false, error }
  }
}
