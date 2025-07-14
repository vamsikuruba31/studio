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
        const eventCollection = collection(db, 'events');
        await addDoc(eventCollection, {
            ...eventData,
            date: Timestamp.fromDate(eventData.date), // Convert JS Date to Firestore Timestamp here
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error adding event to Firestore: ', error);
        throw new Error('Could not create event.');
    }
}

export const getEvents = async (): Promise<EventData[]> => {
    try {
        const eventsCollection = collection(db, 'events');
        const q = query(eventsCollection, orderBy('date', 'asc'));
        const querySnapshot = await getDocs(q);
        const events = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as EventData));
        return events;
    } catch (error) {
        console.error('Error getting events: ', error);
        throw new Error('Could not fetch events.');
    }
}
