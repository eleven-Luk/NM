import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPaperPlane, 
    faBriefcase, 
    faMapMarkerAlt, 
    faDollarSign,
    faFileAlt,
    faEnvelope,
    faPhone,
    faUser,
    faExclamationTriangle,
    faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import BaseModal from '../modals/common/BaseModal.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner';

function NMContactModal({ isOpen, onClose, job }) {
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
        resume: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [fileName, setFileName] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    // Authorization state
    const [authorized, setAuthorized] = useState(false);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setFormData({
                firstName: '',
                middleName: '',
                lastName: '',
                email: '',
                phone: '',
                message: '',
                resume: null
            });
            setFileName('');
            setError('');
            setSuccess('');
            setValidationErrors({});
            setAuthorized(false);
        }
    }, [isOpen]);

    // Log job data when modal opens
    useEffect(() => {
        if (isOpen && job) {
            console.log('📋 Job data in modal:', {
                id: job._id,
                name: job.name,
                fullJob: job
            });
        }
    }, [isOpen, job]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'resume') {
            const file = files[0];
            setFormData(prev => ({ ...prev, [name]: file }));
            setFileName(file?.name || '');
            if (file) {
                setValidationErrors(prev => ({ ...prev, resume: '' }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
            if (validationErrors[name]) {
                setValidationErrors(prev => ({ ...prev, [name]: '' }));
            }
        }
    };

    const validateForm = () => {
        const errors = {};
        
        if (!formData.firstName?.trim()) {
            errors.firstName = 'First name is required';
        }
        
        if (!formData.lastName?.trim()) {
            errors.lastName = 'Last name is required';
        }
        
        if (!formData.email?.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }
        
        if (!formData.phone?.trim()) {
            errors.phone = 'Phone number is required';
        }
        
        // Resume validation
        if (!formData.resume) {
            errors.resume = 'Resume/CV is required to complete your application';
        } else {
            if (formData.resume.size > 5 * 1024 * 1024) {
                errors.resume = 'File size must be less than 5MB';
            }
            
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(formData.resume.type)) {
                errors.resume = 'Only PDF, DOC, and DOCX files are allowed';
            }
        }

        // Add authorization validation
        if (!authorized) {
            errors.authorized = 'Please authorize to proceed';
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            console.log('Validation failed:', validationErrors);
            return;
        }
        
        if (!job || !job._id) {
            setError('Invalid job selection. Please try again.');
            return;
        }
        
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(job._id);
        if (!isValidObjectId) {
            setError(`Invalid job ID format: ${job._id}`);
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('firstName', formData.firstName);
            formDataToSend.append('middleName', formData.middleName);
            formDataToSend.append('lastName', formData.lastName);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('jobId', job._id);
            formDataToSend.append('resume', formData.resume);
            formDataToSend.append('message', formData.message || '');
            
            const response = await fetch('http://localhost:5000/api/applications/create', {
                method: 'POST',
                body: formDataToSend
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Failed to submit application');
            }
            
            if (result.success) {
                setSuccess('Application submitted successfully!');
                setTimeout(() => {
                    setSuccess('');
                    onClose();
                }, 2000);
            } else {
                throw new Error(result.message || 'Failed to submit application');
            }
        } catch (error) {
            console.error('❌ Error submitting application:', error);
            setError(error.message || 'Failed to submit application. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const hasError = (field) => !!validationErrors[field];
    const getError = (field) => validationErrors[field] || '';

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Apply for Position"
            subtitle={job ? `Applying for: ${job.name}` : 'Submit your application'}
            maxWidth="max-w-lg"
            icon={faPaperPlane}
            iconColor="text-orange-500"
        >
            {job && (
                <div className="mb-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faBriefcase} className="text-orange-500 text-lg" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-orange-800">{job.name}</h4>
                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                <span className="flex items-center gap-1">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-orange-400 text-xs" />
                                    {job.location || 'Remote'}
                                </span>
                                <span className="flex items-center gap-1">
                                    <FontAwesomeIcon icon={faDollarSign} className="text-orange-400 text-xs" />
                                    {job.salary || 'Negotiable'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 p-6 pt-0" noValidate>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <FontAwesomeIcon icon={faUser} className="mr-1 text-gray-400 text-xs" />
                            First Name *
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-orange-400 focus:border-orange-400 ${
                                hasError('firstName') ? 'border-red-400' : 'border-gray-300'
                            }`}
                            disabled={loading}
                        />
                        {hasError('firstName') && (
                            <p className="text-xs text-red-500 mt-1">{getError('firstName')}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <FontAwesomeIcon icon={faUser} className="mr-1 text-gray-400 text-xs" />
                            Middle Name
                        </label>
                        <input
                            type="text"
                            name="middleName"
                            value={formData.middleName}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-orange-400 focus:border-orange-400 ${
                                hasError('middleName') ? 'border-red-400' : 'border-gray-300'
                            }`}
                            disabled={loading}
                        />
                        {hasError('middleName') && (
                            <p className="text-xs text-red-500 mt-1">{getError('middleName')}</p>
                        )}
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                    </label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-orange-400 focus:border-orange-400 ${
                            hasError('lastName') ? 'border-red-400' : 'border-gray-300'
                        }`}
                        disabled={loading}
                    />
                    {hasError('lastName') && (
                        <p className="text-xs text-red-500 mt-1">{getError('lastName')}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FontAwesomeIcon icon={faEnvelope} className="mr-1 text-gray-400 text-xs" />
                        Email Address *
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-orange-400 focus:border-orange-400 ${
                            hasError('email') ? 'border-red-400' : 'border-gray-300'
                        }`}
                        disabled={loading}
                    />
                    {hasError('email') && (
                        <p className="text-xs text-red-500 mt-1">{getError('email')}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FontAwesomeIcon icon={faPhone} className="mr-1 text-gray-400 text-xs" />
                        Phone Number *
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+63 912 345 6789"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-orange-400 focus:border-orange-400 ${
                            hasError('phone') ? 'border-red-400' : 'border-gray-300'
                        }`}
                        disabled={loading}
                    />
                    {hasError('phone') && (
                        <p className="text-xs text-red-500 mt-1">{getError('phone')}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FontAwesomeIcon icon={faFileAlt} className="mr-1 text-gray-400 text-xs" />
                        Resume/CV *
                    </label>
                    <div className="flex items-center gap-2">
                        <label className="flex-1">
                            <div className={`flex items-center justify-center w-full px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                                hasError('resume') ? 'border-red-400 bg-red-50' : 'border-gray-300'
                            }`}>
                                <FontAwesomeIcon icon={faFileAlt} className={`mr-2 ${hasError('resume') ? 'text-red-500' : 'text-gray-400'}`} />
                                <span className={`text-sm ${hasError('resume') ? 'text-red-600' : 'text-gray-600'}`}>
                                    {fileName || 'Choose file (PDF, DOC, DOCX)'}
                                </span>
                                <input
                                    type="file"
                                    name="resume"
                                    onChange={handleChange}
                                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    className="hidden"
                                    disabled={loading}
                                />
                            </div>
                        </label>
                    </div>
                    {hasError('resume') && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-sm mt-0.5" />
                            <p className="text-xs text-red-600">{getError('resume')}</p>
                        </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Tell us why you're a good fit for this position..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-400 focus:border-orange-400 resize-none"
                        disabled={loading}
                    />
                </div>

                {/* Authorization Agreement */}
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={authorized}
                            onChange={(e) => setAuthorized(e.target.checked)}
                            className="mt-0.5 w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faShieldAlt} className="text-orange-500 text-sm" />
                                <span className="font-medium text-gray-900 text-sm">Authorization Agreement</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                                I authorize N&M Staffing Services to process my job application and contact me regarding 
                                potential employment opportunities. I confirm that the information provided is accurate 
                                and complete to the best of my knowledge.
                            </p>
                        </div>
                    </label>
                    {validationErrors.authorized && (
                        <p className="text-xs text-red-500 mt-2">{validationErrors.authorized}</p>
                    )}
                </div>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-600 text-sm">{success}</p>
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <LoadingSpinner message="Submitting..." />
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faPaperPlane} />
                                Submit Application
                            </>
                        )}
                    </button>
                </div>
            </form>
        </BaseModal>
    );
}

export default NMContactModal;