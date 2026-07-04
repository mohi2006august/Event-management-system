import { jsPDF } from 'jspdf';
import type { Event, Attendee, Registration } from '../../types';

export async function generateTicketPDF(
  registration: Registration,
  event: Event,
  attendee: Attendee,
  qrDataUrl: string
): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Background
  doc.setFillColor(245, 247, 250);
  doc.rect(0, 0, 210, 297, 'F');
  
  // Ticket Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(200, 200, 200);
  doc.roundedRect(15, 20, 180, 240, 5, 5, 'FD');
  
  // Header
  doc.setFontSize(28);
  doc.setTextColor(30, 58, 138); // blue-900
  doc.text(event.title, 105, 45, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text('OFFICIAL EVENT TICKET', 105, 55, { align: 'center' });
  
  // Divider
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.line(25, 70, 185, 70);
  
  // Attendee Info
  doc.setFontSize(12);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('ATTENDEE', 30, 85);
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(attendee.name, 30, 95);
  
  doc.setFontSize(12);
  doc.setTextColor(148, 163, 184);
  doc.text('TICKET ID', 120, 85);
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text(registration.ticketId, 120, 95);
  
  // Event Details
  doc.setFontSize(12);
  doc.setTextColor(148, 163, 184);
  doc.text('DATE & TIME', 30, 115);
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  const dateStr = new Date(event.startsAt).toLocaleString();
  doc.text(dateStr, 30, 125);
  
  // QR Code
  doc.addImage(qrDataUrl, 'PNG', 65, 145, 80, 80);
  
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139);
  doc.text('Please present this QR code at the entrance.', 105, 240, { align: 'center' });
  
  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}
