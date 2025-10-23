
export interface UserData {
  uid: string;
  name: string;
  email: string;
  department?: string;
  year?: number;
  joinedAt?: Date | string | null;
  isAdmin?: boolean;
}
