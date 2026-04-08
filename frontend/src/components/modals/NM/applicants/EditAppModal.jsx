import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUser,
    faEnvelope,
    faPhone,
    faFileAlt,
    faComment,
    faSave,
    faUserCheck,
    faCheckCircle,
    faClock,
    faUserGraduate,
    faTimes,
    faPaperPlane,
    faEnvelope as faEnvelopeSolid
} from '@fortawesome/free-solid-svg-icons';
import FormModal from '../../common/FormModal';

function EditAppModal({ isOpen, onClose, onSave, application }) {
    const [formData, setFormData] = useState({
        status: 'pending',
        notes: '',
        sendEmail: true,
        adminMessage: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [charCount, setCharCount] = useState(0);
    const [messageCharCount, setMessageCharCount] = useState(0);

    const resetForm = () => {
        setFormData({
            status: 'pending',
            notes: '',
            sendEmail: true,
            adminMessage: ''
        });
        setCharCount(0);
        setMessageCharCount(0);
        setError('');
        setSuccess('');
        setLoading(false);
    };

    useEffect(() => {
        if (application && isOpen) {
            setFormData({
                status: application.status || 'pending',
                notes: application.notes || '',
                sendEmail: true,
                adminMessage: ''
            });
            setCharCount(application.notes?.length || 0);
        } else if (!isOpen) {
            resetForm();
        }
    }, [application, isOpen]);

    const validateForm = () => {
        if (!formData.status) {
            setError('Status is required');
            return false;
        }
        if (formData.notes && formData.notes.length > 500) {
            setError('Notes cannot exceed 500 characters');
            return false;
        }
        if (formData.adminMessage && formData.adminMessage.length > 300) {
            setError('Admin message cannot exceed 300 characters');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;
        
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const applicationData = { 
                status: formData.status,
                notes: formData.notes,
                sendEmail: formData.sendEmail === true, // Force boolean
                adminMessage: formData.adminMessage || ''
            };

            console.log('Sending data:', applicationData); // Debug log
            
            await onSave(applicationData);
            
            if (formData.sendEmail && formData.status !== application?.status) {
                setSuccess('Application updated and email notification sent!');
            } else {
                setSuccess('Application updated successfully');
            }

            setTimeout(() => {
                setSuccess('');
                onClose();
            }, 2000);

        } catch (error) {
            setError(error.message || 'Failed to update application');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        if (name === 'notes') {
            setCharCount(value.length);
        }
        if (name === 'adminMessage') {
            setMessageCharCount(value.length);
        }
        
        if (error) {
            setError('');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            reviewed: 'bg-blue-100 text-blue-800 border-blue-200',
            interviewed: 'bg-purple-100 text-purple-800 border-purple-200',
            hired: 'bg-green-100 text-green-800 border-green-200',
            rejected: 'bg-red-100 text-red-800 border-red-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status) => {
        const labels = {
            pending: 'Pending Review',
            reviewed: 'Reviewed',
            interviewed: 'Interviewed',
            hired: 'Hired',
            rejected: 'Rejected'
        };
        return labels[status] || status;
    };

    const statusOptions = [
        { value: 'pending', label: 'Pending Review', icon: faClock, color: 'text-yellow-600' },
        { value: 'reviewed', label: 'Reviewed', icon: faUserCheck, color: 'text-blue-600' },
        { value: 'interviewed', label: 'Interviewed', icon: faUserGraduate, color: 'text-purple-600' },
        { value: 'hired', label: 'Hired', icon: faCheckCircle, color: 'text-green-600' },
        { value: 'rejected', label: 'Rejected', icon: faTimes, color: 'text-red-600' }
    ];

    return (
        <FormModal 
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
            title="Update Application"
            subtitle={`Applicant: ${application?.firstName || ''} ${application?.lastName || ''}`}
            loading={loading}
            error={error}
            success={success}
            submitText="Update & Send Notification"
            submitIcon={faPaperPlane}
            maxWidth="max-w-lg"
            icon={faUser}
            iconColor="text-green-500"
        >
            {/* Application Details */}
            {application && (
                <div className='mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200'>
                    <div className='flex items-center gap-3 mb-3'>
                        <div className='w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center'>
                            <FontAwesomeIcon icon={faUser} className='text-lg text-orange-500' />
                        </div>
                        <div>
                            <h3 className='font-semibold text-gray-900'>
                                {application.firstName} {application.middleName || ''} {application.lastName}
                            </h3>
                            <p className='text-sm text-gray-500'>
                                Applied for: {application.jobId?.name || 'Position'}
                            </p>
                        </div>
                    </div>

                    <div className='grid grid-cols-2 gap-2 text-sm'>
                        <div className='flex items-center gap-2'>
                            <FontAwesomeIcon icon={faEnvelope} className='text-gray-400 text-xs' />
                            <span className='text-gray-600'>{application.email}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <FontAwesomeIcon icon={faPhone} className='text-gray-400 text-xs' />
                            <span className='text-gray-600'>{application.phone}</span>
                        </div>
                        {application.resume && (
                            <div className='flex items-center gap-2'>
                                <FontAwesomeIcon icon={faFileAlt} className='text-gray-400 text-xs' />
                                <a 
                                    href={application.resume}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className='text-blue-600 hover:underline'
                                >
                                    View Resume
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Current status display */}
            <div className='mb-6 p-4 bg-orange-50 rounded-xl border border-orange-200'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <FontAwesomeIcon icon={faUserCheck} className='text-orange-500' />
                        <span className='text-sm font-medium text-gray-700'>Current Status:</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium 
                        ${getStatusColor(application?.status)}`}>
                        {getStatusLabel(application?.status)?.toUpperCase() || 'N/A'}
                    </span>
                </div>
            </div>

            {/* Status selection - Grid buttons */}
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                    <FontAwesomeIcon icon={faUserCheck} className='mr-2 text-gray-400' />
                    Update Status *
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {statusOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleChange({ target: { name: 'status', value: option.value } })}
                            className={`p-3 rounded-xl border-2 transition-all ${
                                formData.status === option.value
                                    ? `${option.color} border-current bg-opacity-10 shadow-md`
                                    : 'border-gray-200 hover:border-orange-300 bg-white'
                            }`}
                        >
                            <FontAwesomeIcon icon={option.icon} className={`${option.color} mb-1`} />
                            <p className="text-xs font-medium mt-1">{option.label}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Admin Notes (Internal) */}
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                    <FontAwesomeIcon icon={faComment} className='mr-2 text-gray-400' />
                    Internal Notes
                </label>
                <div className="relative">
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="3"
                        maxLength="500"
                        placeholder="Add internal notes about this applicant (only visible to admins)..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 transition-all bg-white resize-none"
                        disabled={loading}
                    />
                    <div className="absolute bottom-3 right-3">
                        <span className={`text-xs ${charCount > 450 ? 'text-orange-500' : 'text-gray-400'}`}>
                            {charCount}/500
                        </span>
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    These notes are for internal use only
                </p>
            </div>

            {/* Send Email Notification Toggle */}
            {formData.status !== application?.status && (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            name="sendEmail"
                            checked={formData.sendEmail}
                            onChange={(e) => {
                                const newValue = e.target.checked;
                                console.log('Checkbox changed to:', newValue);
                                setFormData(prev => ({
                                    ...prev,
                                    sendEmail: newValue
                                }));
                            }}
                            className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                            disabled={loading}
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faEnvelopeSolid} className="text-blue-600" />
                                <span className="font-medium text-gray-900">Send email notification to applicant</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                                Notify {application?.firstName} about this status change
                            </p>
                        </div>
                    </label>
                </div>
            )}

            {/* Admin Message for Email */}
            {formData.sendEmail && formData.status !== application?.status && (
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                        <FontAwesomeIcon icon={faPaperPlane} className='mr-2 text-gray-400' />
                        Personal Message to Applicant (Optional)
                    </label>
                    <div className="relative">
                        <textarea
                            name="adminMessage"
                            value={formData.adminMessage}
                            onChange={handleChange}
                            rows="3"
                            maxLength="300"
                            placeholder="Add a personal message to include in the email notification..."
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 transition-all bg-white resize-none"
                            disabled={loading}
                        />
                        <div className="absolute bottom-3 right-3">
                            <span className={`text-xs ${messageCharCount > 270 ? 'text-orange-500' : 'text-gray-400'}`}>
                                {messageCharCount}/300
                            </span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        This message will be included in the email sent to the applicant
                    </p>
                </div>
            )}

            {/* Status Change Preview */}
            {formData.status !== application?.status && application && (
                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-start gap-2">
                        <FontAwesomeIcon icon={faPaperPlane} className="text-blue-600 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-blue-800 mb-1">Notification Preview</p>
                            <p className="text-xs text-blue-700">
                                Status will change from <strong>{getStatusLabel(application?.status)}</strong> to <strong>{getStatusLabel(formData.status)}</strong>
                                {formData.sendEmail && (
                                    <span className="block mt-1">
                                        📧 Email will be sent to: <strong>{application?.email}</strong>
                                    </span>
                                )}
                                {!formData.sendEmail && (
                                    <span className="block mt-1">
                                        ⚠️ Email notification is turned OFF
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </FormModal>
    );
}

export default EditAppModal;