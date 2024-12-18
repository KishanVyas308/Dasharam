import { Router } from "express";
import { 
    addTeacherEndpoint, 
    assignSubjectsToTeacherEndpoint, 
    getAllTeachersEndpoint, 
    getTeacherByIdEndpoint, 
    deleteTeacherEndpoint, 
    updateTeacherEndpoint 
} from '../controllers/handleTeacherController';

const router = Router();

// Endpoint to add a teacher
router.post('/add', addTeacherEndpoint);

// Endpoint to assign subjects to a teacher
router.post('/assign-subjects', assignSubjectsToTeacherEndpoint);

// Endpoint to get all teachers
router.get('/all', getAllTeachersEndpoint);

// Endpoint to get a teacher by id
router.get('/:teacherId', getTeacherByIdEndpoint);

// Endpoint to delete a teacher
router.delete('/delete/:teacherId', deleteTeacherEndpoint);

// Endpoint to update a teacher
router.put('/update/:teacherId', updateTeacherEndpoint);

export default router;