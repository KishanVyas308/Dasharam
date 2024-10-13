import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";


export const login = async (name: string, password: string) => {
  try {
    const q = query(collection(db, "Admin"), where("name", "==", name));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const adminDoc = querySnapshot.docs[0]; // Assuming there's only one admin with this name
      const adminData = adminDoc.data();
      
      if (adminData.password === password) {
        return adminData;
      }
    }
  } catch (error) {
    console.log(error);
    return error;
  }

  return null;
};
