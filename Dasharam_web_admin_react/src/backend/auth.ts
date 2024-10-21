import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";


export const login = async (name: string, password: string) => {
  try {
    const q = query(collection(db, "Admin"), where("name", "==", name));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const adminDoc = querySnapshot.docs[0]; // there's only one admin with this name
      const adminData = adminDoc.data();
      
      if (adminData.password === password) {
        return adminData;
      }
    }

    const q1 = query(collection(db, "teachers"), where("grNo", "==", name));
    const querySnapshot1 = await getDocs(q1);

    if (!querySnapshot1.empty) {
      const teacherDoc = querySnapshot1.docs[0]; // there's only one teacher with this name
      const teacherData = teacherDoc.data();
      
      if (teacherData.password === password) {
      return { ...teacherData, id: teacherDoc.id };
      }
    }
  } catch (error) {
    console.log(error);
    return error;
  }

  return null;
};
