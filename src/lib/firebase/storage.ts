
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './config';

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param file The file object to upload.
 * @param path The path in Firebase Storage where the file will be stored.
 * @returns A promise that resolves with the public download URL of the file.
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  if (!file) {
    throw new Error("No file provided for upload.");
  }
  const storageRef = ref(storage, path);
  
  // Step 1: Upload the file
  await uploadBytes(storageRef, file);
  
  // Step 2: Get the download URL
  const downloadURL = await getDownloadURL(storageRef);
  
  // Step 3: Return the URL
  return downloadURL;
};
