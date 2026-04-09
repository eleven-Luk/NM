import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEnvelope,
    faPaperPlane,
    faUser,
    faMessage,
    faBriefcase,
    faCamera,
    faPhone,
    faCheckCircle,
    faExclamationCircle,
    faBuilding,
    faBox,
    faUserTie,
    faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import BaseModal from '../modals/common/BaseModal.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import api from '../services/api.js';

function UnifiedContactModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        businessType: 'nm',
        inquiryType: 'general',
        name: '',
        phone: '',
        email: '',
        message: '',
        companyName: '',
        position: '',
        packageType: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                businessType: 'nm',
                inquiryType: 'general',
                name: '',
                phone: '',
                email: '',
                message: '',
                companyName: '',
                position: '',
                packageType: ''
            });
            setError('');
            setSuccess('');
            setAuthorized(false);
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Please enter your name');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Please enter your email');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (!formData.phone.trim()) {
            setError('Please enter your phone number');
            return false;
        }
        if (!formData.message.trim()) {
            setError('Please enter your message');
            return false;
        }
        
        if (formData.businessType === 'nm' && formData.inquiryType === 'employer-partnership') {
            if (!formData.companyName.trim()) {
                setError('Please enter your company name');
                return false;
            }
        }
        
        if (!authorized) {
            setError('Please authorize to proceed');
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            const requestData = {
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                message: formData.message,
                businessType: formData.businessType,
                inquiryType: formData.inquiryType,
            };
            
            if (formData.companyName && formData.companyName.trim()) {
                requestData.companyName = formData.companyName;
            }
            
            if (formData.position && formData.position.trim()) {
                requestData.position = formData.position;
            }

            const response = await api.post('/concerns/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to submit');
            }

            if (result.success) {
                setSuccess(result.message || 'Message sent successfully! We\'ll get back to you within 24 hours. Kindly check your email and phone for our response.');
                setTimeout(() => {
                    setSuccess('');
                    onClose();
                }, 3000);
            } else {
                throw new Error(result.message || 'Failed to submit');
            }

        } catch (error) {
            console.error('Error submitting form:', error);
            setError(error.message || 'Failed to submit. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getStyles = (businessType) => {
        return businessType === 'maple' 
            ? {
                buttonBg: 'bg-gray-600 hover:bg-gray-700',
                focusRing: 'focus:ring-gray-400',
                border: 'border-gray-200',
                accent: 'text-gray-600',
                tabActive: 'bg-gray-600 text-white',
                tabInactive: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                name: 'Maple Street Photography',
                checkboxBg: 'bg-gray-50',
                checkboxBorder: 'border-gray-200',
                checkboxColor: 'text-gray-600'
            }
            : {
                buttonBg: 'bg-orange-500 hover:bg-orange-600',
                focusRing: 'focus:ring-orange-400',
                border: 'border-orange-200',
                accent: 'text-orange-600',
                tabActive: 'bg-orange-500 text-white',
                tabInactive: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
                name: 'N&M Staffing Services',
                checkboxBg: 'bg-orange-50',
                checkboxBorder: 'border-orange-200',
                checkboxColor: 'text-orange-600'
            };
    };

    const currentStyle = getStyles(formData.businessType);
    const isEmployerPartnership = formData.businessType === 'nm' && formData.inquiryType === 'employer-partnership';
    const isPackageInfo = formData.businessType === 'maple' && formData.inquiryType === 'package-information';

    const inquiryOptions = formData.businessType === 'maple' 
        ? [
            { value: 'general', label: 'General Inquiry' },
            { value: 'package-information', label: 'Package Information' },
            { value: 'others', label: 'Others' }
          ]
        : [
            { value: 'general', label: 'General Inquiry' },
            { value: 'employer-partnership', label: 'Employer Partnership' },
            { value: 'others', label: 'Others' }
          ];

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            maxWidth='max-w-lg'
            icon={faPaperPlane}
            iconColor='text-orange-500'
            title="Contact Us"
            subtitle={`Connect with ${currentStyle.name}`}
        >
            <div className="p-6">
                {/* Business Selection Tabs */}
                <div className='flex gap-2 mb-6'>
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, businessType: 'maple', inquiryType: 'general', companyName: '', position: '' }))}
                        className={`flex-1 py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-sm font-medium ${
                            formData.businessType === 'maple'
                                ? currentStyle.tabActive
                                : currentStyle.tabInactive
                        }`}
                    >
                        <FontAwesomeIcon icon={faCamera} />
                        Maple Street
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, businessType: 'nm', inquiryType: 'general', companyName: '', position: '' }))}
                        className={`flex-1 py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-sm font-medium ${
                            formData.businessType === 'nm'
                                ? currentStyle.tabActive
                                : currentStyle.tabInactive
                        }`}
                    >
                        <FontAwesomeIcon icon={faBriefcase} />
                        N&M Staffing
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                        <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-green-600 text-sm">{success}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Inquiry Type */}
                    <div>
                        <label className={`block text-xs ${currentStyle.accent} mb-1 font-medium`}>Inquiry Type</label>
                        <select
                            name='inquiryType'
                            value={formData.inquiryType}
                            onChange={handleChange}
                            className={`w-full p-2.5 border ${currentStyle.border} rounded-lg text-sm focus:outline-none focus:ring-1 ${currentStyle.focusRing} bg-white`}
                        >
                            {inquiryOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Name */}
                    <div>
                        <label className={`block text-xs ${currentStyle.accent} mb-1 font-medium`}>Your Name *</label>
                        <div className='relative'>
                            <FontAwesomeIcon 
                                icon={faUser} 
                                className={`absolute left-3 top-1/2 -translate-y-1/2 ${currentStyle.accent} text-sm`} 
                            />
                            <input
                                type='text'
                                name='name'
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className={`w-full pl-10 p-2.5 border ${currentStyle.border} rounded-lg text-sm focus:outline-none focus:ring-1 ${currentStyle.focusRing} bg-white`}
                                placeholder="Your full name"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className={`block text-xs ${currentStyle.accent} mb-1 font-medium`}>Phone Number *</label>
                        <div className='relative'>
                            <FontAwesomeIcon 
                                icon={faPhone} 
                                className={`absolute left-3 top-1/2 -translate-y-1/2 ${currentStyle.accent} text-sm`} 
                            />
                            <input
                                type='tel'
                                name='phone'
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className={`w-full pl-10 p-2.5 border ${currentStyle.border} rounded-lg text-sm focus:outline-none focus:ring-1 ${currentStyle.focusRing} bg-white`}
                                placeholder="+63 912 345 6789"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className={`block text-xs ${currentStyle.accent} mb-1 font-medium`}>Email Address *</label>
                        <div className='relative'>
                            <FontAwesomeIcon 
                                icon={faEnvelope} 
                                className={`absolute left-3 top-1/2 -translate-y-1/2 ${currentStyle.accent} text-sm`} 
                            />
                            <input
                                type='email'
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={`w-full pl-10 p-2.5 border ${currentStyle.border} rounded-lg text-sm focus:outline-none focus:ring-1 ${currentStyle.focusRing} bg-white`}
                                placeholder='you@example.com'
                            />
                        </div>
                    </div>

                    {/* Employer Partnership Fields */}
                    {isEmployerPartnership && (
                        <>
                            <div>
                                <label className={`block text-xs ${currentStyle.accent} mb-1 font-medium`}>Company Name *</label>
                                <div className='relative'>
                                    <FontAwesomeIcon 
                                        icon={faBuilding} 
                                        className={`absolute left-3 top-1/2 -translate-y-1/2 ${currentStyle.accent} text-sm`} 
                                    />
                                    <input
                                        type='text'
                                        name='companyName'
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        required
                                        className={`w-full pl-10 p-2.5 border ${currentStyle.border} rounded-lg text-sm focus:outline-none focus:ring-1 ${currentStyle.focusRing} bg-white`}
                                        placeholder="Your company name"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className={`block text-xs ${currentStyle.accent} mb-1 font-medium`}>Your Position/Title</label>
                                <div className='relative'>
                                    <FontAwesomeIcon 
                                        icon={faUserTie} 
                                        className={`absolute left-3 top-1/2 -translate-y-1/2 ${currentStyle.accent} text-sm`} 
                                    />
                                    <input
                                        type='text'
                                        name='position'
                                        value={formData.position}
                                        onChange={handleChange}
                                        className={`w-full pl-10 p-2.5 border ${currentStyle.border} rounded-lg text-sm focus:outline-none focus:ring-1 ${currentStyle.focusRing} bg-white`}
                                        placeholder="e.g., HR Manager, Recruiter, CEO"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Package Information Fields */}
                    {isPackageInfo && (
                        <div>
                            <label className={`block text-xs ${currentStyle.accent} mb-1 font-medium`}>Package Type</label>
                            <div className='relative'>
                                <FontAwesomeIcon 
                                    icon={faBox} 
                                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${currentStyle.accent} text-sm`} 
                                />
                                <select
                                    name='packageType'
                                    value={formData.packageType}
                                    onChange={handleChange}
                                    className={`w-full pl-10 p-2.5 border ${currentStyle.border} rounded-lg text-sm focus:outline-none focus:ring-1 ${currentStyle.focusRing} bg-white`}
                                >
                                    <option value=''>Select a package</option>
                                    <option value='newborn'>Newborn Session</option>
                                    <option value='maternity'>Maternity Session</option>
                                    <option value='family'>Family Session</option>
                                    <option value='milestone'>Milestone Session</option>
                                    <option value='portrait'>Portrait Session</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Message */}
                    <div>
                        <label className={`block text-xs ${currentStyle.accent} mb-1 font-medium`}>Message *</label>
                        <div className='relative'>
                            <FontAwesomeIcon 
                                icon={faMessage} 
                                className={`absolute left-3 top-3 ${currentStyle.accent} text-sm`} 
                            />
                            <textarea
                                name='message'
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={isEmployerPartnership ? 3 : 4}
                                className={`w-full pl-10 p-2.5 border ${currentStyle.border} rounded-lg text-sm focus:outline-none focus:ring-1 ${currentStyle.focusRing} bg-white resize-none`}
                                placeholder={
                                    formData.businessType === 'maple' 
                                        ? 'Tell us about your photography needs...' 
                                        : formData.inquiryType === 'employer-partnership'
                                            ? 'Tell us about your hiring needs and the positions you\'re looking to fill...'
                                            : 'How can we help you today?'
                                }
                            />
                        </div>
                    </div>

                    {/* Authorization Agreement */}
                    <div className={`p-3 ${currentStyle.checkboxBg} rounded-lg border ${currentStyle.checkboxBorder}`}>
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={authorized}
                                onChange={(e) => setAuthorized(e.target.checked)}
                                className={`mt-0.5 w-4 h-4 ${currentStyle.checkboxColor} rounded border-gray-300 focus:ring-${currentStyle.accent === 'text-gray-600' ? 'gray' : 'orange'}-500`}
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faShieldAlt} className={`${currentStyle.accent} text-sm`} />
                                    <span className="font-medium text-gray-900 text-sm">Authorization Agreement</span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                    I authorize {currentStyle.name} to contact me regarding my inquiry. 
                                    I confirm that the information provided is accurate and complete to the best of my knowledge.
                                </p>
                            </div>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type='submit'
                        disabled={loading}
                        className={`w-full ${currentStyle.buttonBg} text-white py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {loading ? (
                            <LoadingSpinner message="Sending..." />
                        ) : (
                            <>
                                Send Message
                                <FontAwesomeIcon icon={faPaperPlane} className='text-sm' />
                            </>
                        )}
                    </button>

                    {/* Footer note */}
                    <div className='text-center pt-2'>
                        <p className={`text-xs ${currentStyle.accent} opacity-60`}>
                            We typically respond within 24 hours via the phone number or email address you provided.
                        </p>
                    </div>
                </form>
            </div>
        </BaseModal>
    );
}

export default UnifiedContactModal;