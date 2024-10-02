import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc } from "firebase/firestore";
import { db } from "./firebase";


// Add a new teacher
export async function addTeacher(name: string, email: string) {
  try {
    await addDoc(collection(db, "teachers"), { name, email, subject_ids: [] });
  } catch (error) {
    console.log(error);
  }
}

// Assign subjects to a teacher
export async function assignSubjectsToTeacher(teacherId: string, subjectIds: string[]) {
  try {
    const teacherRef = doc(db, "teachers", teacherId);
    await updateDoc(teacherRef, { subject_ids: subjectIds });
  } catch (error) {
    console.log(error);
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
      console.log(error);
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
      console.log(error);
      return null;
    }
  }
  
  // Delete a teacher
  export async function deleteTeacher(teacherId: string) {
    try {
      const teacherRef = doc(db, "teachers", teacherId);
      await deleteDoc(teacherRef);
    } catch (error) {
      console.log(error);
    }
  }
  
  // Assign teacher to a subject within a standard
  export async function assignTeacherToSubject(standardId: string, subjectName: string, teacherId: string) {
    try {
      const standardRef = doc(db, "subjectStd", standardId);
      const docSnap = await getDoc(standardRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const subjects = data.subjects.map((subject: any) => {
          if (subject.name === subjectName) {
            return { ...subject, teacherId };
          }
          return subject;
        });
        await updateDoc(standardRef, { subjects });
      }
    } catch (error) {
      console.log(error);
    }
  }
  