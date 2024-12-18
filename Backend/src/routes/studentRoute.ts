import express from 'express';
import { addStudentEndpoint, getAllStudentsEndpoint, getStudentByIdEndpoint, deleteStudentEndpoint, editStudentEndpoint } from '../controllers/handleStudentController';

const router = express.Router();

// Endpoint to add a student
router.post('/add', addStudentEndpoint);

// Endpoint to get all students
router.get('/all', getAllStudentsEndpoint);

// Endpoint to get a student by id
router.get('/:studentId', getStudentByIdEndpoint);

// Endpoint to delete a student
router.delete('/delete', deleteStudentEndpoint);

// Endpoint to edit a student
router.put('/edit', editStudentEndpoint);

export default router;