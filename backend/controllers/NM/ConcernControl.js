
import Concerns  from "../../models/NM/Concerns.js";


export const createConcerns = async (req, res) => {
    try {
        console.log('=== CREATE CONCERN DEBUG ===');
        console.log('Request body:', req.body);
        
        const { 
            name, 
            email, 
            phone, 
            message, 
            businessType, 
            inquiryType,
            companyName,
            position
        } = req.body;

        // Basic validation
        if (!name || !email || !phone || !message) {
            console.log('Missing required fields:', { name, email, phone, message });
            return res.status(400).json({
                success: false,
                message: 'Name, email, phone, and message are required',
            });
        }

        // Prepare data - only include fields that exist in schema
        const concernData = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            message: message.trim(),
        };

        // Add optional fields only if they exist and are valid
        if (businessType && ['maple', 'nm'].includes(businessType)) {
            concernData.businessType = businessType;
        }
        
        if (inquiryType && ['general', 'employer-partnership', 'package-information', 'others'].includes(inquiryType)) {
            concernData.inquiryType = inquiryType;
        }
        
        if (companyName && companyName.trim()) {
            concernData.companyName = companyName.trim();
        }
        
        if (position && position.trim()) {
            concernData.position = position.trim();
        }

        console.log('Saving concern with data:', concernData);

        const newConcerns = await Concerns.create(concernData);
        
        console.log('Concern created successfully:', newConcerns._id);

        // Custom success message
        let successMessage = 'Your message has been sent successfully!';
        
        if (businessType === 'maple') {
            if (inquiryType === 'package-information') {
                successMessage = 'Thank you for your interest! We will send you our package details shortly.';
            } else {
                successMessage = 'Thank you for contacting Maple Street Photography! We will get back to you soon.';
            }
        } else if (businessType === 'nm') {
            if (inquiryType === 'employer-partnership') {
                successMessage = 'Thank you for your partnership interest! Our recruitment team will contact you soon.';
            } else {
                successMessage = 'Thank you for contacting N&M Staffing! Our team will respond within 24 hours.';
            }
        }

        res.status(201).json({
            success: true,
            message: successMessage,
            data: {
                id: newConcerns._id,
                name: newConcerns.name,
                email: newConcerns.email,
                phone: newConcerns.phone,
                businessType: newConcerns.businessType,
                inquiryType: newConcerns.inquiryType,
                status: newConcerns.status,
                createdAt: newConcerns.createdAt,
            },
        });
        
    } catch (error) {
        console.error('❌ Error creating concern:', error);
        console.error('Error stack:', error.stack);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


// Get concerns
export const getConcerns = async (req, res) => {
    try {
        const concerns = await Concerns.find({})
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'Concerns retrieved successfully',
            data: concerns, 
            count: concerns.length,
        })
        
    } catch (error) {
        console.error('Error fetching concerns:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}


// View Concerns
export const getViewConcerns = async (req, res) => {
    try {
        const { concernId } = req.params;
        const concern = await Concerns.findById(concernId);

        if (!concern) {
            return res.status(404).json({
                success: false,
                message: 'Concern not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Concern retrieved successfully',
            data: concern,
        })

    } catch (error) {
        console.error('Error fetching concern:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

// Update Concerns
export const updateConcerns = async (req, res) => {
    try {
        const { concernId } = req.params;
        const { status, notes } = req.body;

        if (!status){
            return res.status(400).json({
                success: false,
                message: 'Status is required',
            });
        }

        const updatedConcern = await Concerns.findByIdAndUpdate(
            concernId, 
            { status, notes },
            { new: true, runValidators: true }
        );

        if (!updatedConcern) {
            return res.status(404).json({
                success: false,
                message: 'Concern not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Concern updated successfully',
            data: updatedConcern,
        });

    } catch (error) {
        console.error('Error updating concern:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

export const deleteConcerns = async (req, res) => {
    try {
        const { concernId } = req.params;

        const deletedConcern = await Concerns.findByIdAndDelete(concernId);

        if (!deletedConcern) {
            return res.status(404).json({
                success: false,
                message: 'Concern not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Concern deleted successfully',
            data: deletedConcern,
        });

    } catch (error) {
        console.error('Error deleting concern:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}