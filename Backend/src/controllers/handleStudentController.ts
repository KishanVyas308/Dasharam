import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { addStudentIdToStdSub, deleteStudentIdFromStdSub } from "./handleSubjectStandardController";

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
export async function addStudent(name: string, parentName: string, parentMobileNo: string, grno: string, standardId: string) {
    const student = {
        name,
        parentName,
        parentMobileNo,
        grno,
        standardId,
        role: "student"
    };
    try {
        const studentRef = await addDoc(collection(db, "students"), student);
        await addStudentIdToStdSub(standardId, studentRef.id);
    } catch (error) {
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
        return null;
    }
}

// TODO: delete student
export async function deleteStudent(studentId: string, standardId: string) {
    try {
  
        
        const studentRef = doc(db, "students", studentId);
        await deleteDoc(studentRef);
        await deleteStudentIdFromStdSub(standardId, studentId);
    } catch (error) {
    }
}

// TODO: edit student
export async function editStudent(studentId: string, name: string, parentName: string, parentMobileNo: string, grno: string,  standardId: string) {
    try {
        const studentRef = doc(db, "students", studentId);
        await updateDoc(studentRef, { name, parentName, parentMobileNo, grno, standardId });
    } catch (error) {
    }
}

//! Express endpoint handlers
export async function addStudentEndpoint(req: any, res: any) {
    const { name, parentName, parentMobileNo, grno, standardId } = req.body;
    try {
        await addStudent(name, parentName, parentMobileNo, grno, standardId);
        res.status(200).send({ message: 'Student added successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error adding student', error });
    }
}

export async function getAllStudentsEndpoint(req: any, res: any) {
    try {
        const students = await getAllStudents();
        res.status(200).send(students);
    } catch (error) {
        res.status(500).send({ message: 'Error getting all students', error });
    }
}

export async function getStudentByIdEndpoint(req: any, res: any) {
    const { studentId } = req.params;
    try {
        const student = await getStudentById(studentId);
        if (student) {
            res.status(200).send(student);
        } else {
            res.status(404).send({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error getting student by id', error });
    }
}

export async function deleteStudentEndpoint(req: any, res: any) {
    const { studentId, standardId } = req.body;
    try {
    
        
        await deleteStudent(studentId, standardId);
        res.status(200).send({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting student', error });
    }
}

export async function editStudentEndpoint(req: any, res: any) {
    const { studentId, name, parentName, parentMobileNo, grno, standardId } = req.body;
    try {
        await editStudent(studentId, name, parentName, parentMobileNo, grno, standardId);
        res.status(200).send({ message: 'Student edited successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error editing student', error });
    }
}