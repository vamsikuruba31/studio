
import { doc, setDoc, addDoc, collection, serverTimestamp, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import type { UserData } from '@/types/user';
import type { EventData, EventDataInput } from '@/types/event';
import { db } from './config';

export const addUser = async (userId: string, userData: Omit<UserData, 'uid' | 'joinedAt'>) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      uid: userId,
      ...userData,
      joinedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error adding user to Firestore: ', error);
    throw new Error('Could not create user profile.');
  }
};

export const addEvent = async (eventData: EventDataInput) => {
    try {
        const res = await fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(eventData) });
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body?.error || 'Could not create event.');
        }
        return await res.json();
    } catch (error) {
        console.error('Error adding event: ', error);
        throw error;
    }
}

export const getEvents = async (): Promise<EventData[]> => {
    try {
        const res = await fetch('/api/events');
        if (!res.ok) {
            throw new Error('Could not fetch events');
        }
        const json = await res.json();
        return json.events as EventData[];
    } catch (error) {
        console.error('Error getting events: ', error);
        throw new Error('Could not fetch events.');
    }
}
