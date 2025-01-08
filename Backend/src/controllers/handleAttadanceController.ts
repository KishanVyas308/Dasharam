import { addDoc, collection, query, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { where, getDocs } from "firebase/firestore";
import { firestore } from "firebase-admin";

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
    

      return {
        data: attendanceData,
        isAttendanceTaken: true,
      };
    } else {
     
      return null;
    }
  } catch (error) {
  
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
    } else {
    }
  } catch (error) {
  }
}

export async function getAttedanceFromSelectedDate(standardId: string, startDate: string, endDate: string) {
  console.log( standardId, startDate, endDate);
  if (!standardId || !startDate || !endDate) {
    
    throw new Error("Invalid input parameters");
  }

  const q = query(
    collection(db, "attendance"),
    where("standardId", "==", standardId),
    where("takenDate", ">=", startDate),
    where("takenDate", "<=", endDate)
  );

  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const attendanceData = querySnapshot.docs.map((doc) => doc.data());
      console.log('Attendance found', attendanceData);
      
      return {
        data: attendanceData,
        isAttendanceFound: true,
      };
    } else {
      console.log('No attendance found');
      
      return {
        data: [],
        isAttendanceFound: false,
      };

    }
  } catch (error: any) {
    console.log(error);
    return {
      data: [],
      isAttendanceFound: false,
      error: error.message,
    };
  }
}


//! Express endpoint handlers
export async function checkAttendanceEndpoint(req: any, res: any) {
  const { standardId, takenDate } = req.body;
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

export async function addAttendanceEndpoint(req: any, res: any) {
  const { standardId, teacherId, takenDate, students } = req.body;
  try {
    await addAttendance(standardId, teacherId, takenDate, students);
    res.status(200).send({ message: 'Attendance added successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error adding attendance', error });
  }
}


export async function updateAttendanceEndpoint(req: any, res: any) {
  const { standardId, teacherId, takenDate, students } = req.body;
  try {
    await updateAttendance(standardId, teacherId, takenDate, students);
    res.status(200).send({ message: 'Attendance updated successfully' });
  } catch (error) {
    console.log(error);
    
    res.status(500).send({ message: 'Error updating attendance', error });
  }
}

export async function getAttedanceFromSelectedDateEndpoint(req: any, res: any) {
  const {standardId, startDate, endDate} = req.body;
  try {
    const data = await getAttedanceFromSelectedDate(standardId, startDate, endDate);
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    
    res.status(500).send({ message: 'Error getting attendance', error });
  }
}


