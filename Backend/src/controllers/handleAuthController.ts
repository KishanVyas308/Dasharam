import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import jwt from "jsonwebtoken";

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
        //  generate token from adminData
        const token = jwt.sign({ ...adminData, id: adminDoc.id
        }, process.env.JWT_SECRET as string, { 
          expiresIn: "1h",
        });
        return res.status(200).json({
          data: { ...adminData, id: adminDoc.id, token },
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
        //  generate token from adminData
        const token = jwt.sign({ ...teacherData, id: teacherDoc.id
        }, process.env.JWT_SECRET as string, { 
          expiresIn: "1h",
        });
        //? TEACHER LOGIN
        return res.status(200).json({
          data: { ...teacherData, id: teacherDoc.id, token },
          message: "Teacher Login Successfull",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }

  return res.status(401).json({ message: "Invalid Credentials" });
};

export const loginStundent = async (req: any, res: any) => {
  try {
    const { grno } = req.body;
    const q = query(collection(db, "students"), where("grno", "==", grno));
    const querySnapshot = await getDocs(q);


    if (!querySnapshot.empty) {
      const studentDoc = querySnapshot.docs[0];
      const studentData = studentDoc.data();
      console.log(studentData);
      
      return res.status(200).json({
        data: { ...studentData, id: studentDoc.id },
        message: "Student Login Successful",
      });
    }
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({ message: "Internal Server Error" });
  }

  return res.status(401).json({ message: "Invalid Credentials" });
};
