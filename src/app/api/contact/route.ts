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
      return NextResponse.json({ success: false, error: 'First name is required.' }, { status: 400 });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Please enter your message.' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL || 'msanya086@gmail.com';

    // Server-side environment variable check
    if (!apiKey || apiKey.trim() === '' || apiKey.includes('placeholder')) {
      console.warn('[SERVER LOG] RESEND_API_KEY environment variable is missing or unconfigured.');
      return NextResponse.json({
        success: false,
        error: 'Unable to send your message. Please try again.'
      }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: 'Anushka Portfolio <onboarding@resend.dev>',
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
      console.error('[SERVER LOG] Resend API Error details:', error);
      return NextResponse.json({
        success: false,
        error: 'Unable to send your message. Please try again.'
      }, { status: 500 });
    }

    console.log('[SERVER LOG] Email successfully sent via Resend API:', data);
    return NextResponse.json({
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
      data
    });
  } catch (err: any) {
    console.error('[SERVER LOG] Contact API Internal Error:', err);
    return NextResponse.json({
      success: false,
      error: 'Unable to send your message. Please try again.'
    }, { status: 500 });
  }
}
