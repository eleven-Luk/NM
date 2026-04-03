// components/modals/Maple/appointments/EditAppointmentModal.jsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUser,
    faEnvelope,
    faPhone,
    faComment,
    faSave,
    faUserCheck,
    faCalendarAlt,
    faClock,
    faMapMarkerAlt,
    faBox,
    faCamera
} from '@fortawesome/free-solid-svg-icons';
import FormModal from '../../common/FormModal';

function EditModal({ isOpen, onClose, onSave, appointment }) {
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
        if (appointment && isOpen) {
            setFormData({
                status: appointment.status || 'pending',
                notes: appointment.notes || ''
            });
        } else if (!isOpen) {
            resetForm();
        }
    }, [appointment, isOpen]);

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
            const appointmentData = { 
                status: formData.status,
                notes: formData.notes
            }; 

            await onSave(appointmentData);
            setSuccess('Appointment updated successfully');

            setTimeout(() => {
                setSuccess('');
                onClose();
            }, 2000);

        } catch (error) {
            setError(error.message || 'Failed to update appointment');
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
            confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
            completed: 'bg-green-100 text-green-800 border-green-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200',
            rescheduled: 'bg-purple-100 text-purple-800 border-purple-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const formatPackageType = (type) => {
        const typeMap = {
            'newborn': 'Newborn Session',
            'maternity': 'Maternity Session',
            'family': 'Family Session',
            'milestone': 'Milestone Session',
            'portrait': 'Portrait Session',
            'custom': 'Custom Package'
        };
        return typeMap[type?.toLowerCase()] || type || 'N/A';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <FormModal 
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
            title="Update Appointment"
            subtitle={`Client: ${appointment?.name || ''}`}
            loading={loading}
            error={error}
            success={success}
            submitText="Update Status"
            submitIcon={faSave}
            maxWidth="max-w-lg"
            icon={faCamera}
            iconColor="text-gray-500"
        >
            {/* Appointment Details */}
            {appointment && (
                <div className='mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200'>
                    <div className='flex items-center gap-3 mb-3'>
                        <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center'>
                            <FontAwesomeIcon icon={faUser} className='text-lg text-gray-500' />
                        </div>
                        <div>
                            <h3 className='font-semibold text-gray-900'>
                                {appointment.name}
                            </h3>
                            <p className='text-sm text-gray-500'>
                                {formatPackageType(appointment.packageType)}
                            </p>
                        </div>
                    </div>

                    <div className='grid grid-cols-2 gap-2 text-sm'>
                        <div className='flex items-center gap-2'>
                            <FontAwesomeIcon icon={faEnvelope} className='text-gray-400 text-xs' />
                            <span className='text-gray-600'>{appointment.email}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <FontAwesomeIcon icon={faPhone} className='text-gray-400 text-xs' />
                            <span className='text-gray-600'>{appointment.phone}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <FontAwesomeIcon icon={faCalendarAlt} className='text-gray-400 text-xs' />
                            <span className='text-gray-600'>{formatDate(appointment.preferredDate)}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <FontAwesomeIcon icon={faClock} className='text-gray-400 text-xs' />
                            <span className='text-gray-600'>{appointment.preferredTime}</span>
                        </div>
                        <div className='flex items-center gap-2 col-span-2'>
                            <FontAwesomeIcon icon={faMapMarkerAlt} className='text-gray-400 text-xs' />
                            <span className='text-gray-600'>{appointment.location}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Current status display */}
            <div className='mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <FontAwesomeIcon icon={faUserCheck} className='text-gray-500' />
                        <span className='text-sm font-medium text-gray-700'>Current Status:</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium 
                        ${getStatusColor(appointment?.status)}`}>
                        {appointment?.status?.toUpperCase() || 'N/A'}
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400/20 focus:border-gray-400 transition-all bg-gray-50/50"
                    disabled={loading}
                    required
                >
                    <option value="pending">📋 Pending</option>
                    <option value="confirmed">✓ Confirmed</option>
                    <option value="completed">✅ Completed</option>
                    <option value="cancelled">❌ Cancelled</option>
                    <option value="rescheduled">🔄 Rescheduled</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">
                    Select the current status of this appointment
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
                    placeholder="Add notes about this appointment (e.g., special instructions, client preferences, etc.)..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400/20 focus:border-gray-400 transition-all bg-gray-50/50 resize-none"
                    disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-2">
                    Add any additional notes or comments about this appointment
                </p>
            </div>

            {/* Status Change preview */}
            {formData.status !== appointment?.status && appointment && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-700">
                        <FontAwesomeIcon icon={faSave} className="mr-1" />
                        Status will change from <strong>{appointment?.status?.toUpperCase()}</strong> to <strong>{formData.status.toUpperCase()}</strong>
                    </p>
                </div>
            )}
        </FormModal>
    );
}

export default EditModal;
