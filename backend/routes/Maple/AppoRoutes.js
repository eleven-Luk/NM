import express from 'express';
import { protect } from '../../middleware/auth.js';
import { createAppointment, getAppointments, getViewAppointment, updateAppointmentStatus, deleteAppointment} from '../../controllers/Maple/AppointmentControl.js'

const router = express.Router();

// Public Routes
router.post('/create', createAppointment);

// Protected routes
router.get('/get', protect, getAppointments);

router.get('/view/:appointmentId', protect, getViewAppointment);

router.put('/update/:appointmentId', protect, updateAppointmentStatus);

router.delete('/delete/:appointmentId', protect, deleteAppointment);    

export default router;
