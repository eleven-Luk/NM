// controllers/NM/ConcernControl.js
import Concerns from "../../models/NM/Concerns.js";

export const createConcerns = async (req, res) => {
    try {
        const { 
            name, 
            email, 
            phone, 
            message, 
            businessType, 
            inquiryType,
            companyName,
            position,
            packageType,
        } = req.body;

        // Basic validation
        if (!name || !email || !phone || !message || !businessType || !inquiryType) {
            console.log('Missing required fields:', { name, email, phone, message });
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields',
            });
        }

        // Additional validation for employer partnership
        if (businessType === 'nm' && inquiryType === 'employer-partnership' && !companyName) {
            return res.status(400).json({
                success: false,
                message: 'Company name is required for employer partnership inquiries'
            });
        }

        // Create Concern - ACTUALLY SAVE TO DATABASE
        const newConcern = await Concerns.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            message: message.trim(),
            businessType,
            inquiryType,
            companyName: companyName ? companyName.trim() : undefined,
            position: position ? position.trim() : undefined,
            packageType: packageType ? packageType.trim() : undefined,
        });

        res.status(201).json({
            success: true,
            message: 'Your message has been sent successfully!',
            data: newConcern,
        });

    } catch (error) {
        console.error('❌ Error creating concern:', error);
        
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
            error: error.message
        });
    }
};

// Get concerns by business type - FIX: Use req.params, not req.query
export const getConcernsByBusinessType = async (req, res) => {
    try {
        const { businessType } = req.params; // CHANGE: req.params instead of req.query

        if (!['nm', 'maple'].includes(businessType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid business type. Must be "nm" or "maple"'
            });
        }

        const concerns = await Concerns.find({ businessType })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: `${businessType === 'nm' ? 'N&M' : 'Maple'} concerns retrieved successfully`,
            data: concerns, 
            count: concerns.length,
        });
        
    } catch (error) {
        console.error('Error fetching concerns:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

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

        res.json({
            success: true,
            message: 'Concern found successfully',
            data: concern
        });

    } catch (error) {
        console.error('Error fetching concern:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Update Concerns - FIX: Use Concerns model
export const updateConcerns = async (req, res) => {
    try {
        const { concernId } = req.params;
        const { status, notes, priority } = req.body;

        const updatedConcern = await Concerns.findByIdAndUpdate( // CHANGE: Concerns not Concern
            concernId,
            { status, notes, priority, updatedAt: new Date() },
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
};

// Delete Concerns
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
};