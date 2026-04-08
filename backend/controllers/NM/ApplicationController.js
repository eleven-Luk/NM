import Application from '../../models/NM/Application.js';
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
        console.log('✅ Email server is ready for applications');
    }
});

// Send status update email for applications
const sendApplicationStatusEmail = async (application, newStatus, adminMessage) => {
    const statusMessages = {
        pending: 'Your application has been received and is pending review.',
        reviewed: 'Your application has been reviewed by our hiring team.',
        interviewed: 'Congratulations! You have been selected for an interview.',
        hired: 'We are pleased to inform you that you have been hired!',
        rejected: 'Thank you for your interest, but we have decided to move forward with other candidates.'
    };

    const statusColors = {
        pending: '#f59e0b',
        reviewed: '#3b82f6',
        interviewed: '#8b5cf6',
        hired: '#10b981',
        rejected: '#ef4444'
    };

    const statusIcons = {
        pending: '⏳',
        reviewed: '👀',
        interviewed: '🎤',
        hired: '🎉',
        rejected: '📧'
    };

    const jobName = application.jobId?.name || 'the position';
    const applicantName = `${application.firstName} ${application.lastName}`;

    const mailOptions = {
        from: `"NM Staffing" <${process.env.EMAIL_USER}>`,
        to: application.email,
        subject: `Application Status Update - ${newStatus.toUpperCase()} - ${jobName}`,
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
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">NM Staffing</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 14px;">Application Status Update</p>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 40px 35px;">
                        <!-- Status Badge -->
                        <div style="text-align: center; margin-bottom: 30px;">
                            <div style="display: inline-block; padding: 8px 24px; background: ${statusColors[newStatus]}15; border-radius: 50px; border: 1px solid ${statusColors[newStatus]}30;">
                                <span style="color: ${statusColors[newStatus]}; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">
                                    ${newStatus.toUpperCase()}
                                </span>
                            </div>
                        </div>
                        
                        <!-- Greeting -->
                        <h2 style="color: #1f2937; font-size: 22px; font-weight: 600; margin-bottom: 15px;">
                            Dear ${applicantName},
                        </h2>
                        
                        <!-- Status Message -->
                        <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px; font-size: 15px;">
                            ${statusMessages[newStatus]}
                        </p>
                        
                        <!-- Application Details Card -->
                        <div style="background: #f9fafb; border-radius: 16px; padding: 25px; margin: 25px 0; border: 1px solid #e5e7eb;">
                            <h3 style="color: #374151; margin: 0 0 20px 0; font-size: 16px; font-weight: 600;">📋 Application Details</h3>
                            <div style="display: grid; gap: 15px;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <span style="font-size: 22px;">💼</span>
                                    <div>
                                        <p style="color: #6b7280; font-size: 11px; margin-bottom: 2px;">POSITION APPLIED</p>
                                        <p style="color: #1f2937; font-weight: 500; font-size: 14px;">${jobName}</p>
                                    </div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <span style="font-size: 22px;">📅</span>
                                    <div>
                                        <p style="color: #6b7280; font-size: 11px; margin-bottom: 2px;">APPLICATION DATE</p>
                                        <p style="color: #1f2937; font-weight: 500; font-size: 14px;">${new Date(application.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <span style="font-size: 22px;">📧</span>
                                    <div>
                                        <p style="color: #6b7280; font-size: 11px; margin-bottom: 2px;">CONTACT EMAIL</p>
                                        <p style="color: #1f2937; font-weight: 500; font-size: 14px;">${application.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Admin Message -->
                        ${adminMessage && adminMessage.trim() !== '' ? `
                        <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 18px; margin: 25px 0; border-radius: 12px;">
                            <p style="color: #1e40af; margin: 0; font-size: 13px; line-height: 1.5;">
                                <strong style="display: block; margin-bottom: 8px;">💬 Message from our hiring team:</strong>
                                ${adminMessage}
                            </p>
                        </div>
                        ` : ''}
                        
                        <!-- Next Steps -->
                        <div style="background: #f0fdf4; border-radius: 16px; padding: 20px; margin: 25px 0; border: 1px solid #bbf7d0;">
                            <h4 style="color: #166534; margin: 0 0 12px 0; font-size: 14px; font-weight: 600;">📌 What's next?</h4>
                            <p style="color: #166534; margin: 0; font-size: 13px; line-height: 1.5;">
                                ${newStatus === 'interviewed' ? 'Our recruitment team will contact you within 3-5 business days to schedule the interview. Please prepare your portfolio and references.' :
                                  newStatus === 'hired' ? 'You will receive an onboarding email within 24 hours with next steps, including contract signing and orientation schedule.' :
                                  newStatus === 'rejected' ? 'We encourage you to visit our careers page for other opportunities that match your skills and experience.' :
                                  newStatus === 'reviewed' ? 'We will notify you once a decision has been made regarding your application.' :
                                  'Thank you for your patience. We will update you as soon as possible.'}
                            </p>
                        </div>
                        
                        <!-- Footer -->
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0 20px;">
                        
                        <div style="text-align: center;">
                            <p style="color: #9ca3af; font-size: 12px; margin: 0 0 10px 0;">
                                Need to follow up? Contact our HR team at
                            </p>
                            <a href="mailto:${process.env.EMAIL_USER}" style="color: ${statusColors[newStatus]}; text-decoration: none; font-size: 13px; font-weight: 500;">
                                ${process.env.EMAIL_USER}
                            </a>
                            <p style="color: #d1d5db; font-size: 10px; margin-top: 20px;">
                                © ${new Date().getFullYear()} NM Staffing. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    console.log(`📧 Sending email to ${application.email} about status: ${newStatus}`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent: ${info.messageId}`);
    return info;
};

export const createApplication = async (req, res) => {
    // Your existing createApplication code...
    try {
        const { firstName, middleName, lastName, email, phone, jobId, resume, message } = req.body;
        
        if (!firstName || !lastName || !email || !phone || !jobId || !resume) {
            return res.status(400).json({ 
                success: false,
                message: 'Please fill in all fields',
            });
        }

        const existingApplication = await Application.findOne({ email, jobId });
        
        if (existingApplication) {
            return res.status(400).json({ 
                success: false,
                message: 'You have already applied for this job' 
            });
        }

        const newApplication = await Application.create({
            firstName: firstName.trim(),
            middleName: middleName?.trim() || '',
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            jobId,
            resume,
            message: message || '',
        });

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: newApplication
        });
        
    } catch (error) {
        console.error('Error in createApplication:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors
            });
        }
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied for this job'
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
};

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
        });
        
    } catch (error) {
        console.error('Get Application Error: ', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching application',
        });
    }
};

// Update application status with email notification
export const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status, notes, sendEmail, adminMessage } = req.body;
        
        // Get original application before update
        const originalApplication = await Application.findById(applicationId).populate('jobId', 'name');
        
        if (!originalApplication) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }
        
        const oldStatus = originalApplication.status;
        console.log('Old status:', oldStatus);
        
        // Update application
        const updatedApplication = await Application.findByIdAndUpdate(
            applicationId,
            { status, notes },
            { new: true, runValidators: true }
        ).populate('jobId', 'name');
        
        // Send email ONLY if sendEmail is true AND status changed
        const shouldSendEmail = sendEmail === true && oldStatus !== status;
        console.log('Should send email:', shouldSendEmail);
        
        if (shouldSendEmail) {
            try {
                await sendApplicationStatusEmail(updatedApplication, status, adminMessage);
                console.log(`✅ Email sent to ${updatedApplication.email}`);
            } catch (emailError) {
                console.error('❌ Email failed:', emailError);
            }
        } else {
            console.log(`📧 Email NOT sent - Reason: sendEmail=${sendEmail}, statusChanged=${oldStatus !== status}`);
        }
        
        res.status(200).json({
            success: true,
            message: 'Application status updated successfully',
            data: updatedApplication
        });
        
    } catch (error) {
        console.error('Update application error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const moveToArchive = async (req, res) => {
    try {
        const { applicationId } = req.params;

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
        );
        
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
                archivedAt: movedApplication.archivedAt,
            }
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid application ID format'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to move application to archive',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

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
        });

    } catch (error) {
        console.error('Get Archived Applications Error: ', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

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
                $unset: { deletedAt: '' },
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
        });

    } catch (error) {
        console.error('Restore Application Error: ', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

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
        });

    } catch (error) {
        console.error('Delete Application Error: ', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};