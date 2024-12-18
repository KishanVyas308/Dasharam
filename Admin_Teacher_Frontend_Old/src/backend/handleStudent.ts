import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { toast } from "react-toastify";
import { addStudentIdToStdSub, deleteStudentIdFromStdSub } from "./subjectStdHandle";

// student collection
// [
//     {
//         name: "student1",
//         parentName: "parent1", 
//         parentMobileNo: "1234567890",
//         grno: "123",
//         password: "123"
//         standardId: "wjehwjehej"
//     }
// ]


// TODO: add student
export async function addStudent(name: string, parentName: string, parentMobileNo: string, grno:string, password: string, standardId: string) {     
    const student = {
        name: name,        
        parentName: parentName,
        parentMobileNo: parentMobileNo,
        grno: grno,
        password: password,
        standardId: standardId,
        role: "student"
        }
        try {
            const studentRef = await addDoc(collection(db, "students"), student);
            await addStudentIdToStdSub(standardId, studentRef.id);
            toast.success("Student added successfully");
        } catch (error) {
            toast.error("Error adding student");
            console.log(error);
        }
}   

// TODO: get all students
export async function getAllStudents() {
    const q = query(collection(db, "students"));
    try {
        const allStudents = await getDocs(q);
        const result: any[] = [];
        allStudents.forEach((doc) => {
            result.push({ id: doc.id, ...doc.data() });
        });
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}   


// TODO: get student by id
export async function getStudentById(studentId: string) {
    try {
        const studentRef = doc(db, "students", studentId);
        const docSnap = await getDoc(studentRef);
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

// TODO: delete student
export async function deleteStudent(studentId: string, standardId: string) {
    try {
        const studentRef = doc(db, "students", studentId);
        await deleteDoc(studentRef);
        await deleteStudentIdFromStdSub(standardId, studentId);
        toast.success("Student deleted successfully");
    } catch (error) {
        toast.error("Error deleting student");
        console.log(error);
    }
}   

// TODO: edit student

export async function editStudent(studentId: string, name: string, parentName: string, parentMobileNo: string, grno:string, password: string, standardId: string) {
    try {
        const studentRef = doc(db, "students", studentId);
        await updateDoc(studentRef, { name: name, parentName: parentName, parentMobileNo: parentMobileNo, grno: grno, password: password, standardId: standardId });
        toast.success("Student edited successfully");
    } catch (error) {
        toast.error("Error editing student");
        console.log(error);
    }
}