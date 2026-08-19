import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, name, email, phone, country, requirement, subject, message } = body;

    const senderName = name || `${firstName || ''} ${lastName || ''}`.trim();
    const emailSubject = subject || requirement || 'General Contact Inquiry';

    // Server-side validation
    if (!senderName) {
      return NextResponse.json({ error: 'First name or name is required.' }, { status: 400 });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL || 'msanya08602@gmail.com';

    // Check if API key is present and not a placeholder
    if (!apiKey || apiKey.includes('placeholder')) {
      console.log('RESEND_API_KEY is not configured yet. Returning fallback dev response.');
      return NextResponse.json({
        success: true,
        message: 'Form validated successfully! (Note: Add your live RESEND_API_KEY in Vercel/.env.local to send live emails).'
      });
    }

    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: 'Anushka Mall Portfolio <onboarding@resend.dev>',
      to: recipientEmail,
      replyTo: email,
      subject: `[Portfolio Contact] ${emailSubject} from ${senderName}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 24px; background-color: #f9f9f9; color: #333; max-width: 600px; margin: 0 auto; border-radius: 12px; border: 1px solid #e0e0e0;">
          <h2 style="color: #0f1f2b; margin-top: 0; border-bottom: 2px solid #67c6c8; padding-bottom: 10px;">New Portfolio Contact Message</h2>
          <p style="font-size: 15px; margin-bottom: 8px;"><strong>From:</strong> ${senderName}</p>
          <p style="font-size: 15px; margin-bottom: 8px;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #67c6c8;">${email}</a></p>
          ${phone ? `<p style="font-size: 15px; margin-bottom: 8px;"><strong>Phone:</strong> ${phone}</p>` : ''}
          ${country ? `<p style="font-size: 15px; margin-bottom: 8px;"><strong>Country:</strong> ${country}</p>` : ''}
          ${emailSubject ? `<p style="font-size: 15px; margin-bottom: 8px;"><strong>Requirement / Subject:</strong> ${emailSubject}</p>` : ''}
          
          <h3 style="color: #0f1f2b; margin-top: 20px; margin-bottom: 8px;">Message:</h3>
          <div style="background: #ffffff; padding: 16px; border-radius: 8px; border-left: 4px solid #67c6c8; font-size: 14px; white-space: pre-wrap;">${message}</div>
          
          <footer style="margin-top: 24px; font-size: 12px; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 12px;">
            Sent from your Graphic Designer Portfolio Website
          </footer>
        </div>
      `
    });

    if (error) {
      console.error('Resend Email Error:', error);
      return NextResponse.json({ error: error.message || 'Failed to send email via Resend.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Contact API Error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error.' }, { status: 500 });
  }
}
