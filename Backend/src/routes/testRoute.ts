import express from 'express';
import { addTestEndpoint, getAllTestsEndpoint, getStudentIdsFromTestEndpoint, getStudentDetailsFromIdsEndpoint, deleteTestEndpoint, editTestEndpoint, getAllTestsByStandardEndpoint } from '../controllers/handleTestController';
import { verifyToken } from '../middleware/midlleware';

const router = express.Router();

// Endpoint to add a test
router.post('/add', verifyToken, addTestEndpoint);

// Endpoint to get all tests
router.get('/all', verifyToken, getAllTestsEndpoint);

// Endpoint to get student ids from a test
router.get('/studentIds/:testId', verifyToken,  getStudentIdsFromTestEndpoint);

// Endpoint to get student details from ids
router.post('/studentDetails', verifyToken ,getStudentDetailsFromIdsEndpoint);

// Endpoint to delete a test
router.delete('/delete', verifyToken, deleteTestEndpoint);

// Endpoint to edit a test
router.put('/edit',verifyToken ,editTestEndpoint);

//Endpoint to get all tests by standard
router.get('/standard/:standardId', getAllTestsByStandardEndpoint); // use in app


export default router;