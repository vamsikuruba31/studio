
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
        
        const dataToSave = {
            ...eventData,
            date: Timestamp.fromDate(eventData.date), 
            createdAt: serverTimestamp(),
        };

        await addDoc(eventCollection, dataToSave);
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
        const events = querySnapshot.docs.map(doc => {
            const data = doc.data();
            // This is a type guard to ensure date is a Timestamp
            const eventDate = data.date instanceof Timestamp ? data.date : new Timestamp(0,0);
            return {
                id: doc.id,
                ...data,
                date: eventDate,
            } as EventData
        });
        // Now, we need to correctly handle the time display on the frontend
        return events.map(event => {
            const date = event.date.toDate();
            const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            return { ...event, time }; // This is for display only, not part of EventData
        });

    } catch (error) {
        console.error('Error getting events: ', error);
        throw new Error('Could not fetch events.');
    }
}
