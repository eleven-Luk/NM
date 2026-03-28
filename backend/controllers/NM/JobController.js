import Job from "../../models/NM/Job.js";


// Create job
export const createJob = async (req, res) => {
    try {
        const { name, description, type, salary, location } = req.body;

        // Validation
        if (!name || !description || !type || !salary || !location) {
            return res.status(400).json({
                success: false,
                message: 'Name, Description, Type, Salary, and Location are required'
            });
        }

        // Check for duplicate Job
        const existingJob = await Job.findOne({ name }); 
        if (existingJob) {
            return res.status(400).json({
                success: false,
                message: 'Job with this name already exists'
            });
        }

        const newJob = await Job.create({
            name: name.trim(),
            description: description.trim(),
            type: type.trim(),
            salary: salary.trim(),
            location: location.trim(),
        });

        res.status(201).json({
            success: true,
            message: 'Job posted successfully',
            data: newJob
        })

    } catch (error) {
        console.error('Create Job Error: ', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        if (error.code === 11000){
            return res.status(400).json({
                success: false,
                message: 'Job with this name already exists'
            })
        }
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update job
export const updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, type, salary, location, status } = req.body;

        // Find existing job
        const existingJob = await Job.findById(id);
        if (!existingJob) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }


        // Update job data
        const updatedJob = await Job.findByIdAndUpdate(
            id,
            {
                name: name?.trim(),
                description: description?.trim(),
                type: type?.trim(),
                salary: salary?.trim(),
                location: location?.trim(),
                status: status?.trim(),
                updatedAt: new Date(),
            },
            { new: true, runValidators: true } // This returns the updated document
        );

        res.json({
            success: true,
            message: 'Job updated successfully',
            data: updatedJob
        });

    } catch (error) {
        console.error('Update Job Error: ', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors
            });
        }
        
        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Product with this name already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Server error updating product',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

export const getViewJob = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job.findById(id);

        if (!job){
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        res.json({
            success: true,
            message: 'Job found successfully',
            data: job
        })
        
    } catch (error) {
        console.error('Get Job Error: ', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching job',
        })
    }
}

// Soft Delete Job
export const softDeleteJob = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedJob = await Job.findByIdAndUpdate(id,
            {
                deletedAt: new Date(),
                status: 'deleted'
            },
            { new : true }
         );

        if (!deletedJob){
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

         res.status(200).json({
            success: true, 
            message: 'Job deleted successfully',
            data: {
                id: deletedJob._id,
                name: deletedJob.name,
                description: deletedJob.description,
                type: deletedJob.type,
                salary: deletedJob.salary,
                location: deletedJob.location,
            }
         });

    } catch (error) {
        console.error('Delete Job Error: ', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting job',
        })
    }
}

// Permanently delete job
export const permanentlyDeleteJob = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedJob = await Job.findByIdAndDelete(id);

        if (!deletedJob){
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        res.json({
            success: true,
            message: 'Job deleted successfully',
            data: {
                id: deletedJob._id,
                name: deletedJob.name,
                description: deletedJob.description,
                type: deletedJob.type,
                salary: deletedJob.salary,
                location: deletedJob.location,
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error deleting job',
        });
    }
};

// Restore Job
export const restoreJob = async (req, res) => {
    try {
        const { id } = req.params;

        const restoredJob = await Job.findByIdAndUpdate(id, {
            $unset: { deletedAt: ''},
            $set: { status: 'active' }
        }, { new: true });

        res.status(200).json({
            success: true,
            message: 'Job restored successfully',
            data: restoredJob
        });

    } catch (error) {
        console.error('Restore Job Error: ', error);
        res.status(500).json({
            success: false,
            message: 'Server error restoring job',
        });
    }
}

export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({
            $or: [
                { deletedAt: null },               // deletedAt is null
                { deletedAt: { $exists: false } }, // OR no deletedAt field
                { status: { $ne: 'deleted' } }     // OR status is not 'deleted'
            ]
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: jobs,
            count: jobs.length,
            message: `Found ${jobs.length} active jobs`
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching jobs',
        });
    }
};