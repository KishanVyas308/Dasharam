import { collection, getDoc, query, where } from "firebase/firestore";
import { db } from "./firebase";

export const login = async (name: string, password: string) => {
  try {
    const q: any = query(collection(db, "admin"), where("name", "==", name));
    const admin: any = await getDoc(q);
    if (admin.exists()) {
      if (admin.data().password === password) {
        return admin.data();
      }
    }
  } catch (error) {
    return error;
  }

  return null;
};
