import { type Timestamp } from "firebase/firestore";

export interface CampusUser {
  uid: string;
  name: string;
  email: string;
  department: string;
  year: string;
  joinedAt: Timestamp;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  department: string;
  tags: string[];
  posterUrl: string;
  createdBy: string;
  createdAt: Timestamp;
}

export interface Registration {
  id: string;
  userId: string;
  eventId: string;
  timestamp: Timestamp;
}
