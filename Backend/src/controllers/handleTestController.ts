import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import { sendNotification } from "./notfyController";

// test collection
// [
//     {
//         name: "test1",
//         standardId: "123"
//         subject: "123"
//         takenByTeacherId: "efefnnh"
//         totalMarks: "50"
//         takenDate: "2022-01-01"
//         students: [
//             {
//                 studentId: "123",
//                 obtainMarks: "50"
//             }
//         ]
//     }
// ]

// TODO: add test
export async function addTest(name: string, standardId: string, subject: string, takenByTeacherId: string, totalMarks: string, takenDate: string, students: { studentId: string, obtainMarks: string }[]) {
    try {
        const data = await addDoc(collection(db, "tests"), { name, standardId, subject, takenByTeacherId, totalMarks, takenDate, students });
        return { id: data.id, name, standardId, subject, takenByTeacherId, totalMarks, takenDate, students };
    } catch (error) {
        console.log("Error adding test", error);
        return null;
    }
}

// TODO: get all tests
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
        console.log("Error getting all tests", error);
        return null;
    }
}

// TODO: retrieve all student ids from test
export async function getStudentIdsFromTest(testId: string) {
    try {
        const testRef = doc(db, "tests", testId);
        const docSnap = await getDoc(testRef);
        if (docSnap.exists()) {
            const testData = docSnap.data();
            return testData.students.map((student: { studentId: string }) => student.studentId);
        } else {
            return [];
        }
    } catch (error) {
        console.log("Error getting student ids from test", error);
        return [];
    }
}

// TODO: retrieve all student details from ids
export async function getStudentDetailsFromIds(studentIds: string[]) {
    try {
        const studentDetails = await Promise.all(studentIds.map(async (studentId) => {
            const studentRef = doc(db, "students", studentId);
            const docSnap = await getDoc(studentRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                return null;
            }
        }));
        return studentDetails.filter(student => student !== null);
    } catch (error) {
        console.log("Error getting student details from ids", error);
        return [];
    }
}

// TODO: delete test
export async function deleteTest(testId: string) {
    try {
        const testRef = doc(db, "tests", testId);
        await deleteDoc(testRef);
    } catch (error) {
        console.log("Error deleting test", error);
    }
}

// TODO: edit test
export async function editTest(testId: string, name: string, standardId: string, subject: string, takenByTeacherId: string, totalMarks: string, takenDate: string, students: { studentId: string, obtainMarks: string }[]) {
    try {
        const testRef = doc(db, "tests", testId);
        await updateDoc(testRef, { name, standardId, subject, takenByTeacherId, totalMarks, takenDate, students });
    } catch (error) {
        console.log("Error editing test", error);
    }
}

export async function getAllTestsByStandard(standardId: string) {
    try {
        const testsCollection = collection(db, "tests");
        const q = query(testsCollection, where("standardId", "==", standardId));
        
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return []; // Return an empty array if no tests found
        }

        const tests = querySnapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
        });

        return tests; // Return the tests array
    } catch (error) {
        console.error("Error fetching tests: ", error);
        return null; // Return null in case of error
    }
}

export async function getAllTestsByStandardEndpoint(req: any, res: any) {
    const { standardId } = req.params;
    try {
        const tests = await getAllTestsByStandard(standardId);
        
        res.status(200).send(tests);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching tests by standard', error });
    }
}

//! Express endpoint handlers
export async function addTestEndpoint(req: any, res: any) {
    const { name, standardId, subject, takenByTeacherId, totalMarks, takenDate, students } = req.body;
    try {
        const test = await addTest(name, standardId, subject, takenByTeacherId, totalMarks, takenDate, students);
        sendNotification(standardId, `New test added: ${name}`, `A new test has been added for ${subject} subject`);
        res.status(200).send({ message: 'Test added successfully', test });
    } catch (error) {
        res.status(500).send({ message: 'Error adding test', error });
    }
}

export async function getAllTestsEndpoint(req: any, res: any) {
    try {
        const tests = await getAllTests();
        res.status(200).send(tests);
    } catch (error) {
        res.status(500).send({ message: 'Error getting all tests', error });
    }
}

export async function getStudentIdsFromTestEndpoint(req: any, res: any) {
    const { testId } = req.params;
    try {
        const studentIds = await getStudentIdsFromTest(testId);
        res.status(200).send(studentIds);
    } catch (error) {
        res.status(500).send({ message: 'Error getting student ids from test', error });
    }
}

export async function getStudentDetailsFromIdsEndpoint(req: any, res: any) {
    const { studentIds } = req.body;
    try {
        const studentDetails = await getStudentDetailsFromIds(studentIds);
        res.status(200).send(studentDetails);
    } catch (error) {
        res.status(500).send({ message: 'Error getting student details from ids', error });
    }
}

export async function deleteTestEndpoint(req: any, res: any) {
    const { testId } = req.body;
    try {
        await deleteTest(testId);
        res.status(200).send({ message: 'Test deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting test', error });
    }
}

export async function editTestEndpoint(req: any, res: any) {
    const { testId, name, standardId, subject, takenByTeacherId, totalMarks, takenDate, students } = req.body;
    try {
        await editTest(testId, name, standardId, subject, takenByTeacherId, totalMarks, takenDate, students);
        res.status(200).send({ message: 'Test edited successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error editing test', error });
    }
}