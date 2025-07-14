
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './config';
import type { User } from 'firebase/auth';

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param file The file object to upload.
 * @param path The path in Firebase Storage where the file will be stored.
 * @param user The authenticated Firebase user object.
 * @returns A promise that resolves with the public download URL of the file.
 */
export const uploadFile = async (file: File, path: string, user: User): Promise<string> => {
  if (!user) {
    throw new Error("You must be logged in to upload a file.");
  }
  if (!file) {
    throw new Error("No file provided for upload.");
  }
  const storageRef = ref(storage, path);
  
  await uploadBytes(storageRef, file);
  
  const downloadURL = await getDownloadURL(storageRef);
  
  return downloadURL;
};
