import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { addStudentIdToStdSub, deleteStudentIdFromStdSub } from "./subjectStdHandle";
import { Request, Response } from "express";

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
export async function addStudent(req: Request, res: Response) {
    const { name, parentName, parentMobileNo, grno, password, standardId } = req.body;
    const student = {
        name,
        parentName,
        parentMobileNo,
        grno,
        password,
        standardId,
        role: "student"
    };
    try {
        const studentRef = await addDoc(collection(db, "students"), student);
        await addStudentIdToStdSub(standardId, studentRef.id);
        res.status(201).json({ message: "Student added successfully", id: studentRef.id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error adding student" });
    }
}

// TODO: get all students
export async function getAllStudents(req: Request, res: Response) {
    const q = query(collection(db, "students"));
    try {
        const allStudents = await getDocs(q);
        const result: any[] = [];
        allStudents.forEach((doc) => {
            result.push({ id: doc.id, ...doc.data() });
        });
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching students" });
    }
}

// TODO: get student by id
export async function getStudentById(req: Request, res: Response) {
    const { studentId } = req.params;
    try {
        const studentRef = doc(db, "students", studentId);
        const docSnap = await getDoc(studentRef);
        if (docSnap.exists()) {
            res.status(200).json({ id: docSnap.id, ...docSnap.data() });
        } else {
            res.status(404).json({ message: "Student not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching student" });
    }
}

// TODO: delete student
export async function deleteStudent(req: Request, res: Response) {
    const { studentId, standardId } = req.params;
    try {
        const studentRef = doc(db, "students", studentId);
        await deleteDoc(studentRef);
        await deleteStudentIdFromStdSub(standardId, studentId);
        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error deleting student" });
    }
}

// TODO: edit student
export async function editStudent(req: Request, res: Response) {
    const { studentId } = req.params;
    const { name, parentName, parentMobileNo, grno, password, standardId } = req.body;
    try {
        const studentRef = doc(db, "students", studentId);
        await updateDoc(studentRef, { name, parentName, parentMobileNo, grno, password, standardId });
        res.status(200).json({ message: "Student edited successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error editing student" });
    }
}
