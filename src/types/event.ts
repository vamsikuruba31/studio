
import type { Timestamp } from 'firebase/firestore';

// This is the shape of the data stored and retrieved
export interface EventData {
  id: string;
  title: string;
  description: string;
  date: Date; // Use JS Date object in the application
  department: string;
  tags: string[];
  posterUrl: string;
  createdBy: string;
  createdAt: Date;
}

// This is the shape of the data passed from the form to the addEvent function
export interface EventDataInput {
  title: string;
  description: string;
  date: Date; // Combined date and time from the form
  department: string;
  tags: string[];
  createdBy: string;
  posterUrl: string;
}
