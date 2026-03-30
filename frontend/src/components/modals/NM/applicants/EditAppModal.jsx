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
    faTimes
} from '@fortawesome/free-solid-svg-icons';
import FormModal from '../../common/FormModal';

function EditAppModal({ isOpen, onClose, onSave, application }) {
    const [formData, setFormData] = useState({
        status: 'pending',
        notes: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const resetForm = () => {
        setFormData({
            status: 'pending',
            notes: ''
        });
        setError('');
        setSuccess('');
        setLoading(false);
    };


    useEffect(() => {
        if (application && isOpen) {
            setFormData({
                status: application.status || 'pending',
                notes: application.notes || ''
            });
        } else if (!isOpen) {
            resetForm();
        }
    }, [application, isOpen]);


    const validateForm = () => {
        if (!formData.status) {
            setError('Status is required');
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
                notes: formData.notes
            }; 

            await onSave(applicationData);
            setSuccess('Application updated successfully');

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
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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
            submitText="Update Status"
            submitIcon={faSave}
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
                    </div>
                </div>
            )}

            {/* Current status display - FIXED: Added optional chaining */}
            <div className='mb-6 p-4 bg-orange-50 rounded-xl border border-orange-200'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <FontAwesomeIcon icon={faUserCheck} className='text-orange-500' />
                        <span className='text-sm font-medium text-gray-700'>Current Status:</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium 
                        ${getStatusColor(application?.status)}`}>
                        {application?.status?.toUpperCase() || 'N/A'}
                    </span>
                </div>
            </div>

            {/* Status selection */}
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                    <FontAwesomeIcon icon={faUserCheck} className='mr-2 text-gray-400' />
                    Update Status
                </label>
                <select 
                    name="status" 
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 transition-all bg-gray-50/50"
                    disabled={loading}
                    required
                >
                    <option value="pending">📋 Pending</option>
                    <option value="reviewed">👀 Reviewed</option>
                    <option value="interviewed">🎤 Interviewed</option>
                    <option value="hired">✅ Hired</option>
                    <option value="rejected">❌ Rejected</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">
                    Select the current status of this application
                </p>
            </div>

            {/* Notes */}
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                    <FontAwesomeIcon icon={faComment} className='mr-2 text-gray-400' />
                    Admin Notes
                </label>
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Add notes about this applicant (e.g., interview feedback, qualifications, etc.)..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 transition-all bg-gray-50/50 resize-none"
                    disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-2">
                    Add any additional notes or comments about this applicant
                </p>
            </div>

            {/* Status Change preview */}
            {formData.status !== application?.status && application && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-700">
                        <FontAwesomeIcon icon={faSave} className="mr-1" />
                        Status will change from <strong>{application?.status?.toUpperCase()}</strong> to <strong>{formData.status.toUpperCase()}</strong>
                    </p>
                </div>
            )}
        </FormModal>
    );
}

export default EditAppModal;