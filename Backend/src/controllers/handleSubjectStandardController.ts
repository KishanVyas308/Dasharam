import {
    addDoc,
    collection,
    getDoc,
    query,
    doc,
    getDocs,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { Request, Response } from "express";

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
            students: [],
            classTeacherId: "",
        });
        return true;
    } catch (error) {
        return false;
    }
}

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

            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}

// Get a specific standard by ID
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

// Add teacher IDs in array
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
    } catch (error) {
        console.log(error);
    }
}

// Add student ID to students array
export async function addStudentIdToStdSub(
    standardId: string,
    studentId: string
) {
    try {
        const standardRef = doc(db, "subjectStd", standardId);
        const docSnap = await getDoc(standardRef);
        if (docSnap.exists()) {
            const data = docSnap.data();

            // If students array exists, append the new studentId, else initialize it
            const updatedStudents = Array.isArray(data.students)
                ? [...data.students, studentId]
                : [studentId];

            // Update the students array in Firestore
            await updateDoc(standardRef, { students: updatedStudents });

            console.log("Student ID added successfully");
        } else {
            console.log("Standard not found");
        }
    } catch (error) {
        console.error("Error adding student ID:", error);
    }
}

// Delete student from subjectStd
export async function deleteStudentFromStdSub(
    standardId: string,
    subjectName: string,
    studentId: string
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
            console.log("Subject removed successfully");
        }
    } catch (error) {
        console.log(error);
    }
}

// Delete student ID from students array
export async function deleteStudentIdFromStdSub(
    standardId: string,
    studentId: string
) {
    try {
        const standardRef = doc(db, "subjectStd", standardId);
        const docSnap = await getDoc(standardRef);
        if (docSnap.exists()) {
            const data = docSnap.data();

            // If students array exists, append the new studentId, else initialize it
            const updatedStudents = data.students.filter(
                (student: any) => student !== studentId
            );

            // Update the students array in Firestore
            await updateDoc(standardRef, { students: updatedStudents });

            console.log("Student ID removed successfully");
        }
    } catch (error) {
        console.error("Error removing student ID:", error);
    }
}

// Add class teacher to standard
export async function addClassTeacherToStandard(
    standardId: string,
    teacherId: string
) {
    try {
        const standardRef = doc(db, "subjectStd", standardId);
        await updateDoc(standardRef, { classTeacherId: teacherId });
        console.log("Class teacher added successfully");
    } catch (error) {
        console.error("Error adding ClassTeacher:", error);
    }
}

// Delete teacher ID from standard
export async function deleteTeacherIdFromStdSub(standardId: string) {
    try {
        const standardRef = doc(db, "subjectStd", standardId);
        await updateDoc(standardRef, { teacherId: "" });
        console.log("Class teacher removed successfully");
    } catch (error) {
        console.error("Error removing ClassTeacher:", error);
    }
}

// Express endpoint handlers
export async function getAllStdSubEndpoint(req: Request, res: Response) {
    try {
        const result = await getAllStdSub();
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ message: 'Error getting all standards with subjects', error });
    }
}

export async function addStandardEndpoint(req: Request, res: Response) {
    const { name } = req.body;
    try {
        const result = await addStandard(name);
        if (result) {
            res.status(200).send({ message: 'Standard added successfully' });
        } else {
            res.status(500).send({ message: 'Error adding standard' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error adding standard', error });
    }
}

export async function addSubjectsInStandardEndpoint(req: Request, res: Response) {
    const { standardId, newSubjects } = req.body;
    try {
        const result = await addSubjectsInStandard(standardId, newSubjects);
        if (result) {
            res.status(200).send({ message: 'Subjects added successfully' });
        } else {
            res.status(404).send({ message: 'Standard does not exist' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error adding subjects to standard', error });
    }
}

export async function getStandardByIdEndpoint(req: Request, res: Response) {
    const { standardId } = req.params;
    try {
        const result = await getStandardById(standardId);
        if (result) {
            res.status(200).send(result);
        } else {
            res.status(404).send({ message: 'Standard does not exist' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error getting standard by ID', error });
    }
}

export async function updateStandardNameEndpoint(req: Request, res: Response) {
    const { standardId } = req.params;
    const { newName } = req.body;
    try {
        await updateStandardName(standardId, newName);
        res.status(200).send({ message: 'Standard name updated successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error updating standard name', error });
    }
}

export async function removeSubjectFromStandardEndpoint(req: Request, res: Response) {
    const { standardId, subjectName } = req.body;
    try {
        await removeSubjectFromStandard(standardId, subjectName);
        res.status(200).send({ message: 'Subject removed successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error removing subject from standard', error });
    }
}

export async function deleteStandardEndpoint(req: Request, res: Response) {
    const { standardId } = req.params;
    try {
        await deleteStandard(standardId);
        res.status(200).send({ message: 'Standard deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting standard', error });
    }
}

export async function addTeacherIdsFromStdSubEndpoint(req: Request, res: Response) {
    const { standardId, subjectName, teacherId } = req.body;
    try {
        await addTeacherIdsFromStdSub(standardId, subjectName, teacherId);
        res.status(200).send({ message: 'Teacher IDs added successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error adding teacher IDs', error });
    }
}

export async function addStudentIdToStdSubEndpoint(req: Request, res: Response) {
    const { standardId, studentId } = req.body;
    try {
        await addStudentIdToStdSub(standardId, studentId);
        res.status(200).send({ message: 'Student ID added successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error adding student ID', error });
    }
}

export async function deleteStudentFromStdSubEndpoint(req: Request, res: Response) {
    const { standardId, subjectName, studentId } = req.body;
    try {
        await deleteStudentFromStdSub(standardId, subjectName, studentId);
        res.status(200).send({ message: 'Student removed successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error removing student from standard', error });
    }
}

export async function deleteStudentIdFromStdSubEndpoint(req: Request, res: Response) {
    const { standardId, studentId } = req.body;
    try {
        await deleteStudentIdFromStdSub(standardId, studentId);
        res.status(200).send({ message: 'Student ID removed successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error removing student ID', error });
    }
}

export async function addClassTeacherToStandardEndpoint(req: Request, res: Response) {
    const { standardId, teacherId } = req.body;
    try {
        await addClassTeacherToStandard(standardId, teacherId);
        res.status(200).send({ message: 'Class teacher added successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error adding class teacher', error });
    }
}

export async function deleteTeacherIdFromStdSubEndpoint(req: Request, res: Response) {
    const { standardId } = req.params;
    try {
        await deleteTeacherIdFromStdSub(standardId);
        res.status(200).send({ message: 'Class teacher removed successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error removing class teacher', error });
    }
}
