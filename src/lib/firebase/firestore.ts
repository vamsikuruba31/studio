import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import type { UserData } from '@/types/user';
import type { EventData } from '@/types/event';
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

export const addEvent = async (eventData: Omit<EventData, 'id' | 'createdAt'>) => {
    try {
        const eventCollection = collection(db, 'events');
        await addDoc(eventCollection, {
            ...eventData,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error adding event to Firestore: ', error);
        throw new Error('Could not create event.');
    }
}
