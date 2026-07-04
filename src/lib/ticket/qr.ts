import QRCode from 'qrcode';

/**
 * Generates a unique alphanumeric ticket ID.
 * Format: EVT-{YEAR}-{6 RANDOM ALPHANUMERICS}
 */
export function generateTicketId(): string {
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `EVT-${year}-${randomPart}`;
}

/**
 * Generates a QR code data URI for the given ticket ID.
 * It encodes a verification URL so scanning it directly opens the check-in page.
 */
export async function generateQR(ticketId: string, host: string): Promise<string> {
  const verifyUrl = `${host}/verify/${ticketId}`;
  
  try {
    const dataUrl = await QRCode.toDataURL(verifyUrl, {
      errorCorrectionLevel: 'H',
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    return dataUrl;
  } catch (error) {
    console.error('Failed to generate QR code', error);
    throw new Error('QR_GENERATION_FAILED');
  }
}
