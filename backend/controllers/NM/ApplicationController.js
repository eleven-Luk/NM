import Application from '../../models/NM/Application.js';

export const createApplication = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, jobId, resume, message } = req.body;
        
        // Validation 
        if (!firstName || !lastName || !email || !phone || !jobId || !resume) {
            console.log('❌ Validation failed - missing fields:', {
                firstName: !!firstName,
                lastName: !!lastName,
                email: !!email,
                phone: !!phone,
                jobId: !!jobId,
                resume: !!resume
            });
            return res.status(400).json({ 
                success: false,
                message: 'Please fill in all fields',
                missing: {
                    firstName: !firstName,
                    lastName: !lastName,
                    email: !email,
                    phone: !phone,
                    jobId: !jobId,
                    resume: !resume
                }
            });
        }

        const existingApplication = await Application.findOne({ 
            email,
            jobId
        });
        
        if (existingApplication) {
            console.log('⚠️ Duplicate application found');
            return res.status(400).json({ 
                success: false,
                message: 'You have already applied for this job' 
            });
        }

        console.log('✅ No duplicate found');

        // Create application
        console.log('Creating new application...');
        const newApplication = await Application.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            jobId,
            resume,
            message: message || '',
        });

        console.log('✅ Application created successfully:', newApplication._id);

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: newApplication
        });
        
    } catch (error) {
        console.error('❌ ERROR in createApplication:');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
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
        
        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
            console.log('Duplicate key error');
            return res.status(400).json({
                success: false,
                message: 'You have already applied for this job'
            });
        }
        
        // Handle CastError (invalid ObjectId)
        if (error.name === 'CastError') {
            console.log('Invalid ID format');
            return res.status(400).json({
                success: false,
                message: 'Invalid job ID format'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const getApplications = async (req, res) => {
    try {
        const applications = await Application.find({
            $or: [
                { deletedAt: null }, 
                { deletedAt: { $exists: false } }
            ], 
            status: { $nin: ['archived', 'deleted'] }
        })
        .populate('jobId', 'name type location salary')
        .select('-__v')
        .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            message: 'Applications retrieved successfully',
            data: applications,
            count: applications.length
        });

    } catch (error) {
        console.error('Get All Applications Error: ', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

export const getViewApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const application = await Application.findById(applicationId)
        .populate('jobId', 'name type location salary description');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.json({
            success: true,
            message: 'Application found successfully',
            data: application
        })
        
    } catch (error) {
        console.error('Get Application Error: ', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching application',
        })
    }
}

// Update application status
export const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status, notes } = req.body;
        
        // Validation
        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }
        
        // Update application
        const updatedApplication = await Application.findByIdAndUpdate(
            applicationId,
            { status, notes },
            { new: true, runValidators: true }
        );
        
        if (!updatedApplication) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Application status updated successfully',
            data: updatedApplication
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

export const moveToArchive = async (req, res) => {
    try {
        const { applicationId } = req.params;

        // Validation
        if (!applicationId) {
            return res.status(400).json({
                success: false,
                message: 'Application ID is required'
            });
        }

        const now = new Date();

        const movedApplication = await Application.findByIdAndUpdate(
            applicationId,
            {
                archivedAt: now,
                status: 'archived',
            },
            { new: true }
        )
        
        // Check if application exist
        if (!movedApplication) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Application moved to archive successfully',
            data: {
                id: movedApplication._id,
                name: `${movedApplication.firstName} ${movedApplication.lastName}`,
                status: movedApplication.status,
                archivedAt: movedApplication.deletedAt
            }
        });

    } catch (error) {
        // Handle specific MongoDB errors
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid application ID format'
            });
        }

        // General error response
        res.status(500).json({
            success: false,
            message: 'Failed to move application to archive',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

export const getArchivedApplications = async (req, res) => {
    try {
        const archivedApplications = await Application.find({
            status: 'archived',
        })
        .select('-__v')
        .populate('jobId', 'name type location')
        .sort({ archivedAt: -1 });

        res.status(200).json({
            success: true,
            message: 'Archived applications retrieved successfully',
            data: archivedApplications,
            count: archivedApplications.length
        })

    } catch (error) {
        console.error('Get Archived Applications Error: ', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

export const restoreApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;

        if (!applicationId) {
            return res.status(400).json({
                success: false,
                message: 'Application ID is required'
            });
        }
        
        const restoredApplication = await Application.findByIdAndUpdate(
            applicationId, {
                $unset: { deletedAt: ''},
                status: 'pending',
            },
            { new: true }
        );

        if (!restoredApplication) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Application restored successfully',
            data: restoredApplication
        })

    } catch (error) {
        console.error('Restore Application Error: ', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

export const deleteApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;

        const deletedApplication = await Application.findByIdAndDelete(applicationId);
        
        if (!deletedApplication) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Application deleted successfully',
            data: deletedApplication
        })

    } catch (error) {
        console.error('Delete Application Error: ', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}