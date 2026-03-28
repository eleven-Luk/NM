import express from 'express';
import { createConcerns, getConcerns, getViewConcerns, updateConcerns, deleteConcerns } from '../../controllers/NM/ConcernControl.js';

const router = express.Router();

// Public routes
router.post('/create', createConcerns);


// Protected routes
router.get('/getAll', getConcerns);
router.get('/view/:concernId', getViewConcerns);

router.put('/update/:concernId', updateConcerns);
router.delete('/delete/:concernId', deleteConcerns);

export default router;
