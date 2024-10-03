import {
  addDoc,
  collection,
  getDoc,
  query,
  setDoc,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { toast } from "react-toastify";

// Get all standards with their subjects
export async function getAllStdSub() {
  const q = query(collection(db, "subjectStd"));
  try {
    const allStdSub = await getDocs(q);
    const result: any[] = [];
    allStdSub.forEach((doc) => {
      result.push({ id: doc.id, ...doc.data() });
    });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Add a new standard
export async function addStandard(name: string) {
  try {
    await addDoc(collection(db, "subjectStd"), {
      standard: name,
      subjects: [],
    });
    toast.success("Standard added successfully");
    return true;
  } catch (error) {
    toast.error("Error adding standard");
    return false;
  }
}

// Add subjects to a standard
// Add subjects to a standard (with teacherIds)
export async function addSubjectsInStandard(
  standardId: string,
  newSubjects: { name: string }[]
) {
  try {
    const standardRef = doc(db, "subjectStd", standardId);

    // Fetch the current document
    const docSnap = await getDoc(standardRef);
    if (docSnap.exists()) {
      const currentSubjects = docSnap.data().subjects || [];

      // Add the new subjects while avoiding duplicates by subject name
      const updatedSubjects = [
        ...currentSubjects,
        ...newSubjects.filter(
          (newSub) =>
            !currentSubjects.some((sub: any) => sub.name === newSub.name)
        ),
      ];

      // add teacherIds to subjects
      const updatedSubjectsWithTeacherIds = updatedSubjects.map((sub: any) => {
        const teacherIds = sub.teacherIds || [];
        return { ...sub, teacherIds };
      });

      // Update Firestore document with the combined subjects
      await updateDoc(standardRef, { subjects: updatedSubjectsWithTeacherIds });
      console.log(updatedSubjectsWithTeacherIds);

      toast.success("Subjects added successfully");
      return true;
    } else {
      toast.error("Standard does not exist.");
      return false;
    }
  } catch (error) {
    toast.error("Error adding subjects");
    console.error(error);
    return false;
  }
}

// // Get a specific standard by ID
export async function getStandardById(standardId: string) {
  try {
    const standardRef = doc(db, "subjectStd", standardId);
    const docSnap = await getDoc(standardRef);
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

// Update standard name
export async function updateStandardName(standardId: string, newName: string) {
  try {
    const standardRef = doc(db, "subjectStd", standardId);
    await updateDoc(standardRef, { standard: newName });
    toast.success("Standard name updated successfully");
  } catch (error) {
    toast.error("Error updating standard name");
    console.log(error);
  }
}

// Remove a subject from a standard (by subject name)
export async function removeSubjectFromStandard(
  standardId: string,
  subjectName: string
) {
  try {
    const standardRef = doc(db, "subjectStd", standardId);
    const docSnap = await getDoc(standardRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const updatedSubjects = data.subjects.filter(
        (subject: any) => subject.name !== subjectName
      );
      await updateDoc(standardRef, { subjects: updatedSubjects });
      toast.success("Subject removed successfully");
    }
  } catch (error) {
    toast.error("Error removing subject");
    console.log(error);
  }
}
// Delete a standard
export async function deleteStandard(standardId: string) {
  try {
    const standardRef = doc(db, "subjectStd", standardId);
    await deleteDoc(standardRef);
    toast.success("Standard deleted successfully");
  } catch (error) {
    console.log(error);
    toast.error("Error deleting standard");
  }
}

// add teachers id in array
export async function addTeacherIdsFromStdSub(
  standardId: string,
  subjectName: string,
  teacherId: string
) {
  try {
    const standardRef = doc(db, "subjectStd", standardId);
    const docSnap = await getDoc(standardRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const subjects = data.subjects.map((subject: any) => {
        if (subject.name === subjectName) {
          // Check if teacherIds is an array and append to it, or initialize it if not
          const updatedTeacherIds = Array.isArray(subject.teacherIds)
            ? [...subject.teacherIds, teacherId]
            : [teacherId];

          return { ...subject, teacherIds: updatedTeacherIds };
        }
        return subject;
      });
      await updateDoc(standardRef, { subjects });
      console.log("Subjects updated successfully");
    }
    toast.success("Subjects updated successfully");
  } catch (error) {
    toast.error("Error updating subjects");
    console.log(error);
  }
}


