import { SignJWT, jwtVerify } from 'jose';

// Secret key for signing tickets. Must be a 32+ char string in .env
const secret = new TextEncoder().encode(
  process.env.TICKET_SIGNING_SECRET || 'default-insecure-secret-key-for-dev-only-min-32-chars'
);

export interface TicketPayload {
  eventId: string;
  userId: string;
  registrationId: string;
}

/**
 * Generates a signed JWT ticket code containing the event and user ID.
 */
export async function generateTicketCode(payload: TicketPayload): Promise<string> {
  const jwt = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .sign(secret);
  
  return jwt;
}

/**
 * Verifies a ticket code and returns its payload if valid.
 * Throws an error if invalid, expired, or tampered.
 */
export async function verifyTicketCode(token: string): Promise<TicketPayload> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      eventId: payload.eventId as string,
      userId: payload.userId as string,
      registrationId: payload.registrationId as string,
    };
  } catch (error) {
    throw new Error('INVALID_TICKET');
  }
}
