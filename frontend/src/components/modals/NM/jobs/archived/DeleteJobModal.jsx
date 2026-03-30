import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faExclamationTriangle,
    faTrashAlt,
    faTimes,
    faBan,
    faBriefcase,
    faMapMarkerAlt,
    faMoneyBillWave,
    faClock,
    faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';

function DeleteJobModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    job,
    title = "Delete Job Permanently",
    subtitle = "Are you sure you want to permanently delete this job?",
    loading = false
}) {
    const [confirmText, setConfirmText] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
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
            setError(err.message || 'Failed to delete job');
        }
    };

    const handleClose = () => {
        setConfirmText('');
        setError('');
        onClose();
    };

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
                                    Permanently deleting this job will remove all associated data and cannot be recovered.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Job Details */}
                    {job && job._id && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <FontAwesomeIcon icon={faBriefcase} className="text-gray-500" />
                                Job Details
                            </h3>
                            
                            <div className="space-y-3">
                                {/* Job Name */}
                                <div className="flex items-start gap-2">
                                    <FontAwesomeIcon icon={faBriefcase} className="text-gray-400 text-sm mt-0.5" />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{job.name}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {formatJobType(job.type)}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Location */}
                                <div className="flex items-center gap-2 text-xs text-gray-600 pt-2 border-t border-gray-200">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400" />
                                    <span>{job.location || 'Remote'}</span>
                                </div>

                                {/* Salary */}
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <FontAwesomeIcon icon={faMoneyBillWave} className="text-gray-400" />
                                    <span>{job.salary || 'Negotiable'}</span>
                                </div>

                                {/* Created Date */}
                                {job.createdAt && (
                                    <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-200">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                                        <span>Created: {formatDate(job.createdAt)}</span>
                                    </div>
                                )}

                                {/* Archived Date */}
                                {job.archivedAt && (
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                                        <span>Archived: {formatDate(job.archivedAt)}</span>
                                    </div>
                                )}

                                {/* ID for debugging */}
                                <div className="pt-2 border-t border-gray-200">
                                    <p className="text-xs text-gray-400">
                                        ID: {job._id}
                                    </p>
                                </div>
                            </div>
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
                                This will permanently delete this job and all associated applications.
                                This action cannot be undone.
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

export default DeleteJobModal;