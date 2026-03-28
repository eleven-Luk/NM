// components/modals/NMContactModal.jsx
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
    faUser
} from '@fortawesome/free-solid-svg-icons';
import BaseModal from '../modals/common/BaseModal.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner';

function NMContactModal({ isOpen, onClose, job }) {
    const [formData, setFormData] = useState({
        firstName: '',
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

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                message: '',
                resume: null
            });
            setFileName('');
            setError('');
            setSuccess('');
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
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.firstName.trim()) {
            setError('First name is required');
            return false;
        }
        if (!formData.lastName.trim()) {
            setError('Last name is required');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (!formData.phone.trim()) {
            setError('Phone number is required');
            return false;
        }
        if (!formData.resume) {
            setError('Resume is required');
            return false;
        }
        
        // Check file size (5MB max)
        if (formData.resume.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            return false;
        }
        
        // Check file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(formData.resume.type)) {
            setError('Only PDF, DOC, and DOCX files are allowed');
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        // Validate job ID
        if (!job || !job._id) {
            setError('Invalid job selection. Please try again.');
            console.error('❌ No job or job ID:', job);
            return;
        }
        
        // Check if job ID is a valid MongoDB ObjectId (24 hex characters)
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(job._id);
        if (!isValidObjectId) {
            setError(`Invalid job ID format: ${job._id}`);
            console.error('❌ Invalid ObjectId format:', job._id);
            return;
        }
        
        console.log('✅ Valid job ID:', job._id);
        
        setLoading(true);
        setError('');
        
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('firstName', formData.firstName);
            formDataToSend.append('lastName', formData.lastName);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('jobId', job._id);
            formDataToSend.append('resume', formData.resume);
            formDataToSend.append('message', formData.message || '');
            
            console.log('📤 Sending application with data:', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                jobId: job._id,
                message: formData.message,
                resume: formData.resume?.name
            });
            
            const response = await fetch('http://localhost:5000/api/applications/create', {
                method: 'POST',
                body: formDataToSend
            });
            
            const result = await response.json();
            console.log('📥 Server response:', result);
            
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

            <form onSubmit={handleSubmit} className="space-y-4 p-6 pt-0">
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-400 focus:border-orange-400"
                            disabled={loading}
                            required
                        />
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-400 focus:border-orange-400"
                            disabled={loading}
                            required
                        />
                    </div>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-400 focus:border-orange-400"
                        disabled={loading}
                        required
                    />
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-400 focus:border-orange-400"
                        disabled={loading}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FontAwesomeIcon icon={faFileAlt} className="mr-1 text-gray-400 text-xs" />
                        Resume/CV *
                    </label>
                    <div className="flex items-center gap-2">
                        <label className="flex-1">
                            <div className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <FontAwesomeIcon icon={faFileAlt} className="text-gray-400 mr-2" />
                                <span className="text-sm text-gray-600">
                                    {fileName || 'Choose file (PDF, DOC, DOCX)'}
                                </span>
                                <input
                                    type="file"
                                    name="resume"
                                    onChange={handleChange}
                                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    className="hidden"
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </label>
                    </div>
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