import express from 'express';
import { uploadResume } from '../../middleware/upload.js';
import { createApplication, getApplications, updateApplicationStatus, moveToArchive, getArchivedApplications, getViewApplication, restoreApplication, deleteApplication } from '../../controllers/NM/ApplicationController.js';

const router = express.Router();

// Public routes
router.post('/create', uploadResume, createApplication);

// Protected routes
router.get('/getAll', getApplications);
router.get('/archived', getArchivedApplications);
router.get('/view/:applicationId', getViewApplication);

router.put('/updateStatus/:applicationId', updateApplicationStatus);
router.patch('/archive/:applicationId', moveToArchive);  
router.put('/restore/:applicationId', restoreApplication);

router.delete('/delete/:applicationId', deleteApplication);

export default router;
