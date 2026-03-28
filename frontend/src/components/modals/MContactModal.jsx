import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEnvelope,
    faPaperPlane,
    faUser,
    faMessage,
    faXmark,
    faCalendarCheck
} from '@fortawesome/free-solid-svg-icons';

function MContactModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        inquiryType: 'booking' // Default to booking
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Maple Street specific styling
    const styles = {
        bg: 'bg-gray-50',
        headerBg: 'bg-gray-100',
        buttonBg: 'bg-gray-600 hover:bg-gray-700',
        focusRing: 'focus:ring-gray-400',
        border: 'border-gray-200',
        text: 'text-gray-800',
        accent: 'text-gray-600'
    };

    const businessName = 'Maple Street Photography';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitSuccess(true);
            setFormData({
                name: '',
                email: '',
                message: '',
                inquiryType: 'booking'
            });
            
            // Auto close after success
            setTimeout(() => {
                setSubmitSuccess(false);
                onClose();
            }, 2000);
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className={`relative w-full max-w-md ${styles.bg} rounded-xl shadow-2xl transform transition-all`}>
                    
                    {/* Header */}
                    <div className={`flex items-center justify-between p-5 ${styles.headerBg} rounded-t-xl border-b ${styles.border}`}>
                        <div className='flex items-center gap-2'>
                            <FontAwesomeIcon icon={faCalendarCheck} className={styles.accent} />
                            <h3 className={`text-lg font-light ${styles.text}`}>
                                Contact for {formData.inquiryType === 'booking' ? 'Appointment' 
                                : formData.inquiryType === 'package' ? 'Package Information' 
                                : formData.inquiryType === 'general' ? 'General Enquiry'
                                : ''}
                            </h3>
                        </div>
                        <button
                            onClick={onClose}
                            className={`p-1 rounded-full hover:bg-white/50 transition-colors ${styles.accent}`}
                        >
                            <FontAwesomeIcon icon={faXmark} className='text-xl' />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className='p-6'>
                        {/* Inquiry Type */}
                        <div className='mb-4'>
                            <label className={`block text-xs ${styles.accent} mb-1`}>Inquiry Type</label>
                            <select
                                name='inquiryType'
                                value={formData.inquiryType}
                                onChange={handleChange}
                                className={`w-full p-2.5 border ${styles.border} rounded-lg text-sm focus:outline-none focus:ring-1 ${styles.focusRing}`}
                            >
                                <option value='booking'>Book Appointment</option>
                                <option value='package'>Package Information</option>
                                <option value='general'>General Inquiry</option>
                                <option value='other'>Other</option>
                            </select>
                        </div>

                        {/* Name */}
                        <div className='mb-4'>
                            <label className={`block text-xs ${styles.accent} mb-1`}>Your Name</label>
                            <div className='relative'>
                                <FontAwesomeIcon 
                                    icon={faUser} 
                                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${styles.accent} text-sm`} 
                                />
                                <input
                                    type='text'
                                    name='name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className={`w-full pl-10 p-2.5 border ${styles.border} rounded-lg text-sm focus:outline-none focus:ring-1 ${styles.focusRing}`}
                                    placeholder='John Doe'
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className='mb-4'>
                            <label className={`block text-xs ${styles.accent} mb-1`}>Email Address</label>
                            <div className='relative'>
                                <FontAwesomeIcon 
                                    icon={faEnvelope} 
                                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${styles.accent} text-sm`} 
                                />
                                <input
                                    type='email'
                                    name='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className={`w-full pl-10 p-2.5 border ${styles.border} rounded-lg text-sm focus:outline-none focus:ring-1 ${styles.focusRing}`}
                                    placeholder='john@example.com'
                                />
                            </div>
                        </div>

                        {/* Preferred Date (Optional - for Maple) */}
                        {formData.inquiryType === 'booking' && (
                            <div className='mb-4'>
                                <label className={`block text-xs ${styles.accent} mb-1`}>Preferred Date (Optional)</label>
                                <input
                                    type='date'
                                    name='preferredDate'
                                    className={`w-full p-2.5 border ${styles.border} rounded-lg text-sm focus:outline-none focus:ring-1 ${styles.focusRing}`}
                                />
                            </div>
                        )}

                        {/* Message */}
                        <div className='mb-5'>
                            <label className={`block text-xs ${styles.accent} mb-1`}>Message</label>
                            <div className='relative'>
                                <FontAwesomeIcon 
                                    icon={faMessage} 
                                    className={`absolute left-3 top-3 ${styles.accent} text-sm`} 
                                />
                                <textarea
                                    name='message'
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows='4'
                                    className={`w-full pl-10 p-2.5 border ${styles.border} rounded-lg text-sm focus:outline-none focus:ring-1 ${styles.focusRing}`}
                                    placeholder={
                                        formData.inquiryType === 'booking' 
                                            ? 'Tell us about the type of session you\'re interested in (newborn, maternity, family, etc.) and any special requests...' 
                                            : 'Tell us about your photography needs...'
                                    }
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type='submit'
                            disabled={isSubmitting}
                            className={`w-full ${styles.buttonBg} text-white py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50`}
                        >
                            {isSubmitting ? (
                                'Sending...'
                            ) : (
                                <>
                                    {formData.inquiryType === 'booking' ? 'Book Appointment' : 'Send Message'}
                                    <FontAwesomeIcon icon={faPaperPlane} className='text-sm' />
                                </>
                            )}
                        </button>

                        {/* Success Message */}
                        {submitSuccess && (
                            <div className='mt-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg text-center'>
                                {formData.inquiryType === 'booking' 
                                    ? 'Appointment request sent successfully! We\'ll contact you within 24 hours.'
                                    : 'Message sent successfully! We\'ll get back to you soon.'
                                }
                            </div>
                        )}
                    </form>

                    {/* Footer note */}
                    <div className={`px-6 pb-4 text-center`}>
                        <p className={`text-xs ${styles.accent} opacity-60`}>
                            {formData.inquiryType === 'booking' 
                                ? 'We\'ll confirm your appointment within 24 hours'
                                : 'We typically respond within 24 hours'
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MContactModal;