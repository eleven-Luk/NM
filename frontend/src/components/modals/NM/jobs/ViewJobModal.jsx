// components/modals/jobs/ViewJobModal.jsx
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBriefcase,
    faMapMarkerAlt,
    faDollarSign,
    faCalendarAlt,
    faTag
} from '@fortawesome/free-solid-svg-icons';
import ViewModal from '../../common/ViewModal.jsx';
import LoadingSpinner from '../../../../components/common/LoadingSpinner.jsx';

function ViewJobModal({ jobId, isOpen, onClose }) {
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

            const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
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

    const getJobTypeBadge = (type) => {
        const types = {
            'Full-Time': 'bg-blue-500',
            'Part-Time': 'bg-purple-500',
            'Contract': 'bg-amber-500',
            'Internship': 'bg-emerald-500'
        };
        return types[type] || 'bg-gray-500';
    };

    if (loading) {
        return (
            <ViewModal isOpen={isOpen} onClose={onClose} title="Job Details">
                <div className="p-12 text-center">
                    <LoadingSpinner message="Loading job details..." />
                </div>
            </ViewModal>
        );
    }

    if (error) {
        return (
            <ViewModal isOpen={isOpen} onClose={onClose} title="Job Details">
                <div className="p-12 text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={fetchJobDetails}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                    >
                        Try Again
                    </button>
                </div>
            </ViewModal>
        );
    }

    return (
        <ViewModal isOpen={isOpen} onClose={onClose}  icon={faBriefcase}>
            {job && (
                <div className="space-y-6">
                    {/* Job Header */}
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.name}</h1>
                        <div className="flex flex-wrap items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getJobTypeBadge(job.type)}`}>
                                {job.type}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                                Posted {formatDate(job.createdAt)}
                            </span>
                            <span className="text-2xl font-bold text-orange-600 ml-auto">
                                {job.salary}
                            </span>
                        </div>
                    </div>

                    {/* Quick Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-orange-500" />
                            <div>
                                <p className="text-xs text-gray-500">Location</p>
                                <p className="font-medium text-gray-700">{job.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <FontAwesomeIcon icon={faTag} className="text-orange-500" />
                            <div>
                                <p className="text-xs text-gray-500">Job ID</p>
                                <p className="font-medium text-gray-700">#{job._id?.slice(-6)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">Job Description</h3>
                        <div className="prose prose-sm max-w-none">
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {job.description || 'No description available for this position.'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </ViewModal>
    );
}

export default ViewJobModal;