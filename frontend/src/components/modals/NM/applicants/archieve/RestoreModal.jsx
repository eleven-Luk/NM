import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTimes, 
    faTrashRestore, 
    faExclamationTriangle,
    faUser,
    faBriefcase
} from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../../../../common/LoadingSpinner';

const RestoreModal = ({ isOpen, onClose, onConfirm, application, isRestoring }) => {
    if (!isOpen || !application) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
                            <h2 className="text-xl font-semibold text-gray-800">Restore Application</h2>
                            <p className="text-sm text-gray-500">Move back to active applications</p>
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
                                <h3 className="font-medium text-green-800 mb-1">Restore this application?</h3>
                                <p className="text-sm text-green-700">
                                    This application will be moved back to active applications and will appear in the main applicants list.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Applicant Information */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Applicant Details</h3>
                        <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <FontAwesomeIcon icon={faUser} className="text-green-500" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {application.firstName} {application.lastName}
                                        </p>
                                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 bg-red-100 text-red-800">
                                            ARCHIVED
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <FontAwesomeIcon icon={faBriefcase} className="text-gray-400 w-4" />
                                        <span className="text-gray-600">Position:</span>
                                        <span className="font-medium text-gray-800">
                                            {application.jobId?.name || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-gray-600">Archived on:</span>
                                        <span className="text-gray-700">
                                            {formatDate(application.deletedAt)}
                                        </span>
                                    </div>
                                </div>
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
                                Restore Application
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RestoreModal;