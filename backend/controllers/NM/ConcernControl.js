import Concerns from "../../models/NM/Concerns.js";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify transporter
transporter.verify((error, success) => {
    if (error) {
        console.error('Email transporter error:', error);
    } else {
        console.log('✅ Email server is ready for concerns');
    }
});

// Send status update email for concerns
const sendStatusUpdateEmail = async (concern, newStatus, adminMessage, priority) => {
    // Status messages with proper formatting
    const statusMessages = {
        pending: 'Your concern has been received and is pending review by our team. We will get back to you as soon as possible.',
        reviewed: 'Good news! Your concern has been reviewed by our team. We are currently working on addressing it.',
        resolved: 'Great news! Your concern has been successfully resolved. Thank you for your patience.',
        rejected: 'Thank you for reaching out. After careful review, we are unable to address your concern at this time.'
    };

    // Status titles for display
    const statusTitles = {
        pending: 'Pending Review',
        reviewed: 'Under Review',
        resolved: 'Resolved',
        rejected: 'Not Accepted'
    };

    const statusColors = {
        pending: '#f59e0b',
        reviewed: '#3b82f6',
        resolved: '#10b981',
        rejected: '#ef4444'
    };

    const statusIcons = {
        pending: '⏳',
        reviewed: '👀',
        resolved: '✅',
        rejected: '📧'
    };

    const priorityLabels = {
        low: 'Low Priority',
        medium: 'Medium Priority',
        high: 'High Priority'
    };

    const priorityColors = {
        low: '#10b981',
        medium: '#f59e0b',
        high: '#ef4444'
    };

    const priorityIcons = {
        low: '🟢',
        medium: '🟡',
        high: '🔴'
    };

    const businessName = concern.businessType === 'maple' ? 'Maple Photography' : 'N&M Staffing';
    const businessLogo = concern.businessType === 'maple' ? '📸' : '🏢';
    const businessColor = concern.businessType === 'maple' ? '#f97316' : '#3b82f6';

    const mailOptions = {
        from: `"${businessName} Support" <${process.env.EMAIL_USER}>`,
        to: concern.email,
        subject: `[${businessName}] Concern Status Update - ${statusTitles[newStatus]} (Ref: ${concern._id.toString().slice(-6)})`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                </style>
            </head>
            <body style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <div style="max-width: 550px; margin: 50px auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
                    <!-- Header -->
                    <div style="background: ${statusColors[newStatus]}; padding: 40px 30px; text-align: center;">
                        <div style="font-size: 56px; margin-bottom: 15px;">${statusIcons[newStatus]}</div>
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">${businessName}</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 14px;">Concern Status Update</p>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 40px 35px;">
                        <!-- Status Badge -->
                        <div style="text-align: center; margin-bottom: 30px;">
                            <div style="display: inline-block; padding: 8px 24px; background: ${statusColors[newStatus]}15; border-radius: 50px; border: 1px solid ${statusColors[newStatus]}30;">
                                <span style="color: ${statusColors[newStatus]}; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">
                                    ${statusTitles[newStatus].toUpperCase()}
                                </span>
                            </div>
                        </div>
                        
                        <!-- Greeting -->
                        <h2 style="color: #1f2937; font-size: 22px; font-weight: 600; margin-bottom: 15px;">
                            Dear ${concern.name},
                        </h2>
                        
                        <!-- Status Message - This is the main message that changes based on status -->
                        <div style="background: ${statusColors[newStatus]}10; border-radius: 16px; padding: 20px; margin: 20px 0;">
                            <p style="color: #1f2937; line-height: 1.7; margin: 0; font-size: 15px;">
                                ${statusMessages[newStatus]}
                            </p>
                        </div>
                        
                        <!-- Concern Details Card -->
                        <div style="background: #f9fafb; border-radius: 16px; padding: 25px; margin: 25px 0; border: 1px solid #e5e7eb;">
                            <h3 style="color: #374151; margin: 0 0 20px 0; font-size: 16px; font-weight: 600;">📋 Concern Details</h3>
                            <div style="display: grid; gap: 15px;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <span style="font-size: 22px;">🔖</span>
                                    <div>
                                        <p style="color: #6b7280; font-size: 11px; margin-bottom: 2px;">REFERENCE NUMBER</p>
                                        <p style="color: #1f2937; font-weight: 500; font-size: 14px;">#${concern._id.toString().slice(-6)}</p>
                                    </div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <span style="font-size: 22px;">🏷️</span>
                                    <div>
                                        <p style="color: #6b7280; font-size: 11px; margin-bottom: 2px;">INQUIRY TYPE</p>
                                        <p style="color: #1f2937; font-weight: 500; font-size: 14px; text-transform: capitalize;">${concern.inquiryType?.replace(/-/g, ' ') || 'General Inquiry'}</p>
                                    </div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <span style="font-size: 22px;">${priorityIcons[priority]}</span>
                                    <div>
                                        <p style="color: #6b7280; font-size: 11px; margin-bottom: 2px;">PRIORITY LEVEL</p>
                                        <p style="color: ${priorityColors[priority]}; font-weight: 600; font-size: 14px;">${priorityLabels[priority]}</p>
                                    </div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <span style="font-size: 22px;">📅</span>
                                    <div>
                                        <p style="color: #6b7280; font-size: 11px; margin-bottom: 2px;">SUBMITTED ON</p>
                                        <p style="color: #1f2937; font-weight: 500; font-size: 14px;">${new Date(concern.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <span style="font-size: 22px;">📝</span>
                                    <div>
                                        <p style="color: #6b7280; font-size: 11px; margin-bottom: 2px;">YOUR MESSAGE</p>
                                        <p style="color: #1f2937; font-size: 13px; line-height: 1.4;">${concern.message.substring(0, 150)}${concern.message.length > 150 ? '...' : ''}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Admin Message -->
                        ${adminMessage && adminMessage.trim() !== '' ? `
                        <div style="background: #eff6ff; border-left: 4px solid ${businessColor}; padding: 18px; margin: 25px 0; border-radius: 12px;">
                            <p style="color: #1e40af; margin: 0; font-size: 13px; line-height: 1.5;">
                                <strong style="display: block; margin-bottom: 8px;">💬 Message from our team:</strong>
                                ${adminMessage}
                            </p>
                        </div>
                        ` : ''}
                        
                        <!-- Next Steps -->
                        <div style="background: #f0fdf4; border-radius: 16px; padding: 20px; margin: 25px 0; border: 1px solid #bbf7d0;">
                            <h4 style="color: #166534; margin: 0 0 12px 0; font-size: 14px; font-weight: 600;">📌 What's next?</h4>
                            <p style="color: #166534; margin: 0; font-size: 13px; line-height: 1.5;">
                                ${newStatus === 'resolved' ? 'Your concern has been fully addressed. If you need further assistance, please don\'t hesitate to create a new concern.' :
                                  newStatus === 'reviewed' ? 'Our team is actively working on your concern. We will provide another update within 2-3 business days.' :
                                  newStatus === 'rejected' ? 'If you believe this was a mistake or need clarification, please reply to this email and we\'ll be happy to assist you.' :
                                  'We appreciate your patience. You will receive another update once our team has reviewed your concern.'}
                            </p>
                        </div>
                        
                        <!-- Contact Info -->
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0 20px;">
                        
                        <div style="text-align: center;">
                            <p style="color: #9ca3af; font-size: 12px; margin: 0 0 10px 0;">
                                Need to follow up on this concern?
                            </p>
                            <a href="mailto:${process.env.EMAIL_USER}" style="color: ${businessColor}; text-decoration: none; font-size: 13px; font-weight: 500;">
                                ${process.env.EMAIL_USER}
                            </a>
                            <p style="color: #d1d5db; font-size: 10px; margin-top: 20px;">
                                © ${new Date().getFullYear()} ${businessName}. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    console.log(`📧 Sending concern email to ${concern.email} about status: ${newStatus}`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Concern email sent: ${info.messageId}`);
    return info;
};

// Create Concern
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

        if (!name || !email || !phone || !message || !businessType || !inquiryType) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields',
            });
        }

        if (businessType === 'nm' && inquiryType === 'employer-partnership' && !companyName) {
            return res.status(400).json({
                success: false,
                message: 'Company name is required for employer partnership inquiries'
            });
        }

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

// Get concerns by business type
export const getConcernsByBusinessType = async (req, res) => {
    try {
        const { businessType } = req.params;

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

// Update Concerns with Email Notification
export const updateConcerns = async (req, res) => {
    try {
        const { concernId } = req.params;
        const { status, notes, priority, sendEmail, adminMessage } = req.body;

        console.log('=== UPDATE CONCERN ===');
        console.log('Concern ID:', concernId);
        console.log('New status:', status);
        console.log('Send email:', sendEmail);
        console.log('Admin message:', adminMessage);

        // Get the original concern before update
        const originalConcern = await Concerns.findById(concernId);

        if (!originalConcern) {
            return res.status(404).json({
                success: false,
                message: 'Concern not found',
            });
        }

        const oldStatus = originalConcern.status;
        console.log('Old status:', oldStatus);

        const updatedConcern = await Concerns.findByIdAndUpdate(
            concernId,
            { 
                status, 
                notes, 
                priority,
                updatedAt: new Date() 
            },
            { new: true, runValidators: true }
        );

        // Send email ONLY if sendEmail is true AND status changed
        const shouldSendEmail = sendEmail === true && oldStatus !== status;
        console.log('Should send email:', shouldSendEmail);

        if (shouldSendEmail) {
            try {
                await sendStatusUpdateEmail(updatedConcern, status, adminMessage, priority);
                console.log(`✅ Email sent to ${updatedConcern.email}`);
            } catch (emailError) {
                console.error('❌ Email failed:', emailError);
            }
        } else {
            console.log(`📧 Email NOT sent - Reason: sendEmail=${sendEmail}, statusChanged=${oldStatus !== status}`);
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