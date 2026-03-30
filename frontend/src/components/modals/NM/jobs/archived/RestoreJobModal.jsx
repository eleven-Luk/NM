import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTimes, 
    faTrashRestore, 
    faExclamationTriangle,
    faBriefcase,
    faMapMarkerAlt,
    faMoneyBillWave,
    faClock,
    faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../../../../common/LoadingSpinner.jsx';

const RestoreJobModal = ({ isOpen, onClose, onConfirm, job, isRestoring }) => {
    if (!isOpen || !job) return null;

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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="relative p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faTrashRestore} className="text-green-600 text-xl" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Restore Job</h2>
                            <p className="text-sm text-gray-500">Move back to active job listings</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isRestoring}
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-xl" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Warning Message */}
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                        <div className="flex items-start gap-3">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="text-green-600 text-lg mt-0.5" />
                            <div>
                                <h3 className="font-medium text-green-800 mb-1">Restore this job?</h3>
                                <p className="text-sm text-green-700">
                                    This job will be moved back to active listings and will appear in the main jobs page.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Job Information */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Job Details</h3>
                        <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <FontAwesomeIcon icon={faBriefcase} className="text-green-500" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{job.name}</p>
                                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 bg-gray-100 text-gray-600">
                                            ARCHIVED
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 w-4" />
                                    <span className="text-gray-600">Location:</span>
                                    <span className="font-medium text-gray-800">{job.location || 'Remote'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <FontAwesomeIcon icon={faMoneyBillWave} className="text-gray-400 w-4" />
                                    <span className="text-gray-600">Salary:</span>
                                    <span className="font-medium text-gray-800">{job.salary || 'Negotiable'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <FontAwesomeIcon icon={faClock} className="text-gray-400 w-4" />
                                    <span className="text-gray-600">Job Type:</span>
                                    <span className="font-medium text-gray-800">{formatJobType(job.type)}</span>
                                </div>
                                {job.archivedAt && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 w-4" />
                                        <span className="text-gray-600">Archived on:</span>
                                        <span className="text-gray-700">{formatDate(job.archivedAt)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isRestoring}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isRestoring}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isRestoring ? (
                            <LoadingSpinner message="Restoring..." />
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faTrashRestore} />
                                Restore Job
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RestoreJobModal;