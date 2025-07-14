
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './config';

export const uploadFile = async (file: File | null, path: string): Promise<string | null> => {
  if (!file) {
    // If no file is provided, do not throw an error.
    // Return null to indicate no file was uploaded.
    return null;
  }
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};
