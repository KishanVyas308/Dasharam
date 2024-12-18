import { addDoc, collection, query, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { where, getDocs } from "firebase/firestore";

//Todo: add attendance
export async function addAttendance(
  standardId: string,
  teacherId: string,
  takenDate: string,
  students:
    | [
        {
          studentId: string;
          present: boolean;
        }
      ]
    | []
) {
  try {
    const newAttendance = {
      standardId,
      teacherId,
      takenDate,
      students,
    };
    await addDoc(collection(db, "attendance"), newAttendance);
  } catch (error) {
    console.log("Error adding attendance", error);
  }
}

// todo: check attendance based on date
export async function checkAttendance(standardId: string, takenDate: string) {
  const q = query(
    collection(db, "attendance"),
    where("standardId", "==", standardId),
    where("takenDate", "==", takenDate)
  );

  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const attendanceData = querySnapshot.docs.map((doc) => doc.data());
      console.log("Attendance taken for", takenDate, attendanceData);

      return {
        data: attendanceData,
        isAttendanceTaken: true,
      };
    } else {
      console.log("Attendance not taken yet for", takenDate);
      return null;
    }
  } catch (error) {
    console.log("Error checking attendance", error);
    return {
      data: null,
      isAttendanceTaken: false,
    };
  }
}

// Todo : update attendance
export async function updateAttendance(
  standardId: string,
  teacherId: string,
  takenDate: string,
  students:
    | [
        {
          studentId: string;
          present: boolean;
        }
      ]
    | []
) {
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
      console.log("Attendance updated successfully");
    } else {
      console.log("No attendance record found to update");
    }
  } catch (error) {
    console.log("Error updating attendance", error);
  }
}

// Express endpoint handlers
export async function addAttendanceEndpoint(req: any, res: any) {
  const { standardId, teacherId, takenDate, students } = req.body;
  try {
    await addAttendance(standardId, teacherId, takenDate, students);
    res.status(200).send({ message: 'Attendance added successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error adding attendance', error });
  }
}

export async function checkAttendanceEndpoint(req: any, res: any) {
  const { standardId, takenDate } = req.query;
  try {
    const result = await checkAttendance(standardId as string, takenDate as string);
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).send({ message: 'Attendance not taken yet' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error checking attendance', error });
  }
}

export async function updateAttendanceEndpoint(req: any, res: any) {
  const { standardId, teacherId, takenDate, students } = req.body;
  try {
    await updateAttendance(standardId, teacherId, takenDate, students);
    res.status(200).send({ message: 'Attendance updated successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error updating attendance', error });
  }
}


