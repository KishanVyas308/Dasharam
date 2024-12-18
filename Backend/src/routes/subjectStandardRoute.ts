import { Router } from "express";
import {
    getAllStdSubEndpoint,
    addStandardEndpoint,
    addSubjectsInStandardEndpoint,
    getStandardByIdEndpoint,
    updateStandardNameEndpoint,
    removeSubjectFromStandardEndpoint,
    deleteStandardEndpoint,
    addTeacherIdsFromStdSubEndpoint,
    addStudentIdToStdSubEndpoint,
    deleteStudentFromStdSubEndpoint,
    deleteStudentIdFromStdSubEndpoint,
    addClassTeacherToStandardEndpoint,
    deleteTeacherIdFromStdSubEndpoint
} from '../controllers/handleSubjectStandardController';

const router = Router();

// Endpoint to get all standards with their subjects
router.get('/all', getAllStdSubEndpoint);

// Endpoint to add a new standard
router.post('/add', addStandardEndpoint);

// Endpoint to add subjects to a standard
router.post('/add-subjects', addSubjectsInStandardEndpoint);

// Endpoint to get a specific standard by ID
router.get('/:standardId', getStandardByIdEndpoint);

// Endpoint to update standard name
router.put('/update-name/:standardId', updateStandardNameEndpoint);

// Endpoint to remove a subject from a standard
router.put('/remove-subject', removeSubjectFromStandardEndpoint);

// Endpoint to delete a standard
router.delete('/delete/:standardId', deleteStandardEndpoint);

// Endpoint to add teacher IDs to a subject in a standard
router.post('/add-teacher-ids', addTeacherIdsFromStdSubEndpoint);

// Endpoint to add student ID to a standard
router.post('/add-student-id', addStudentIdToStdSubEndpoint);

// Endpoint to delete a student from a subject in a standard
router.put('/delete-student', deleteStudentFromStdSubEndpoint);

// Endpoint to delete student ID from a standard
router.put('/delete-student-id', deleteStudentIdFromStdSubEndpoint);

// Endpoint to add class teacher to a standard
router.post('/add-class-teacher', addClassTeacherToStandardEndpoint);

// Endpoint to delete class teacher from a standard
router.delete('/delete-class-teacher/:standardId', deleteTeacherIdFromStdSubEndpoint);

export default router;