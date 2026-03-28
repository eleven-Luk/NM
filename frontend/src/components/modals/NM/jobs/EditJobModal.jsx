import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBriefcase,
    faDollarSign,
    faMapMarkerAlt,
    faFileAlt,
    faSlidersH,
    faHandshake,
    faSave,
    faCheckCircle,
    faBan,
    faHourglassHalf
} from '@fortawesome/free-solid-svg-icons';
import FormModal from '../../common/FormModal';

function EditJobModal({ isOpen, onClose, onSave, job }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'Full-Time',
        salary: '',
        salaryType: 'range',
        salaryMin: '',
        salaryMax: '',
        isNegotiable: false,
        locationType: '',
        locationAddress: '',
        status: 'active',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Reset form when modal closes or job changes
    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            type: 'Full-Time',
            salary: '',
            salaryType: 'range',
            salaryMin: '',
            salaryMax: '',
            isNegotiable: false,
            locationType: '',
            locationAddress: '',
            status: 'active',
        });
        setError('');
        setSuccess('');
        setLoading(false);
    };

    // Parse existing job data when modal opens
    useEffect(() => {
        if (job && isOpen) {
            // Parse salary to determine if it's range, exact, or negotiable
            let isNegotiable = false;
            let salaryType = 'range';
            let salaryMin = '';
            let salaryMax = '';
            let salary = '';

            if (job.salary?.toLowerCase() === 'negotiable') {
                isNegotiable = true;
            } else if (job.salary?.includes('-')) {
                // Range format: "50,000 - 80,000"
                const [min, max] = job.salary.split('-').map(s => s.trim());
                salaryMin = min.replace(/[^\d,]/g, '');
                salaryMax = max.replace(/[^\d,]/g, '');
                salaryType = 'range';
            } else if (job.salary) {
                // Exact amount
                salary = job.salary.replace(/[^\d,]/g, '');
                salaryType = 'exact';
            }

            // Parse location to determine location type
            let locationType = 'remote';
            let locationAddress = '';
            
            if (job.location?.toLowerCase() === 'hybrid') {
                locationType = 'hybrid';
            } else if (job.location?.toLowerCase() === 'remote') {
                locationType = 'remote';
            } else if (job.location) {
                locationType = 'onsite';
                locationAddress = job.location;
            }

            setFormData({
                name: job.name || '',
                description: job.description || '',
                type: job.type || 'Full-Time',
                salary: salary,
                salaryType: salaryType,
                salaryMin: salaryMin,
                salaryMax: salaryMax,
                isNegotiable: isNegotiable,
                locationType: locationType,
                locationAddress: locationAddress,
                status: job.status || 'active',
            });
        } else if (!isOpen) {
            // Reset form when modal closes
            resetForm();
        }
    }, [job, isOpen]);

    const validateForm = () => {
        if (!formData.name.trim() || !formData.description.trim() || !formData.type.trim()) {
            setError('All fields are required');
            return false;
        }

        if (!formData.isNegotiable) {
            if (formData.salaryType === 'range') {
                if (!formData.salaryMin || !formData.salaryMax) {
                    setError('Please enter both minimum and maximum salary');
                    return false;
                }
                const minNum = parseFloat(formData.salaryMin.replace(/,/g, ''));
                const maxNum = parseFloat(formData.salaryMax.replace(/,/g, ''));
                
                if (isNaN(minNum) || isNaN(maxNum) || minNum <= 0 || maxNum <= 0) {
                    setError('Salary must be positive numbers');
                    return false;
                }
                if (minNum > maxNum) {
                    setError('Minimum salary cannot be greater than maximum salary');
                    return false;
                }
            } else {
                if (!formData.salary) {
                    setError('Please enter salary');
                    return false;
                }
                const salaryNum = parseFloat(formData.salary.replace(/,/g, ''));
                if (isNaN(salaryNum) || salaryNum <= 0) {
                    setError('Salary must be a positive number');
                    return false;
                }
            }
        }

        if ((formData.locationType === 'onsite' || formData.locationType === 'hybrid') && !formData.locationAddress?.trim()) {
            setError('Please enter office address for this position');
            return false;
        }

        return true;
    };

    const formatSalary = (value) => {
        if (!value) return value;
        const number = value.replace(/,/g, '');
        if (isNaN(number)) return value;
        return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const handleSalaryChange = (e, field) => {
        const { value } = e.target;
        const cleaned = value.replace(/[^\d,]/g, '');
        setFormData(prev => ({ ...prev, [field]: cleaned }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            let salaryString = '';
            if (formData.isNegotiable) {
                salaryString = 'Negotiable';
            } else if (formData.salaryType === 'range') {
                const minFormatted = formatSalary(formData.salaryMin);
                const maxFormatted = formatSalary(formData.salaryMax);
                salaryString = `${minFormatted} - ${maxFormatted}`;
            } else {
                salaryString = formatSalary(formData.salary);
            }
            
            const location = formData.locationType === 'onsite' 
                ? formData.locationAddress
                : formData.locationType === 'hybrid' 
                    ? `Hybrid (${formData.locationAddress})`
                    : 'Remote';

            const jobData = {
                id: job?._id,  // IMPORTANT: Include the job ID
                name: formData.name,
                description: formData.description,
                type: formData.type,
                salary: salaryString,
                location: location,
                status: formData.status  // Make sure status is included
            };

            console.log('Submitting job update:', jobData); // Debug log

            await onSave(jobData);
            setSuccess('Job updated successfully!');

            // Reset form after successful update
            setTimeout(() => {
                setSuccess('');
                onClose();
                // Reset form after modal closes
                resetForm();
            }, 2000);

        } catch (error) {
            console.error('Error updating job:', error);
            setError(error.message || 'Failed to update job');
            setLoading(false);
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (error) setError('');
    };

    // Status options with icons
    const statusOptions = [
        { value: 'active', label: 'Active', icon: faCheckCircle, color: 'text-green-600' },
        { value: 'inactive', label: 'Inactive', icon: faHourglassHalf, color: 'text-yellow-600' },
        { value: 'closed', label: 'Closed', icon: faBan, color: 'text-red-600' },
    ];

    if (!isOpen) return null;

    return (
        <FormModal
            isOpen={isOpen}
            onClose={handleClose}
            onSubmit={handleSubmit}
            title="Edit Job"
            subtitle={`Editing: ${job?.name || 'Job'}`}
            loading={loading}
            error={error}
            success={success}
            submitText="Update Job"
            submitIcon={faSave}
            maxWidth="max-w-2xl"
            icon={faBriefcase}
            iconColor="text-green-500"
        >
            {/* Job Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faBriefcase} className="mr-2 text-gray-400" />
                    Job Title
                </label>
                <input 
                    type="text" 
                    name="name" 
                    placeholder="e.g. Senior Software Engineer"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all bg-gray-50/50"
                    disabled={loading}
                    required
                />
            </div>

            {/* Job Type and Status */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employment Type
                    </label>
                    <select 
                        name="type" 
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all bg-gray-50/50"
                        disabled={loading}
                        required
                    >
                        <option value="Full-Time">Full-time</option>
                        <option value="Part-Time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Status
                    </label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all bg-gray-50/50"
                        disabled={loading}
                    >
                        {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Salary Type Selection */}
            {!formData.isNegotiable && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FontAwesomeIcon icon={faSlidersH} className="mr-2 text-gray-400" />
                        Salary Type
                    </label>
                    <select
                        name="salaryType"
                        value={formData.salaryType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all bg-gray-50/50"
                    >
                        <option value="range">Range (e.g., 50k - 70k)</option>
                        <option value="exact">Exact Amount</option>
                    </select>
                </div>
            )}

            {/* Negotiable Checkbox */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <input
                    type="checkbox"
                    name="isNegotiable"
                    id="isNegotiable"
                    checked={formData.isNegotiable}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-500 rounded border-gray-300 focus:ring-blue-400"
                />
                <label htmlFor="isNegotiable" className="flex items-center gap-2 text-gray-700 cursor-pointer">
                    <FontAwesomeIcon icon={faHandshake} className="text-blue-500" />
                    <span className="font-medium">Salary is negotiable</span>
                    <span className="text-sm text-gray-500">(No specific amount required)</span>
                </label>
            </div>

            {/* Salary Fields */}
            {!formData.isNegotiable && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FontAwesomeIcon icon={faDollarSign} className="mr-2 text-gray-400" />
                        {formData.salaryType === 'range' ? 'Salary Range' : 'Salary'}
                    </label>
                    
                    {formData.salaryType === 'range' ? (
                        <div className="grid grid-cols-2 gap-3">
                            <input 
                                type="text" 
                                placeholder="Min (e.g., 50,000)"
                                value={formData.salaryMin}
                                onChange={(e) => handleSalaryChange(e, 'salaryMin')}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all bg-gray-50/50"
                                disabled={loading}
                            />
                            <input 
                                type="text" 
                                placeholder="Max (e.g., 80,000)"
                                value={formData.salaryMax}
                                onChange={(e) => handleSalaryChange(e, 'salaryMax')}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all bg-gray-50/50"
                                disabled={loading}
                            />
                        </div>
                    ) : (
                        <input 
                            type="text" 
                            name="salary"
                            placeholder="e.g., 65,000"
                            value={formData.salary}
                            onChange={(e) => handleSalaryChange(e, 'salary')}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all bg-gray-50/50"
                            disabled={loading}
                        />
                    )}
                </div>
            )}

            {/* Location */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-400" />
                    Job Location
                </label>
                <select 
                    name="locationType" 
                    value={formData.locationType || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all bg-gray-50/50 mb-3"
                    disabled={loading}
                    required
                >
                    <option value="" disabled>Select work setup</option>
                    <option value="onsite">On-site</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                </select>

                {(formData.locationType === 'onsite' || formData.locationType === 'hybrid') && (
                    <input
                        type="text"
                        name="locationAddress"
                        placeholder={formData.locationType === 'onsite' ? "Enter complete office address" : "Enter office address for hybrid setup"}
                        value={formData.locationAddress || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all bg-gray-50/50"
                        disabled={loading}
                        required
                    />
                )}
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-gray-400" />
                    Job Description
                </label>
                <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the role, responsibilities, and requirements..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all bg-gray-50/50 resize-none"
                    disabled={loading}
                    required
                    rows={5}
                />
            </div>
        </FormModal>
    );
}

export default EditJobModal;