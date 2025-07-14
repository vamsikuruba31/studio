import type { Timestamp } from 'firebase/firestore';

export interface EventData {
  id: string;
  title: string;
  description: string;
  date: Timestamp | Date;
  time: string;
  department: string;
  tags: string[];
  posterUrl: string;
  createdBy: string;
  createdAt: Timestamp;
}
