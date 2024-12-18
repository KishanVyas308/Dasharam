import { addDoc, collection, query, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { where, getDocs } from "firebase/firestore";
import { Request, Response } from "express";

// Add attendance
export async function addAttendance(req: Request, res: Response) {
  const { standardId, teacherId, takenDate, students } = req.body;

  try {
    const newAttendance = {
      standardId,
      teacherId,
      takenDate,
      students,
    };
    await addDoc(collection(db, "attendance"), newAttendance);
    res.status(200).json({ message: "Attendance added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding attendance" });
  }
}

// Check attendance based on date
export async function checkAttendance(req: Request, res: Response) {
  const { standardId, takenDate } = req.query;

  const q = query(
    collection(db, "attendance"),
    where("standardId", "==", standardId as string),
    where("takenDate", "==", takenDate as string)
  );

  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const attendanceData = querySnapshot.docs.map((doc) => doc.data());
      res.status(200).json({
        data: attendanceData,
        isAttendanceTaken: true,
      });
    } else {
      res.status(404).json({ message: "Attendance not taken yet!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error checking attendance" });
  }
}

// Update attendance
export async function updateAttendance(req: Request, res: Response) {
  const { standardId, teacherId, takenDate, students } = req.body;

  try {
    const q = query(
      collection(db, "attendance"),
      where("standardId", "==", standardId),
      where("takenDate", "==", takenDate)
    );
    const updateData = {
      standardId,
      teacherId,
      takenDate,
      students,
    };
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, updateData);
      res.status(200).json({ message: "Attendance updated successfully" });
    } else {
      res.status(404).json({ message: "No attendance record found to update" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating attendance" });
  }
}
