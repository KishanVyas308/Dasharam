import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Request, Response } from "express";

// Add a new teacher
export async function addTeacher(name: string, mobileNo: string, grNo: string, password: string) {
  try {
    await addDoc(collection(db, "teachers"), { name, mobileNo, grNo, password, role: "teacher" });
  } catch (error) {
    console.error("Error adding teacher", error);
  }
}

// Assign subjects to a teacher
export async function assignSubjectsToTeacher(teacherId: string, subjectIds: string[]) {
  try {
    const teacherRef = doc(db, "teachers", teacherId);
    const data = await getDoc(teacherRef);
    if (data.exists()) {
      const currentSubjectToTeacher = data.data().subject_ids || [];
      const updatedSubjectToTeacher = [...new Set([...currentSubjectToTeacher, ...subjectIds])];
      await updateDoc(teacherRef, { subject_ids: updatedSubjectToTeacher });
      return true;
    } else {
      console.error("Teacher does not exist");
      return false;
    }
  } catch (error) {
    console.error("Error assigning subjects to teacher", error);
  }
}

// Get all teachers
export async function getAllTeachers() {
  const q = query(collection(db, "teachers"));
  try {
    const allTeachers = await getDocs(q);
    const result: any[] = [];
    allTeachers.forEach((doc) => {
      result.push({ id: doc.id, ...doc.data() });
    });
    return result;
  } catch (error) {
    console.error("Error getting all teachers", error);
    return null;
  }
}

// Get teacher by ID
export async function getTeacherById(teacherId: string) {
  try {
    const teacherRef = doc(db, "teachers", teacherId);
    const docSnap = await getDoc(teacherRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting teacher by ID", error);
    return null;
  }
}

// Delete a teacher
export async function deleteTeacher(teacherId: string) {
  try {
    const teacherRef = doc(db, "teachers", teacherId);
    await deleteDoc(teacherRef);
  } catch (error) {
    console.error("Error deleting teacher", error);
  }
}

// Update teacher details
export async function updateTeacher(teacherId: string, updatedData: Partial<{ name: string; mobileNo: string; grNo: string; password: string; role: string }>) {
  try {
    const teacherRef = doc(db, "teachers", teacherId);
    await updateDoc(teacherRef, updatedData);
  } catch (error) {
    console.error("Error updating teacher", error);
  }
}

// Express endpoint handlers
export async function addTeacherEndpoint(req: Request, res: Response) {
  const { name, mobileNo, grNo, password } = req.body;
  try {
    await addTeacher(name, mobileNo, grNo, password);
    res.status(200).send({ message: 'Teacher added successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error adding teacher', error });
  }
}

export async function assignSubjectsToTeacherEndpoint(req: Request, res: Response) {
  const { teacherId, subjectIds } = req.body;
  try {
    const result = await assignSubjectsToTeacher(teacherId, subjectIds);
    if (result) {
      res.status(200).send({ message: 'Subjects assigned successfully' });
    } else {
      res.status(404).send({ message: 'Teacher does not exist' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error assigning subjects to teacher', error });
  }
}

export async function getAllTeachersEndpoint(req: Request, res: Response) {
  try {
    const result = await getAllTeachers();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: 'Error getting all teachers', error });
  }
}

export async function getTeacherByIdEndpoint(req: Request, res: Response) {
  const { teacherId } = req.params;
  try {
    const result = await getTeacherById(teacherId);
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).send({ message: 'Teacher does not exist' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error getting teacher by ID', error });
  }
}

export async function deleteTeacherEndpoint(req: Request, res: Response) {
  const { teacherId } = req.params;
  try {
    await deleteTeacher(teacherId);
    res.status(200).send({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting teacher' });
  }
}

export async function updateTeacherEndpoint(req: Request, res: Response) {
  const { teacherId } = req.params;
  const updatedData = req.body;
  try {
    await updateTeacher(teacherId, updatedData);
    res.status(200).send({ message: 'Teacher updated successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error updating teacher', error });
  }
}