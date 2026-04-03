import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEnvelope,
    faPaperPlane,
    faUser,
    faMessage,
    faXmark,
    faCalendarCheck,
    faPhone,
    faClock,
    faMapMarkerAlt,
    faBox
} from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../../components/common/LoadingSpinner';

function MContactModal({ isOpen, onClose, appointment }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        packageType: 'newborn',
        preferredDate: '',
        preferredTime: '',
        durationHours: '',
        location: '',
        message: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                name: '',
                email: '',
                phone: '',
                packageType: 'newborn',
                preferredDate: '',
                preferredTime: '',
                durationHours: '',
                location: '',
                message: ''
            });
            setError('');
            setSuccess('');
            setValidationErrors({});
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && appointment) {
            setFormData({
                name: appointment.name || '',
                email: appointment.email || '',
                phone: appointment.phone || '',
                packageType: appointment.packageType || 'newborn',
                preferredDate: appointment.preferredDate ? new Date(appointment.preferredDate).toISOString().split('T')[0] : '',
                preferredTime: appointment.preferredTime || '',
                durationHours: appointment.durationHours || '',
                location: appointment.location || '',
                message: appointment.specialRequests || ''
            });
        }
    }, [isOpen, appointment]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name?.trim()) errors.name = 'Please enter your name';
        if (!formData.email?.trim()) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Please enter a valid email address';
        if (!formData.phone?.trim()) errors.phone = 'Please enter your phone number';
        if (!formData.packageType) errors.packageType = 'Please select a package type';
        if (!formData.preferredDate) errors.preferredDate = 'Please select a preferred date';
        if (!formData.preferredTime) errors.preferredTime = 'Please select a preferred time';
        if (!formData.durationHours) errors.durationHours = 'Please enter duration hours';
        else if (isNaN(formData.durationHours) || formData.durationHours <= 0) errors.durationHours = 'Duration must be a positive number';
        if (!formData.location?.trim()) errors.location = 'Please enter a location';

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`http://localhost:5000/api/appointments/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim(),
                    packageType: formData.packageType,
                    preferredDate: formData.preferredDate,
                    preferredTime: formData.preferredTime,
                    durationHours: parseInt(formData.durationHours),
                    location: formData.location.trim(),
                    specialRequests: formData.message.trim() || ''
                }),
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.message || 'Failed to create appointment');

            if (result.success) {
                setSuccess('Appointment submitted successfully! We will contact you within 24 hours.');
                setTimeout(() => {
                    setSuccess('');
                    onClose();
                }, 3000);
            } else {
                throw new Error(result.message || 'Failed to create appointment');
            }

        } catch (error) {
            console.error('Error submitting appointment:', error);
            setError(error.message || 'Failed to submit appointment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const packageOptions = [
        { value: 'newborn', label: 'Newborn Session' },
        { value: 'maternity', label: 'Maternity Session' },
        { value: 'family', label: 'Family Session' },
        { value: 'milestone', label: 'Milestone Session' },
        { value: 'portrait', label: 'Portrait Session' },
        { value: 'custom', label: 'Custom Package' }
    ];

    const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

    const styles = {
        bg: 'bg-white',
        headerBg: 'bg-gray-50',
        buttonBg: 'bg-gray-600 hover:bg-gray-700',
        focusRing: 'focus:ring-gray-400',
        border: 'border-gray-200',
        text: 'text-gray-800',
        accent: 'text-gray-500',
        error: 'text-red-500'
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose}></div>
            
            <div className="flex min-h-full items-center justify-center p-4">
                <div className={`relative w-full max-w-md ${styles.bg} rounded-xl shadow-2xl flex flex-col max-h-[90vh]`}>
                    {/* Header - Fixed */}
                    <div className={`flex items-center justify-between p-5 ${styles.headerBg} rounded-t-xl border-b ${styles.border} flex-shrink-0`}>
                        <div className='flex items-center gap-2'>
                            <FontAwesomeIcon icon={faCalendarCheck} className={styles.accent} />
                            <h3 className={`text-lg font-light ${styles.text}`}>Book a Photography Session</h3>
                        </div>
                        <button onClick={onClose} className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${styles.accent}`}>
                            <FontAwesomeIcon icon={faXmark} className='text-xl' />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                        {/* Name */}
                        <div>
                            <label className={`block text-xs ${styles.accent} mb-1 font-medium`}>Full Name *</label>
                            <div className='relative'>
                                <FontAwesomeIcon icon={faUser} className={`absolute left-3 top-1/2 -translate-y-1/2 ${styles.accent} text-sm`} />
                                <input type='text' name='name' value={formData.name} onChange={handleChange}
                                    className={`w-full pl-10 p-2.5 border ${validationErrors.name ? 'border-red-400' : styles.border} rounded-lg text-sm focus:outline-none focus:ring-1 ${styles.focusRing}`}
                                    placeholder='John Doe' />
                            </div>
                            {validationErrors.name && <p className={`text-xs ${styles.error} mt-1`}>{validationErrors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className={`block text-xs ${styles.accent} mb-1 font-medium`}>Email Address *</label>
                            <div className='relative'>
                                <FontAwesomeIcon icon={faEnvelope} className={`absolute left-3 top-1/2 -translate-y-1/2 ${styles.accent} text-sm`} />
                                <input type='email' name='email' value={formData.email} onChange={handleChange}
                                    className={`w-full pl-10 p-2.5 border ${validationErrors.email ? 'border-red-400' : styles.border} rounded-lg text-sm focus:outline-none focus:ring-1 ${styles.focusRing}`}
                                    placeholder='john@example.com' />
                            </div>
                            {validationErrors.email && <p className={`text-xs ${styles.error} mt-1`}>{validationErrors.email}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className={`block text-xs ${styles.accent} mb-1 font-medium`}>Phone Number *</label>
                            <div className='relative'>
                                <FontAwesomeIcon icon={faPhone} className={`absolute left-3 top-1/2 -translate-y-1/2 ${styles.accent} text-sm`} />
                                <input type='tel' name='phone' value={formData.phone} onChange={handleChange}
                                    className={`w-full pl-10 p-2.5 border ${validationErrors.phone ? 'border-red-400' : styles.border} rounded-lg text-sm focus:outline-none focus:ring-1 ${styles.focusRing}`}
                                    placeholder='+63 912 345 6789' />
                            </div>
                            {validationErrors.phone && <p className={`text-xs ${styles.error} mt-1`}>{validationErrors.phone}</p>}
                        </div>

                        {/* Package Type */}
                        <div>
                            <label className={`block text-xs ${styles.accent} mb-1 font-medium`}>Package Type *</label>
                            <div className='relative'>
                                <FontAwesomeIcon icon={faBox} className={`absolute left-3 top-1/2 -translate-y-1/2 ${styles.accent} text-sm`} />
                                <select name='packageType' value={formData.packageType} onChange={handleChange}
                                    className={`w-full pl-10 p-2.5 border ${validationErrors.packageType ? 'border-red-400' : styles.border} rounded-lg text-sm focus:outline-none focus:ring-1 ${styles.focusRing}`}>
                                    {packageOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            </div>
                            {validationErrors.packageType && <p className={`text-xs ${styles.error} mt-1`}>{validationErrors.packageType}</p>}
                        </div>

                        {/* Preferred Date */}
                        <div>
                            <label className={`block text-xs ${styles.accent} mb-1 font-medium`}>Preferred Date *</label>
                            <div className='relative'>
                                <FontAwesomeIcon icon={faCalendarCheck} className={`absolute left-3 top-1/2 -translate-y-1/2 ${styles.accent} text-sm`} />
                                <input type='date' name='preferredDate' value={formData.preferredDate} onChange={handleChange}
                                    className={`w-full pl-10 p-2.5 border ${validationErrors.preferredDate ? 'border-red-400' : styles.border} rounded-lg text-sm focus:outline-none focus:ring-1 ${styles.focusRing}`}
                                    min={new Date().toISOString().split('T')[0]} />
                            </div>
                            {validationErrors.preferredDate && <p className={`text-xs ${styles.error} mt-1`}>{validationErrors.preferredDate}</p>}
                        </div>

                        {/* Preferred Time */}
                        <div>
                            <label className={`block text-xs ${styles.accent} mb-1 font-medium`}>Preferred Time *</label>
                            <div className='relative'>
                                <FontAwesomeIcon icon={faClock} className={`absolute left-3 top-1/2 -translate-y-1/2 ${styles.accent} text-sm`} />
                                <select name='preferredTime' value={formData.preferredTime} onChange={handleChange}
                                    className={`w-full pl-10 p-2.5 border ${validationErrors.preferredTime ? 'border-red-400' : styles.border} rounded-lg text-sm focus:outline-none focus:ring-1 ${styles.focusRing}`}>
                                    <option value=''>Select a time</option>
                                    {timeSlots.map(time => <option key={time} value={time}>{time}</option>)}
                                </select>
                            </div>
                            {validationErrors.preferredTime && <p className={`text-xs ${styles.error} mt-1`}>{validationErrors.preferredTime}</p>}
                        </div>

                        {/* Duration Hours */}
                        <div>
                            <label className={`block text-xs ${styles.accent} mb-1 font-medium`}>Duration (Hours) *</label>
                            <input type='number' name='durationHours' value={formData.durationHours} onChange={handleChange}
                                className={`w-full p-2.5 border ${validationErrors.durationHours ? 'border-red-400' : styles.border} rounded-lg text-sm focus:outline-none focus:ring-1 ${styles.focusRing}`}
                                placeholder='2' min='1' max='8' />
                            {validationErrors.durationHours && <p className={`text-xs ${styles.error} mt-1`}>{validationErrors.durationHours}</p>}
                        </div>

                        {/* Location */}
                        <div>
                            <label className={`block text-xs ${styles.accent} mb-1 font-medium`}>Location *</label>
                            <div className='relative'>
                                <FontAwesomeIcon icon={faMapMarkerAlt} className={`absolute left-3 top-1/2 -translate-y-1/2 ${styles.accent} text-sm`} />
                                <input type='text' name='location' value={formData.location} onChange={handleChange}
                                    className={`w-full pl-10 p-2.5 border ${validationErrors.location ? 'border-red-400' : styles.border} rounded-lg text-sm focus:outline-none focus:ring-1 ${styles.focusRing}`}
                                    placeholder='Studio or address' />
                            </div>
                            {validationErrors.location && <p className={`text-xs ${styles.error} mt-1`}>{validationErrors.location}</p>}
                        </div>

                        {/* Special Requests */}
                        <div>
                            <label className={`block text-xs ${styles.accent} mb-1 font-medium`}>Special Requests (Optional)</label>
                            <div className='relative'>
                                <FontAwesomeIcon icon={faMessage} className={`absolute left-3 top-3 ${styles.accent} text-sm`} />
                                <textarea name='message' value={formData.message} onChange={handleChange} rows='3'
                                    className={`w-full pl-10 p-2.5 border ${styles.border} rounded-lg text-sm focus:outline-none focus:ring-1 ${styles.focusRing} resize-none`}
                                    placeholder='Tell us about your vision, specific requirements, or any special requests...' />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg"><p className="text-red-600 text-sm">{error}</p></div>}
                        {success && <div className="p-3 bg-green-50 border border-green-200 rounded-lg"><p className="text-green-600 text-sm">{success}</p></div>}

                        {/* Submit Button - INSIDE the form */}
                        <div className="pt-2">
                            <button type='submit' disabled={loading}
                                className={`w-full ${styles.buttonBg} text-white py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}>
                                {loading ? <LoadingSpinner message="Submitting..." /> : <>
                                    Book Appointment <FontAwesomeIcon icon={faPaperPlane} className='text-sm' />
                                </>}
                            </button>
                            <div className='text-center pt-3'>
                                <p className={`text-xs ${styles.accent}`}>We'll confirm your appointment within 24 hours via email or phone.</p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default MContactModal;