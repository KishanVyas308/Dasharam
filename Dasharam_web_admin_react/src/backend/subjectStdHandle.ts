import { addDoc, collection, getDoc, query, setDoc, doc, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
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
    await addDoc(collection(db, "subjectStd"), { standard: name, subjects: [] });
    toast.success("Standard added successfully");
    return true;
  } catch (error) {
    toast.error("Error adding standard");
    return false;
  }
}

// Add subjects to a standard
export async function addSubjectsInStandard(standardId: string, newSubjects: string[]) {
  try {
    const standardRef = doc(db, "subjectStd", standardId);

    // Fetch the current document
    const docSnap = await getDoc(standardRef);
    if (docSnap.exists()) {
      const currentSubjects = docSnap.data().subjects || [];

      // Combine current subjects with new subjects, and remove duplicates
      const updatedSubjects = [...new Set([...currentSubjects, ...newSubjects])];

      // Update Firestore document with the combined subjects
      await updateDoc(standardRef, { subjects: updatedSubjects });

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
  } catch (error) {
    console.log(error);
  }
}

// Remove a subject from a standard
export async function removeSubjectFromStandard(standardId: string, subjectName: string) {
  try {
    const standardRef = doc(db, "subjectStd", standardId);
    const docSnap = await getDoc(standardRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const updatedSubjects = data.subjects.filter((subject: string) => subject !== subjectName);
      await updateDoc(standardRef, { subjects: updatedSubjects });
    }
  } catch (error) {
    console.log(error);
  }
}

// Delete a standard
export async function deleteStandard(standardId: string) {
  try {
    const standardRef = doc(db, "subjectStd", standardId);
    await deleteDoc(standardRef);
  } catch (error) {
    console.log(error);
  }
}




