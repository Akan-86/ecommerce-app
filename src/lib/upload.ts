import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export async function uploadImageToStorage(file: File): Promise<string> {
  const timestamp = Date.now();
  const fileRef = ref(storage, `products/${timestamp}-${file.name}`);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  return url;
}
