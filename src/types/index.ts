// Event Data Model
export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  startsAt: number; // timestamp in ms
  registrationDeadline: number; // timestamp in ms
  capacity: number;
  registeredCount: number;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

// Registration Data Model
export interface Registration {
  id: string; // `${eventId}_${userId}`
  eventId: string;
  userId: string;
  ticketCode: string; // signed token
  status: 'registered' | 'attended' | 'cancelled';
  emailStatus: 'pending' | 'sent' | 'failed';
  registeredAt: number;
  attendedAt?: number;
}
