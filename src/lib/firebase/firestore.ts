import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
  documentId,
  Timestamp,
  orderBy
} from 'firebase/firestore';
import { db } from './config';
import type { CampusEvent, Registration } from '../types';

export const getEvents = async (): Promise<CampusEvent[]> => {
  const eventsCol = collection(db, 'events');
  const q = query(eventsCol, orderBy('createdAt', 'desc'));
  const eventSnapshot = await getDocs(q);
  return eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CampusEvent));
};

export const getEventById = async (id: string): Promise<CampusEvent | null> => {
  const eventDocRef = doc(db, 'events', id);
  const eventSnap = await getDoc(eventDocRef);
  if (eventSnap.exists()) {
    return { id: eventSnap.id, ...eventSnap.data() } as CampusEvent;
  }
  return null;
};

export const registerForEvent = async (userId: string, eventId: string) => {
  const registrationsCol = collection(db, 'registrations');
  await addDoc(registrationsCol, {
    userId,
    eventId,
    timestamp: serverTimestamp(),
  });
};

export const getUserRegistrations = async (userId: string): Promise<Registration[]> => {
  const registrationsCol = collection(db, 'registrations');
  const q = query(registrationsCol, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Registration));
};

export const checkIfRegistered = async (userId: string, eventId: string): Promise<boolean> => {
  const registrationsCol = collection(db, 'registrations');
  const q = query(registrationsCol, where('userId', '==', userId), where('eventId', '==', eventId));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

export const getEventsByIds = async (ids: string[]): Promise<CampusEvent[]> => {
    if (ids.length === 0) return [];
    const eventsRef = collection(db, "events");
    const q = query(eventsRef, where(documentId(), "in", ids));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as CampusEvent);
};