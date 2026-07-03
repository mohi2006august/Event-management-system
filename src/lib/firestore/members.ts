import { adminDb } from '../firebase-admin';

// This file is a mocked version of the 'members' typed Firestore helper pattern
// you mentioned, to establish the baseline convention for events.ts to follow.

export interface Member {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  createdAt: number;
}

const MEMBERS_COLLECTION = 'members';

export async function getMember(id: string): Promise<Member | null> {
  const doc = await adminDb.collection(MEMBERS_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Member;
}

export async function createMember(data: Omit<Member, 'id' | 'createdAt'>): Promise<Member> {
  const docRef = adminDb.collection(MEMBERS_COLLECTION).doc();
  const member: Member = {
    id: docRef.id,
    ...data,
    createdAt: Date.now(),
  };
  await docRef.set(member);
  return member;
}
