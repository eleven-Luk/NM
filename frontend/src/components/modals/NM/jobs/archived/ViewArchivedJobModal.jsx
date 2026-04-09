import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBriefcase,
    faMapMarkerAlt,
    faClock,
    faMoneyBillWave,
    faBuilding,
    faCalendarAlt,
    faFileAlt,
    faUser,
    faEnvelope,
    faPhone,
    faTimes,
    faArchive,
    faEye
} from '@fortawesome/free-solid-svg-icons';
import ViewModal from '../../../common/ViewModal.jsx';
import LoadingSpinner from '../../../../common/LoadingSpinner.jsx';
import api from '../../../../../services/api.js';

function ViewArchivedJobModal({ isOpen, onClose, jobId }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [job, setJob] = useState(null);

    useEffect(() => {
        if (isOpen && jobId) {
            fetchJobDetails();
        }
    }, [isOpen, jobId]);

    const fetchJobDetails = async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please login first');
                setLoading(false);
                return;
            }

            const response = await api.get(`/jobs/archived/${jobId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (result.success) {
                setJob(result.data);
            } else {
                setError(result.message || 'Failed to fetch job details');
            }
        } catch (error) {
            console.error('Error fetching job details:', error);
            setError('Failed to fetch job details');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatJobType = (type) => {
        const typeMap = {
            'fulltime': 'Full-Time',
            'parttime': 'Part-Time',
            'contract': 'Contract',
            'internship': 'Internship',
            'Full-Time': 'Full-Time',
            'Part-Time': 'Part-Time',
            'Contract': 'Contract',
            'Internship': 'Internship'
        };
        return typeMap[type?.toLowerCase()] || type || 'N/A';
    };

    const getSetupLabel = (location) => {
        const loc = location?.toLowerCase() || '';
        if (loc.includes('remote')) return 'Remote';
        if (loc.includes('hybrid')) return 'Hybrid';
        return 'Onsite';
    };

    if (loading) {
        return (
            <ViewModal isOpen={isOpen} onClose={onClose} title="Job Details" icon={faBriefcase}>
                <div className="flex items-center justify-center py-12">
                    <LoadingSpinner message="Loading job details..." />
                </div>
            </ViewModal>
        );
    }

    if (error) {
        return (
            <ViewModal isOpen={isOpen} onClose={onClose} title="Job Details" icon={faBriefcase}>
                <div className="text-center py-12">
                    <div className="mb-4">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FontAwesomeIcon icon={faTimes} className="text-red-500 text-2xl" />
                        </div>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={fetchJobDetails}
                            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </ViewModal>
        );
    }

    if (!job) return null;

    return (
        <ViewModal isOpen={isOpen} onClose={onClose} title="Archived Job Details" icon={faArchive} maxWidth="max-w-4xl">
            <div className="space-y-6">
                {/* Header Card */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-5">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                                <FontAwesomeIcon icon={faBriefcase} className="text-2xl text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                    {job.name}
                                </h3>
                                <div className="flex items-center gap-2 mb-3 flex-wrap">
                                    <span className="px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 bg-gray-200 text-gray-700">
                                        <FontAwesomeIcon icon={faArchive} className="text-xs" />
                                        Archived
                                    </span>
                                    {job.createdAt && (
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="text-xs" />
                                            Created: {formatDate(job.createdAt)}
                                        </span>
                                    )}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                                    <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500 text-sm" />
                                        <span className="text-sm text-gray-700">{job.location || 'Remote'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                                        <FontAwesomeIcon icon={faMoneyBillWave} className="text-gray-500 text-sm" />
                                        <span className="text-sm text-gray-700">{job.salary || 'Negotiable'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Job Information Card */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-5">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <FontAwesomeIcon icon={faBriefcase} className="text-gray-500" />
                            Job Information
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Position</p>
                                <p className="font-semibold text-gray-900 break-words">{job.name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Job Type</p>
                                <p className="font-semibold text-gray-900 flex items-center gap-1">
                                    <FontAwesomeIcon icon={faClock} className="text-gray-400 text-xs" />
                                    {formatJobType(job.type)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Location</p>
                                <p className="font-semibold text-gray-900 flex items-center gap-1">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 text-xs" />
                                    {job.location || 'Remote'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Work Setup</p>
                                <p className="font-semibold text-gray-900">
                                    {getSetupLabel(job.location)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Salary</p>
                                <p className="font-semibold text-gray-900 flex items-center gap-1">
                                    <FontAwesomeIcon icon={faMoneyBillWave} className="text-gray-400 text-xs" />
                                    {job.salary || 'Negotiable'}
                                </p>
                            </div>
                            {job.archivedAt && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Archived Date</p>
                                    <p className="font-semibold text-gray-900">
                                        {formatDate(job.archivedAt)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Description */}
                {job.description && (
                    <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-5">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <FontAwesomeIcon icon={faFileAlt} className="text-gray-500" />
                                Job Description
                            </h3>
                            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                {job.description}
                            </p>
                        </div>
                    </div>
                )}

                {/* Date Information */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-5">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500" />
                            Date Information
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {job.createdAt && (
                                <div className="p-3 bg-white rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Created</p>
                                    <p className="font-medium text-gray-900">{formatDate(job.createdAt)}</p>
                                </div>
                            )}
                            {job.updatedAt && job.updatedAt !== job.createdAt && (
                                <div className="p-3 bg-white rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                                    <p className="font-medium text-gray-900">{formatDate(job.updatedAt)}</p>
                                </div>
                            )}
                            {job.archivedAt && (
                                <div className="p-3 bg-white rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Archived</p>
                                    <p className="font-medium text-gray-900">{formatDate(job.archivedAt)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ViewModal>
    );
}

export default ViewArchivedJobModal;