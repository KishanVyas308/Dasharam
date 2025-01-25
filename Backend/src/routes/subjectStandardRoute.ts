import { Router } from "express";
import {
    getAllStdSubEndpoint,
    addStandardEndpoint,
    addSubjectsInStandardEndpoint,
    getStandardByIdEndpoint,
    updateStandardNameEndpoint,
    removeSubjectFromStandardEndpoint,
    deleteStandardEndpoint,
    assignSubjectTeacherEndpoint,
    addStudentIdToStdSubEndpoint,
    deleteStudentIdFromStdSubEndpoint,
    assignClassTeacherEndpoint,
    deleteTeacherIdFromStdSubEndpoint,
    deleteTeacherFromSubjectInStandardEndpoint,
} from '../controllers/handleSubjectStandardController';
import { verifyToken } from "../middleware/midlleware";

const router = Router();

// Endpoint to get all standards with their subjects
router.get('/all', verifyToken, getAllStdSubEndpoint);

// Endpoint to add a new standard
router.post('/add',  verifyToken,addStandardEndpoint);

// Endpoint to add subjects to a standard
router.post('/add-subjects', verifyToken,addSubjectsInStandardEndpoint);

// Endpoint to get a specific standard by ID
router.get('/:standardId', getStandardByIdEndpoint); // usee in app

// Endpoint to update standard name
router.put('/update-name/:standardId', verifyToken, updateStandardNameEndpoint);

// Endpoint to remove a subject from a standard
router.put('/remove-subject', verifyToken, removeSubjectFromStandardEndpoint);

// Endpoint to delete a standard
router.delete('/delete/:standardId', verifyToken, deleteStandardEndpoint);

// Endpoint to add teacher IDs to a subject in a standard
router.post('/assign-subject-teacher', verifyToken, assignSubjectTeacherEndpoint);

// Endpoint to add class teacher to a standard
router.post('/assign-class-teacher', verifyToken, assignClassTeacherEndpoint);

// Endpoint to add student ID to a standard
router.post('/std/add-student-id', verifyToken, addStudentIdToStdSubEndpoint);

// Endpoint to delete student ID from a standard
router.put('/std/delete-student', verifyToken, deleteStudentIdFromStdSubEndpoint);


// Endpoint to delete class teacher from a standard
router.delete('/delete-class-teacher/:standardId', verifyToken, deleteTeacherIdFromStdSubEndpoint);

// Endpoint to delete teacher ID from a subject in a standard
router.put('/std/sub/remove-teacher', verifyToken, deleteTeacherFromSubjectInStandardEndpoint);

export default router;