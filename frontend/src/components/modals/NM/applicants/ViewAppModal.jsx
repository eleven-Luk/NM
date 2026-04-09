import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUser, 
    faTimes,
    faEnvelope,
    faPhone,
    faBriefcase,
    faMapMarkerAlt,
    faCalendarAlt,
    faFileAlt,
    faComment,
    faStickyNote,
    faDollarSign,
    faClock,
    faEye,
    faCheckCircle,
    faTimesCircle,
    faUserGraduate,
    faBuilding,
    faDownload
} from '@fortawesome/free-solid-svg-icons';
import ViewModal from '../../common/ViewModal';
import LoadingSpinner from '../../../common/LoadingSpinner';
import api from '../services/api.js';

const ViewAppModal = ({ isOpen, onClose, application }) => {
    const [loading, setLoading] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [error, setError] = useState('');
    const [applicationDetails, setApplicationDetails] = useState(null);

    useEffect(() => {
        if (isOpen && application) {
            fetchApplicationDetails();
        }
    }, [isOpen, application]);

    const fetchApplicationDetails = async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please login first');
                setLoading(false);
                return;
            }

            const response = await api.get(`/applications/view/${application._id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (result.success) {
                setApplicationDetails(result.data);
            } else {
                setError(result.message || 'Failed to fetch application details');
            }
        } catch (error) {
            console.error('Error fetching application details:', error);
            setError('Failed to fetch application details');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadResume = async () => {
        if (!currentData?.resume) {
            setError('No resume file available');
            return;
        }

        setDownloadLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please login first');
                setDownloadLoading(false);
                return;
            }

            // Extract filename from the resume path (e.g., /uploads/resume-12345.pdf)
            const fileName = currentData.resume.split('/').pop();
            
            // Fetch the file from the server
            const response = await api.get(`${currentData.resume}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to download file');
            }

            // Get the file blob
            const blob = await response.blob();
            
            // Create a download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName; // Set the filename for download
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
        } catch (error) {
            console.error('Error downloading resume:', error);
            setError('Failed to download resume. Please try again.');
        } finally {
            setDownloadLoading(false);
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

    const formatTime = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
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
            interviewed: {
                color: 'bg-purple-50 text-purple-700 border-purple-200',
                icon: faUser,
                label: 'Interviewed'
            },
            hired: {
                color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                icon: faCheckCircle,
                label: 'Hired'
            },
            rejected: {
                color: 'bg-rose-50 text-rose-700 border-rose-200',
                icon: faTimesCircle,
                label: 'Rejected'
            }
        };
        return configs[status?.toLowerCase()] || configs.pending;
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

    const currentData = applicationDetails || application;
    const hasBeenUpdated = currentData?.createdAt !== currentData?.updatedAt;
    const statusConfig = getStatusConfig(currentData?.status);
    const jobType = formatJobType(currentData?.jobId?.type);

    // Extract filename from resume path
    const getFileName = (resumePath) => {
        if (!resumePath) return '';
        return resumePath.split('/').pop();
    };

    if (loading) {
        return (
            <ViewModal isOpen={isOpen} onClose={onClose} title="Applicant Details" icon={faUser}>
                <div className="flex items-center justify-center py-12">
                    <LoadingSpinner message="Loading application details..." />
                </div>
            </ViewModal>
        );
    }

    if (error) {
        return (
            <ViewModal isOpen={isOpen} onClose={onClose} title="Applicant Details" icon={faUser}>
                <div className="text-center py-12">
                    <div className="mb-4">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FontAwesomeIcon icon={faTimes} className="text-red-500 text-2xl" />
                        </div>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={fetchApplicationDetails}
                            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </ViewModal>
        );
    }

    if (!currentData) return null;

    return (
        <ViewModal isOpen={isOpen} onClose={onClose} title="Applicant Details" icon={faUser} maxWidth="max-w-4xl">
            <div className="space-y-6">
                {/* Header Card - Applicant Info */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200 overflow-hidden">
                    <div className="p-5">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                                <span className="text-2xl font-bold text-white">
                                    {currentData.firstName?.[0]}{currentData.lastName?.[0]}
                                </span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                    {currentData.firstName} {currentData.middleName || ''} {currentData.lastName}
                                </h3>
                                <div className="flex items-center gap-2 mb-3 flex-wrap">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${statusConfig.color}`}>
                                        <FontAwesomeIcon icon={statusConfig.icon} className="text-xs" />
                                        {statusConfig.label}
                                    </span>
                                    {currentData.createdAt && (
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="text-xs" />
                                            Applied: {formatDate(currentData.createdAt)}
                                        </span>
                                    )}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                                    <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                                        <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 text-sm" />
                                        <span className="text-sm text-gray-700 truncate">{currentData.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                                        <FontAwesomeIcon icon={faPhone} className="text-gray-500 text-sm" />
                                        <span className="text-sm text-gray-700">{currentData.phone}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Job Information Card */}
                {currentData.jobId && (
                    <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-5">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <FontAwesomeIcon icon={faBriefcase} className="text-orange-500" />
                                Job Information
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Position</p>
                                    <p className="font-semibold text-gray-900 break-words">{currentData.jobId.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Job Type</p>
                                    <p className="font-semibold text-gray-900 flex items-center gap-1">
                                        <FontAwesomeIcon icon={faClock} className="text-orange-400 text-xs" />
                                        {jobType || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Location</p>
                                    <p className="font-semibold text-gray-900 flex items-center gap-1">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-orange-400 text-xs" />
                                        {currentData.jobId.location || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Salary</p>
                                    <p className="font-semibold text-gray-900 flex items-center gap-1">
                                        <FontAwesomeIcon icon={faDollarSign} className="text-orange-400 text-xs" />
                                        {currentData.jobId.salary || 'Negotiable'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Cover Message Card */}
                {currentData.message && (
                    <div className="bg-blue-50 rounded-xl border border-blue-200 overflow-hidden">
                        <div className="p-5">
                            <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                <FontAwesomeIcon icon={faComment} className="text-blue-500" />
                                Cover Message
                            </h3>
                            <p className="text-sm text-blue-700 whitespace-pre-wrap break-words">
                                {currentData.message}
                            </p>
                        </div>
                    </div>
                )}

                {/* Admin Notes Card */}
                {currentData.notes && (
                    <div className="bg-purple-50 rounded-xl border border-purple-200 overflow-hidden">
                        <div className="p-5">
                            <h3 className="text-sm font-semibold text-purple-800 mb-3 flex items-center gap-2">
                                <FontAwesomeIcon icon={faStickyNote} className="text-purple-500" />
                                Admin Notes
                            </h3>
                            <p className="text-sm text-purple-700 whitespace-pre-wrap break-words">
                                {currentData.notes}
                            </p>
                        </div>
                    </div>
                )}

                {/* Resume Card with Download Button */}
                {currentData.resume && (
                    <div className="bg-emerald-50 rounded-xl border border-emerald-200 overflow-hidden">
                        <div className="p-5">
                            <h3 className="text-sm font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                                <FontAwesomeIcon icon={faFileAlt} className="text-emerald-500" />
                                Resume/CV
                            </h3>
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-emerald-700">
                                        📄 {getFileName(currentData.resume)}
                                    </span>
                                </div>
                                <button
                                    onClick={handleDownloadResume}
                                    disabled={downloadLoading}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-emerald-600 hover:bg-emerald-100 transition-colors border border-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {downloadLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                                            <span>Downloading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faDownload} />
                                            <span>Download Resume</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-emerald-600 mt-2">
                                Click the download button to save the resume file to your computer
                            </p>
                        </div>
                    </div>
                )}

                {/* Date Information Card */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-5">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <FontAwesomeIcon icon={faCalendarAlt} className="text-orange-500" />
                            Date Information
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Created Date */}
                            <div className="p-3 bg-white rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <FontAwesomeIcon icon={faClock} className="text-orange-500 text-xs" />
                                    <p className="text-xs font-medium text-gray-500">Submitted</p>
                                </div>
                                <p className="font-medium text-gray-900">{formatDate(currentData.createdAt)}</p>
                                <p className="text-sm text-gray-500">{formatTime(currentData.createdAt)}</p>
                            </div>

                            {/* Last Updated Date - Only show if updated */}
                            {hasBeenUpdated && (
                                <div className="p-3 bg-white rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FontAwesomeIcon icon={faClock} className="text-orange-500 text-xs" />
                                        <p className="text-xs font-medium text-gray-500">Last Updated</p>
                                    </div>
                                    <p className="font-medium text-gray-900">{formatDate(currentData.updatedAt)}</p>
                                    <p className="text-sm text-gray-500">{formatTime(currentData.updatedAt)}</p>
                                </div>
                            )}
                        </div>
                        
                        {!hasBeenUpdated && (
                            <div className="mt-4 p-3 bg-white rounded-lg">
                                <p className="text-sm text-gray-500 text-center">No modifications have been made to this application</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ViewModal>
    );
};

export default ViewAppModal;