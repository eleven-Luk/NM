import express from 'express';
import { body } from 'express-validator';
import { createJob, getAllJobs, permanentlyDeleteJob, restoreJob, softDeleteJob, getViewJob, updateJob } from '../../controllers/NM/JobController.js';

const router = express.Router();

// Validate job creation
const validateJobCreation = [
    body('name').trim().notEmpty().withMessage('Job name is required'),
    body('description').trim().notEmpty().withMessage('Job description is required'),
    body('type').trim().notEmpty().withMessage('Job type is required'),
    body('salary').isFloat({ min: 0 }).withMessage('Salary must be a positive number'),
    body('location').trim().notEmpty().withMessage('Job location is required'),
];

// Get routes
router.get('/all', getAllJobs);
router.get('/:id', getViewJob);

// Put routes
router.put('/restore/:id', restoreJob);
router.put('/update/:id', validateJobCreation, updateJob);

// Patch routes
router.patch('/soft-delete/:id', softDeleteJob);

// Delete routes
router.delete('/delete/:id', permanentlyDeleteJob);



// Post routes
router.post('/create', validateJobCreation, createJob);

export default router;