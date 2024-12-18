import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { toast } from "react-toastify";


// Add a new teacher
export async function addTeacher(name: string, mobileNo: string, grNo: string, password: string) {
  try {
    await addDoc(collection(db, "teachers"), { name, mobileNo, grNo, password, role: "teacher" });
    toast.success("Teacher added successfully");
  } catch (error) {
    toast.error("Error adding teacher");
    console.log(error);
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
      toast.success("Subjects assigned successfully");
      return true;
    } else {      
      toast.error("Teacher does not exist");
      return false;
    }
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
      toast.success("Teacher deleted successfully");
    } catch (error) {
      toast.error("Error deleting teacher");
      console.log(error);
    }
  }
  
  // Assign teacher to a subject within a standard

 
  