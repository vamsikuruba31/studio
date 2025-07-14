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
        if (!eventData.date || !eventData.time) {
            throw new Error("Date or time is missing.");
        }
        
        const [hours, minutes] = eventData.time.split(':');
        const combinedDate = new Date(eventData.date);
        combinedDate.setHours(parseInt(hours, 10));
        combinedDate.setMinutes(parseInt(minutes, 10));

        const eventCollection = collection(db, 'events');
        const dataToSave = {
            ...eventData,
            date: Timestamp.fromDate(combinedDate), 
            createdAt: serverTimestamp(),
        };
        // Remove time property as it's merged into date
        delete (dataToSave as Partial<EventDataInput>).time;

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
