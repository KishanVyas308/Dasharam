import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "./firebase";
import { toast } from "react-toastify";

// test collection
// [
//     {
//         name: "test1",
//         standardid: "123"
//         subject: "123"
//         takenbyteacherid: "efefnnh"
//         totalmarks: "50"
//         takendate: "2022-01-01"
//         students: [
//             {
//                 studnetid: "123",
//                 obtainmarks: "50"
//             }
//         ]

//     }
// ]

// todo: add test
export async function addTest(name: string, standardId: string, subject: string, takenByTeacherId: string, totalMarks: string, takenDate: string, studentIds: string[]) {
    try {
        await addDoc(collection(db, "tests"), { name, standardId, subject, takenByTeacherId, totalMarks, takenDate, studentIds });
        toast.success("Test added successfully");
    } catch (error) {
        toast.error("Error adding test");
        console.log(error);
    }
}
// todo: get all test
export async function getAllTests() {
    const q = query(collection(db, "tests"));
    try {
        const allTests = await getDocs(q);
        const result: any[] = [];
        allTests.forEach((doc) => {
            result.push({ id: doc.id, ...doc.data() });
        });
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// todo: retrive all student id from test

// todo: retrive all student details from ides


// todo: delete test
export async function deleteTest(testId: string) {
    try {
        const testRef = doc(db, "tests", testId);
        await deleteDoc(testRef);
        toast.success("Test deleted successfully");
    } catch (error) {
        toast.error("Error deleting test");
        console.log(error);
    }
}

// todo: edit test
export async function editTest(testId: string, name: string, standardId: string, subject: string, takenByTeacherId: string, totalMarks: string, takenDate: string, studentIds: string[]) {
    try {
        const testRef = doc(db, "tests", testId);        
        await updateDoc(testRef, { name, standardId, subject, takenByTeacherId, totalMarks, takenDate, studentIds });
        toast.success("Test edited successfully");
    } catch (error) {
        toast.error("Error editing test");
        console.log(error);
    }
}