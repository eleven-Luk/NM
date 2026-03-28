// models/NM/Concern.js
import mongoose from 'mongoose';

const concernsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
    },

    businessType: {
        type: String,
        enum: ['maple', 'nm'],
        default: 'nm',
    },
    
    inquiryType: {
        type: String,
        enum: ['general', 'employer-partnership', 'package-information', 'others'],
        default: 'general',
    },
    
    // For employer-partnership inquiries
    companyName: {
        type: String,
        trim: true,
    },
    
    // For employer-partnership inquiries (optional)
    position: {
        type: String,
        trim: true,
    },

    // For Admin Use
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved', 'rejected'],
        default: 'pending',
    },
    notes: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});

// Add indexes for better query performance
concernsSchema.index({ email: 1 });
concernsSchema.index({ phone: 1 });
concernsSchema.index({ businessType: 1 });
concernsSchema.index({ inquiryType: 1 });
concernsSchema.index({ status: 1 });
concernsSchema.index({ createdAt: -1 });

const Concerns = mongoose.model('Concerns', concernsSchema);
export default Concerns;