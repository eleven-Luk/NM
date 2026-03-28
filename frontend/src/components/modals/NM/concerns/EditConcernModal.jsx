import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUser,
    faEnvelope,
    faPhone,
    faComment,
    faSave,
    faUserCheck,
    faClock,
    faFlag,
    faTag,
    faCalendarAlt,
    faExclamationTriangle,
    faCheckCircle,
    faTimesCircle,
    faEye,
    faEdit,
    faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import FormModal from '../../common/FormModal';

function EditConcernModal({ isOpen, onClose, onSave, concern }) {
    const [formData, setFormData] = useState({
        status: 'pending',
        notes: '',
        priority: 'medium',
        assignedTo: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [charCount, setCharCount] = useState(0);

    // Reset form function
    const resetForm = () => {
        setFormData({
            status: 'pending',
            notes: '',
            priority: 'medium',
            assignedTo: ''
        });
        setCharCount(0);
        setError('');
        setSuccess('');
        setLoading(false);
    };

    // Load concern data when modal opens
    useEffect(() => {
        if (concern && isOpen) {
            setFormData({
                status: concern.status || 'pending',
                notes: concern.notes || '',
                priority: concern.priority || 'medium',
                assignedTo: concern.assignedTo || ''
            });
            setCharCount(concern.notes?.length || 0);
        } else if (!isOpen) {
            // Reset form when modal closes
            resetForm();
        }
    }, [concern, isOpen]);

    const validateForm = () => {
        if (!formData.status) {
            setError('Please select a status');
            return false;
        }
        if (formData.notes && formData.notes.length > 500) {
            setError('Notes cannot exceed 500 characters');
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
            const concernData = {
                status: formData.status,
                notes: formData.notes,
                priority: formData.priority,
                assignedTo: formData.assignedTo,
                updatedAt: new Date().toISOString()
            };

            await onSave(concernData);
            setSuccess('Concern updated successfully');
            
            // Reset form after successful update
            setTimeout(() => {
                setSuccess('');
                onClose();
                // Reset form after modal closes
                resetForm();
            }, 2000);

        } catch (error) {
            setError(error.message || 'Failed to update concern');    
            setLoading(false);
        }
    }; 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (name === 'notes') {
            setCharCount(value.length);
        }
        
        if (error) {
            setError('');
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const getStatusConfig = (status) => {
        const configs = {
            pending: {
                color: 'bg-amber-50 text-amber-700 border-amber-200',
                icon: faClock,
                label: 'Pending'
            },
            reviewed: {
                color: 'bg-blue-50 text-blue-700 border-blue-200',
                icon: faEye,
                label: 'Reviewed'
            },
            resolved: {
                color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                icon: faCheckCircle,
                label: 'Resolved'
            },
            rejected: {
                color: 'bg-rose-50 text-rose-700 border-rose-200',
                icon: faTimesCircle,
                label: 'Rejected'
            }
        };
        return configs[status] || configs.pending;
    };

    const getPriorityConfig = (priority) => {
        const configs = {
            high: {
                color: 'text-rose-600 bg-rose-50',
                icon: faExclamationTriangle,
                label: 'High'
            },
            medium: {
                color: 'text-amber-600 bg-amber-50',
                icon: faFlag,
                label: 'Medium'
            },
            low: {
                color: 'text-emerald-600 bg-emerald-50',
                icon: faTag,
                label: 'Low'
            }
        };
        return configs[priority] || configs.medium;
    };

    const statusOptions = [
        { value: 'pending', label: 'Pending', icon: faClock, color: 'text-amber-600' },
        { value: 'reviewed', label: 'Reviewed', icon: faEye, color: 'text-blue-600' },
        { value: 'resolved', label: 'Resolved', icon: faCheckCircle, color: 'text-emerald-600' },
        { value: 'rejected', label: 'Rejected', icon: faTimesCircle, color: 'text-rose-600' }
    ];

    const priorityOptions = [
        { value: 'high', label: 'High Priority', icon: faExclamationTriangle, color: 'text-rose-600' },
        { value: 'medium', label: 'Medium Priority', icon: faFlag, color: 'text-amber-600' },
        { value: 'low', label: 'Low Priority', icon: faTag, color: 'text-emerald-600' }
    ];

    const statusConfig = getStatusConfig(formData.status);
    const priorityConfig = getPriorityConfig(formData.priority);

    return (
        <FormModal 
            isOpen={isOpen}
            onClose={handleClose}
            onSubmit={handleSubmit}
            title="Update Concern"
            subtitle={`Reference: ${concern?.reference || concern?.id?.slice(-6) || 'N/A'}`}
            loading={loading}
            error={error}
            success={success}
            submitText="Update Concern"
            submitIcon={faSave}
            maxWidth='max-w-2xl'
            icon={faEdit}
            iconColor="text-orange-600"
        >
            {/* Concern Details Card - Redesigned */}
            {concern && (
                <div className="mb-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200 overflow-hidden">
                    <div className="p-5">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <FontAwesomeIcon icon={faUser} className="text-2xl text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                    {concern.name}
                                </h3>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2 py-1 bg-orange-200/50 rounded-lg text-xs font-medium text-orange-800">
                                        {concern.type || 'General Concern'}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        Submitted: {new Date(concern.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                                    <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                                        <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 text-sm" />
                                        <span className="text-sm text-gray-700">{concern.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                                        <FontAwesomeIcon icon={faPhone} className="text-gray-500 text-sm" />
                                        <span className="text-sm text-gray-700">{concern.phone}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Current Status Banner - Enhanced */}
            {concern && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${getStatusConfig(concern.status).color}`}>
                                <FontAwesomeIcon 
                                    icon={getStatusConfig(concern.status).icon} 
                                    className="text-lg"
                                />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Current Status</p>
                                <p className="font-semibold text-gray-900">
                                    {getStatusConfig(concern.status).label}
                                </p>
                            </div>
                        </div>
                        
                        {concern.priority && (
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${getPriorityConfig(concern.priority).color}`}>
                                    <FontAwesomeIcon 
                                        icon={getPriorityConfig(concern.priority).icon} 
                                        className="text-lg"
                                    />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Priority</p>
                                    <p className="font-semibold text-gray-900">
                                        {getPriorityConfig(concern.priority).label}
                                    </p>
                                </div>
                            </div>
                        )}
                        
                        {concern.updatedAt && (
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 text-sm" />
                                <span className="text-xs text-gray-500">
                                    Last updated: {new Date(concern.updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Form Fields - Enhanced Layout */}
            <div className="space-y-5">
                {/* Status Selection */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FontAwesomeIcon icon={faUserCheck} className="mr-2 text-orange-500" />
                        Update Status
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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

                {/* Priority Selection - New Feature */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FontAwesomeIcon icon={faFlag} className="mr-2 text-orange-500" />
                        Priority Level
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {priorityOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleChange({ target: { name: 'priority', value: option.value } })}
                                className={`p-2 rounded-lg border transition-all ${
                                    formData.priority === option.value
                                        ? `${option.color} border-current bg-opacity-10 font-medium`
                                        : 'border-gray-200 hover:border-orange-300 bg-white'
                                }`}
                            >
                                <FontAwesomeIcon icon={option.icon} className={`${option.color} mr-1`} />
                                <span className="text-xs">{option.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Admin Notes - Enhanced */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FontAwesomeIcon icon={faComment} className="mr-2 text-orange-500" />
                        Admin Notes
                    </label>
                    <div className="relative">
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="4"
                            maxLength="500"
                            placeholder="Add detailed notes about this concern (e.g., resolution steps, follow-up actions, etc.)..."
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 transition-all bg-white resize-none"
                            disabled={loading}
                        />
                        <div className="absolute bottom-3 right-3">
                            <span className={`text-xs ${charCount > 450 ? 'text-orange-500' : 'text-gray-400'}`}>
                                {charCount}/500
                            </span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <FontAwesomeIcon icon={faComment} className="text-gray-400" />
                        Add any additional notes, comments, or resolution details
                    </p>
                </div>
            </div>

            {/* Status Change Preview - Enhanced */}
            {formData.status !== concern?.status && concern && (
                <div className="mt-5 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="flex items-start gap-2">
                        <FontAwesomeIcon icon={faArrowRight} className="text-blue-500 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-blue-900">Status Change Preview</p>
                            <p className="text-xs text-blue-700 mt-1">
                                Status will change from{' '}
                                <span className="font-semibold">{getStatusConfig(concern.status).label}</span>
                                {' '}→{' '}
                                <span className="font-semibold">{getStatusConfig(formData.status).label}</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </FormModal>
    );
}

export default EditConcernModal;