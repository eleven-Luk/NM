import Appointment from "../../models/Maple/Appointment.js";

export const createAppointment = async (req, res) => {
    try {
        const { name, email, phone, packageType, preferredDate, preferredTime, durationHours, location, specialRequests } = req.body;

        // Validation
        if (!name || !email || !phone || !packageType || !preferredDate || !preferredTime || !location || !durationHours) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields',
            });
        }

        const existingAppointment = await Appointment.findOne({ email, preferredDate, preferredTime });

        if (existingAppointment) {
            console.error('❌ Appointment already exists for this email and time slot:', { email, preferredDate, preferredTime });
            return res.status(400).json({
                success: false,
                message: 'An appointment already exists for this email and time slot. Please choose a different time or contact support.',
            });
        }

        const newAppointment = await Appointment.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            packageType: packageType.trim(),
            preferredDate: new Date(preferredDate),
            preferredTime: preferredTime.trim(),
            durationHours: Number(durationHours),
            location: location.trim(),
            specialRequests: specialRequests ? specialRequests.trim() : '',
        });

        return res.status(201).json({
            success: true,
            message: 'Your appointment has been booked successfully!',
            data: newAppointment,
        });
    } catch (error) {

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            console.log('Validation errors:', errors);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
        
    }
}

export const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({
            $or: [
                { deletedAt: null }, 
                { deletedAt: { $exists: false } }
            ],
            status: { $nin: ['archived', 'rescheduled'] }
        }).sort({ preferredDate: 1, preferredTime: 1, createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'Appointments retrieved successfully',
            data: appointments,
            count: appointments.length,
        });

    } catch (error) {
        console.error('❌ Error retrieving appointments:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

export const getViewAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;

        const appointment = await Appointment.findById(appointmentId);

        if (!appointment){
            return res.status(404).json({
                success: false,
                message: 'Appointment not found',
            });
        }

        res.json({
            success: true,
            message: 'Appointment retrieved successfully',
            data: appointment,
        })
        
    } catch (error) {
        console.error('Get Appointment Error: ', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });      
    }
}

// Update appointment (for rescheduling or status updates)
export const updateAppointmentStatus = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { status, notes } = req.body;

        // Validation
        if (!status || !notes) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields',
            });
        }

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { status, notes },
            { new: true, runValidators: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Appointment status updated successfully',
            data: updatedAppointment,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

export const deleteAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;

        const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId);

        if (!deletedAppointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Appointment deleted successfully',
            data: deletedAppointment,
        });

    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}