import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArchive, 
    faExclamationTriangle, 
    faTimes,
    faBriefcase,
    faMapMarkerAlt,
    faMoneyBillWave,
    faClock,
    faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';

function MoveToArchiveModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    job,
    loading = false 
}) {
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

    const getSetupLabel = (location) => {
        const loc = location?.toLowerCase() || '';
        if (loc.includes('remote')) return 'Remote';
        if (loc.includes('hybrid')) return 'Hybrid';
        return 'Onsite';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col transform transition-all animate-slideUp">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faArchive} className="text-orange-600 text-xl" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Archive Job</h2>
                            <p className="text-sm text-gray-500 mt-0.5">Move this job to archive</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={loading}
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-xl" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Info Message */}
                    <div className="mb-6 p-4 bg-orange-50 rounded-xl border border-orange-200">
                        <div className="flex items-start gap-3">
                            <FontAwesomeIcon icon={faArchive} className="text-orange-500 text-lg mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-orange-800 mb-1">
                                    Archive this job?
                                </p>
                                <p className="text-xs text-orange-700">
                                    This job will be moved to the archive and won't appear in active listings. 
                                    You can restore it later if needed.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Job Details */}
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
                                <span className="text-gray-400">•</span>
                                <span>{getSetupLabel(job.location)}</span>
                            </div>

                            {/* Salary */}
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <FontAwesomeIcon icon={faMoneyBillWave} className="text-gray-400" />
                                <span>{job.salary || 'Negotiable'}</span>
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <FontAwesomeIcon icon={faClock} className="text-gray-400" />
                                <span>Status: </span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    job.status === 'active' ? 'bg-green-100 text-green-700' :
                                    job.status === 'inactive' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
                                }`}>
                                    {job.status?.toUpperCase() || 'ACTIVE'}
                                </span>
                            </div>

                            {/* Created Date */}
                            {job.createdAt && (
                                <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-200">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                                    <span>Created: {formatDate(job.createdAt)}</span>
                                </div>
                            )}

                            {/* ID */}
                            <div className="pt-2 border-t border-gray-200">
                                <p className="text-xs text-gray-400">
                                    ID: {job._id}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Confirmation Message */}
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-600 flex items-start gap-2">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="text-orange-500 text-sm mt-0.5" />
                            <span>
                                This job will be archived and hidden from active job listings. 
                                Applicants will no longer be able to apply to this job until it's restored.
                            </span>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl flex-shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white shadow-md"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Archiving...</span>
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faArchive} />
                                <span>Archive Job</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MoveToArchiveModal;