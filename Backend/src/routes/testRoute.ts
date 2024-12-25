import express from 'express';
import { addTestEndpoint, getAllTestsEndpoint, getStudentIdsFromTestEndpoint, getStudentDetailsFromIdsEndpoint, deleteTestEndpoint, editTestEndpoint, getAllTestsByStandardEndpoint } from '../controllers/handleTestController';

const router = express.Router();

// Endpoint to add a test
router.post('/add', addTestEndpoint);

// Endpoint to get all tests
router.get('/all', getAllTestsEndpoint);

// Endpoint to get student ids from a test
router.get('/studentIds/:testId', getStudentIdsFromTestEndpoint);

// Endpoint to get student details from ids
router.post('/studentDetails', getStudentDetailsFromIdsEndpoint);

// Endpoint to delete a test
router.delete('/delete', deleteTestEndpoint);

// Endpoint to edit a test
router.put('/edit', editTestEndpoint);

//Endpoint to get all tests by standard
router.get('/standard/:standardId', getAllTestsByStandardEndpoint);


export default router;