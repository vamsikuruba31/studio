
import type { Timestamp } from 'firebase/firestore';

// This is the shape of the data stored in Firestore
export interface EventData {
  id: string;
  title: string;
  description: string;
  date: Timestamp;
  department: string;
  tags: string[];
  posterUrl: string;
  createdBy: string;
  createdAt: Timestamp;
}

// This is the shape of the data passed from the form to the addEvent function
export interface EventDataInput {
  title: string;
  description: string;
  date: Date;
  time: string;
  department: string;
  tags: string[];
  createdBy: string;
  posterUrl: string;
}
