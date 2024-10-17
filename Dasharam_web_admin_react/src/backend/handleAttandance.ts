import { addDoc, collection, query, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { toast } from "react-toastify";
import { where, getDocs } from "firebase/firestore";

//Todo: add attedance
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
    const newAttedence = {
      standardId,
      teacherId,
      takenDate,
      students,
    };
    const ref = await addDoc(collection(db, "attendance"), newAttedence);
    toast.success("Attendance added successfully");
  } catch (error) {
    toast.error("Error adding attendance");
    console.log(error);
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
      toast.info("Attendance taken! for " + takenDate);
      console.log(attendanceData);

      return {
        data: attendanceData,
        isAttedanceTaken: true,
      };
    } else {
      toast.warning("Attendance not taken yet!");
      return null;
    }
  } catch (error) {
    console.log(error);
    return {
      data: null,
      isAttedanceTaken: false,
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
      toast.success("Attendance updated successfully");
    } else {
      toast.warning("No attendance record found to update");
    }

  } catch (error) {
    toast.error("Error updating attendance");
    console.log(error);
    
  }
}
