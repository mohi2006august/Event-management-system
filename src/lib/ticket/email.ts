import nodemailer from 'nodemailer';
import type { Attendee, Event, Registration } from '../../types';

let testAccount: nodemailer.TestAccount | null = null;
let transporter: nodemailer.Transporter | null = null;

/**
 * Initializes the Nodemailer transporter.
 * Uses SMTP settings from environment if available, otherwise creates an Ethereal test account.
 */
async function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT, 10),
      secure: parseInt(SMTP_PORT, 10) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  } else {
    // Generate a test account for development
    testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
    console.log(`[Email System] Created Ethereal test account: ${testAccount.user}`);
  }

  return transporter;
}

export function composeEmailHTML(attendee: Attendee, event: Event): string {
  const dateStr = new Date(event.startsAt).toLocaleString();
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #1e3a8a;">You're Registered!</h2>
      <p>Hi ${attendee.name},</p>
      <p>You have successfully registered for <strong>${event.title}</strong>.</p>
      
      <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #334155;">Event Details</h3>
        <p><strong>Date & Time:</strong> ${dateStr}</p>
        <p><strong>Description:</strong> ${event.description.substring(0, 100)}...</p>
      </div>

      <p>Please find your official digital ticket attached as a PDF to this email. You will need to show the QR code on the ticket at the entrance to check in.</p>
      
      <p>We look forward to seeing you there!</p>
      
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
      <p style="color: #94a3b8; font-size: 12px; text-align: center;">
        If you have any questions, please reply to this email.
      </p>
    </div>
  `;
}

export async function sendTicketEmail(
  attendee: Attendee,
  event: Event,
  registration: Registration,
  pdfBuffer: Buffer
): Promise<void> {
  const tp = await getTransporter();

  const html = composeEmailHTML(attendee, event);

  const info = await tp.sendMail({
    from: process.env.EMAIL_FROM || '"Event Management Team" <noreply@events.local>',
    to: attendee.email,
    subject: `Your Ticket for ${event.title}`,
    html: html,
    attachments: [
      {
        filename: `ticket-${registration.ticketId}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });

  if (testAccount) {
    console.log(`[Email System] Preview URL for ${attendee.email}: ${nodemailer.getTestMessageUrl(info)}`);
  }
}
