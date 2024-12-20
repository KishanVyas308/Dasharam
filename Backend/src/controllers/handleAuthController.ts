import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export const login = async (req: any, res: any) => {
  try {
    const { name, password } = req.body;
    const q = query(collection(db, "Admin"), where("name", "==", name));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const adminDoc = querySnapshot.docs[0]; // there's only one admin with this name
      const adminData = adminDoc.data();

      if (adminData.password === password) {
        //? ADMIN LOGIN
        return res
          .status(200)
          .json({
            data: { ...adminData, id: adminDoc.id },
            message: "Admin Login Successfull",
          });
      }
    }

    const q1 = query(collection(db, "teachers"), where("grNo", "==", name));
    const querySnapshot1 = await getDocs(q1);

    if (!querySnapshot1.empty) {
      const teacherDoc = querySnapshot1.docs[0]; // there's only one teacher with this name
      const teacherData = teacherDoc.data();

      if (teacherData.password === password) {
        //? TEACHER LOGIN
        return res.status(200).json({
            data: { ...teacherData, id: teacherDoc.id },
            message: "Teacher Login Successfull",
            });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }

  return res.status(401).json({ message: "Invalid Credentials" });
};
