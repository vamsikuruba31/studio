
import type { Timestamp } from 'firebase/firestore';

export interface UserData {
  uid: string;
  name: string;
  email: string;
  department: string;
  year: number;
  joinedAt: Timestamp;
}
