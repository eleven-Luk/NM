import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faEye, 
    faTrashRestore, 
    faSort, 
    faSortUp, 
    faSortDown,
    faBriefcase,
    faUser,
    faTrash
} from '@fortawesome/free-solid-svg-icons';

const ArchivedApplicantTable = ({
    applicants,
    onSort,
    sortConfig,
    getSortIcon,
    onView,
    onRestore,
    onDelete,
    restoringId,
    updatingId,
    StatusBadge,
    currentPage = 1,
    itemsPerPage = 10
}) => {
    if (applicants.length === 0) {
        return (
            <div className="bg-white border border-gray-200 p-16 text-center">
                <FontAwesomeIcon icon={faBriefcase} className="text-5xl text-gray-200 mb-4" />
                <p className="text-gray-500 font-light mb-2">No archived applicants found</p>
                <p className="text-sm text-gray-400 font-light">
                    Archived applications will appear here
                </p>
            </div>
        );
    }

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
        return typeMap[type?.toLowerCase()] || type || '';
    };

    const getRowNumber = (index) => {
        return (currentPage - 1) * itemsPerPage + index + 1;
    };


    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            #
                        </th>
                        <th 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => onSort('name')}
                        >
                            <div className="flex items-center gap-2">
                                Applicant
                                <FontAwesomeIcon icon={getSortIcon('name')} className="text-gray-400" />
                            </div>
                        </th>
                        <th 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => onSort('email')}
                        >
                            <div className="flex items-center gap-2">
                                Contact
                                <FontAwesomeIcon icon={getSortIcon('email')} className="text-gray-400" />
                            </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Job Details
                        </th>
                        <th 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => onSort('status')}
                        >
                            <div className="flex items-center gap-2">
                                Status
                                <FontAwesomeIcon icon={getSortIcon('status')} className="text-gray-400" />
                            </div>
                        </th>
                        <th 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => onSort('deletedAt')}
                        >
                            <div className="flex items-center gap-2">
                                Archived Date
                                <FontAwesomeIcon icon={getSortIcon('deletedAt')} className="text-gray-400" />
                            </div>
                        </th>
                        <th className="pr-12 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {applicants.map((applicant, index) => (
                        <tr key={applicant._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {getRowNumber(index)}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                                        <span className="text-orange-600 font-medium">
                                            {applicant.firstName?.[0]}{applicant.lastName?.[0]}
                                        </span>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {applicant.firstName} {applicant.lastName}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">{applicant.email}</div>
                                <div className="text-sm text-gray-500">{applicant.phone}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">
                                    {applicant.jobId?.name || 'N/A'}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {formatJobType(applicant.jobId?.type)}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <StatusBadge status={applicant.status} />
                                {applicant.notes && (
                                    <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                                        📝 {applicant.notes}
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {applicant.archivedAt ? (
                                    <>
                                        <div className='py-1'>{new Date(applicant.archivedAt).toLocaleDateString()}</div>
                                        <div className="text-xs">
                                            {new Date(applicant.archivedAt).toLocaleTimeString()}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-gray-400">N/A</div>
                                )}
                            </td>

                            <td className="px-6 py-4 text-right text-md font-medium">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => onView(applicant)}
                                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                                        title="View Details"
                                    >
                                        <FontAwesomeIcon icon={faEye} />
                                    </button>
                                    <button
                                        onClick={() => onRestore(applicant)}
                                        className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
                                        title="Restore Application"
                                        disabled={restoringId === applicant._id}
                                    >
                                        <FontAwesomeIcon icon={faTrashRestore} />
                                    </button>
                                    {restoringId === applicant._id && (
                                        <span className="text-xs text-blue-500 animate-pulse">Restoring...</span>
                                    )}
                                    <button
                                        onClick={() => onDelete &&onDelete(applicant)}
                                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                                        title="Delete Application"
                                        disabled={updatingId === applicant._id}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ArchivedApplicantTable;