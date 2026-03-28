import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faExclamationTriangle,
    faTrashAlt,
    faTimes,
    faBan,
    faUser,
    faEnvelope,
    faPhone,
    faFileAlt,
    faBriefcase,
    faCalendarAlt,
    faClock,
    faCheckCircle,
    faTimesCircle,
    faEye
} from '@fortawesome/free-solid-svg-icons';

function DeleteModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    item,
    title = "Delete Application",
    subtitle = "Are you sure you want to delete this application?",
    loading = false
}) {
    const [confirmText, setConfirmText] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const getStatusConfig = (status) => {
        const configs = {
            pending: {
                color: 'bg-yellow-100 text-yellow-800',
                icon: faClock,
                label: 'Pending'
            },
            reviewed: {
                color: 'bg-blue-100 text-blue-800',
                icon: faEye,
                label: 'Reviewed'
            },
            interviewed: {
                color: 'bg-purple-100 text-purple-800',
                icon: faUser,
                label: 'Interviewed'
            },
            hired: {
                color: 'bg-green-100 text-green-800',
                icon: faCheckCircle,
                label: 'Hired'
            },
            rejected: {
                color: 'bg-red-100 text-red-800',
                icon: faTimesCircle,
                label: 'Rejected'
            }
        };
        return configs[status] || configs.pending;
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

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleConfirm = async () => {
        if (confirmText !== 'DELETE') {
            setError('Please type "DELETE" to confirm');
            return;
        }
        
        setError('');
        try {
            await onConfirm();
            setConfirmText('');
        } catch (err) {
            setError(err.message || 'Failed to delete application');
        }
    };

    const handleClose = () => {
        setConfirmText('');
        setError('');
        onClose();
    };

    const application = item;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col transform transition-all animate-slideUp">
                {/* Header - Fixed */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 text-xl" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                            <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={loading}
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-xl" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Warning Message */}
                    <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200">
                        <div className="flex items-start gap-3">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-lg mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-red-800 mb-1">
                                    This action cannot be undone!
                                </p>
                                <p className="text-xs text-red-700">
                                    Deleting this application will permanently remove all associated data, including notes and history.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Application Details */}
                    {application && application._id && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <FontAwesomeIcon icon={faFileAlt} className="text-gray-500" />
                                Application Details
                            </h3>
                            
                            <div className="space-y-3">
                                {/* Applicant Name */}
                                <div className="flex items-start gap-2">
                                    <FontAwesomeIcon icon={faUser} className="text-gray-400 text-sm mt-0.5" />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">
                                            {application.firstName} {application.lastName}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Applicant
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Contact Information */}
                                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                                        <span className="truncate">{application.email || 'No email'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
                                        <span>{application.phone || 'No phone'}</span>
                                    </div>
                                </div>

                                {/* Job Position */}
                                <div className="pt-2 border-t border-gray-200">
                                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                                        <FontAwesomeIcon icon={faBriefcase} className="text-gray-400" />
                                        <span className="font-medium">Position Applied:</span>
                                    </div>
                                    <p className="text-sm text-gray-800">
                                        {application.jobId?.name || 'N/A'}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formatJobType(application.jobId?.type)}
                                    </p>
                                </div>

                                {/* Status */}
                                {application.status && (
                                    <div className="pt-2 border-t border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">Application Status:</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusConfig(application.status).color}`}>
                                                {getStatusConfig(application.status).label.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Experience/Education */}
                                {(application.experience || application.education) && (
                                    <div className="pt-2 border-t border-gray-200">
                                        <p className="text-xs text-gray-500 mb-1">Experience/Education:</p>
                                        <p className="text-sm text-gray-700">
                                            {application.experience || application.education}
                                        </p>
                                    </div>
                                )}

                                {/* Applied Date */}
                                {application.createdAt && (
                                    <div className="pt-2 border-t border-gray-200">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                                            <span>Applied: {formatDate(application.createdAt)}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Last Updated */}
                                {application.updatedAt && (
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <FontAwesomeIcon icon={faClock} className="text-gray-400" />
                                        <span>Last updated: {formatDate(application.updatedAt)}</span>
                                    </div>
                                )}

                                {/* ID for debugging */}
                                <div className="pt-2 border-t border-gray-200">
                                    <p className="text-xs text-gray-400">
                                        ID: {application._id}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Admin Notes Preview */}
                    {application && application.notes && (
                        <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                            <p className="text-xs font-medium text-blue-800 mb-2 flex items-center gap-1">
                                <FontAwesomeIcon icon={faFileAlt} className="text-xs" />
                                Admin Notes:
                            </p>
                            <p className="text-sm text-blue-700">{application.notes}</p>
                        </div>
                    )}

                    {/* Resume/CV Info */}
                    {application && application.resumeUrl && (
                        <div className="mb-6 p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <p className="text-xs text-purple-800 flex items-center gap-2">
                                <FontAwesomeIcon icon={faFileAlt} className="text-xs" />
                                <span>Resume/CV attached to this application</span>
                            </p>
                        </div>
                    )}

                    {/* Confirmation Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type <span className="font-mono font-bold text-red-600">"DELETE"</span> to confirm
                        </label>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => {
                                setConfirmText(e.target.value);
                                if (error) setError('');
                            }}
                            placeholder="Type DELETE here"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 transition-all"
                            disabled={loading}
                            autoFocus
                        />
                        {error && (
                            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="text-xs" />
                                {error}
                            </p>
                        )}
                    </div>

                    {/* Additional Warning */}
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <p className="text-xs text-amber-800 flex items-start gap-2">
                            <FontAwesomeIcon icon={faBan} className="text-amber-600 mt-0.5" />
                            <span>
                                This will permanently remove this application and all associated data.
                                Consider archiving instead if you want to keep the application for future reference.
                            </span>
                        </p>
                    </div>
                </div>

                {/* Footer - Fixed */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl flex-shrink-0">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={loading || confirmText !== 'DELETE'}
                        className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                            confirmText === 'DELETE' && !loading
                                ? 'bg-red-600 hover:bg-red-700 text-white shadow-md'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Deleting...</span>
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faTrashAlt} />
                                <span>Delete Permanently</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;