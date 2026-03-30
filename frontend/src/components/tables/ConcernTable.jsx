import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faEye, 
    faEdit, 
    faTrashAlt,
    faEnvelopesBulk
} from '@fortawesome/free-solid-svg-icons';

const ConcernTable = ({
    concerns,
    onSort,
    getSortIcon,
    onView,
    onEdit,
    onDelete,
    StatusBadge,
    updatingId,
    currentPage = 1,
    itemsPerPage = 10,
    isSelectMode = false,
    selectedConcerns = [],
    onSelectConcern,
    onSelectAll
}) => {
    if (!concerns || concerns.length === 0) {
        return (
            <div className="bg-white border border-gray-200 p-16 text-center">
                <FontAwesomeIcon icon={faEnvelopesBulk} className="text-5xl text-gray-200 mb-4" />
                <p className="text-gray-500 font-light mb-2">No concerns found</p>
                <p className="text-sm text-gray-400 font-light">
                    Concerns will appear here when someone submits a concern through the application.
                </p>
            </div>
        );
    }

    const formatConcernType = (type) => {
        const typeMap = {
            'general': 'General Inquiry',
            'employer-partnership': 'Employer Partnership',
            'package-information': 'Package Information',
            'others': 'Others'
        };
        return typeMap[type?.toLowerCase()] || type || '';
    };

    // Calculate row number based on current page
    const getRowNumber = (index) => {
        return (currentPage - 1) * itemsPerPage + index + 1;
    };

    // Check if all items are selected
    const allSelected = concerns.length > 0 && selectedConcerns.length === concerns.length;

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden overflow-x-auto">
            <table className="min-w-full w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {/* Checkbox Column - Only show in select mode */}
                        {isSelectMode && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={(e) => onSelectAll && onSelectAll(e.target.checked ? concerns.map(c => c._id) : [])}
                                    className="rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                                />
                            </th>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            #
                        </th>
                        <th 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => onSort && onSort('name')}
                        >
                            <div className="flex items-center gap-2">
                                Name
                                {getSortIcon && getSortIcon('name') && (
                                    <FontAwesomeIcon icon={getSortIcon('name')} className="text-gray-400" />
                                )}
                            </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                        </th>
                        <th 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => onSort && onSort('status')}
                        >
                            <div className="flex items-center gap-2">
                                Status
                                {getSortIcon && getSortIcon('status') && (
                                    <FontAwesomeIcon icon={getSortIcon('status')} className="text-gray-400" />
                                )}
                            </div>
                        </th>
                        <th 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => onSort && onSort('createdAt')}
                        >
                            <div className="flex items-center gap-2">
                                Created At
                                {getSortIcon && getSortIcon('createdAt') && (
                                    <FontAwesomeIcon icon={getSortIcon('createdAt')} className="text-gray-400" />
                                )}
                            </div>
                        </th>  
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th> 
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {concerns.map((concern, index) => (
                        <tr key={concern._id} className="hover:bg-gray-50 transition-colors">
                            {/* Checkbox Column - Only show in select mode */}
                            {isSelectMode && (
                                <td className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedConcerns.includes(concern._id)}
                                        onChange={() => onSelectConcern && onSelectConcern(concern._id)}
                                        className="rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                                    />
                                </td>
                            )}
                            
                            {/* Row Number Column */}
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {getRowNumber(index)}
                            </td>
                            
                            {/* Name Column */}
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                                        <span className="text-orange-600 font-medium">
                                            {concern.name?.[0]?.toUpperCase() || '?'}
                                        </span>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {concern.name}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            
                            {/* Contact Column */}
                            <td className="px-6 py-4"> 
                                <div className="text-sm text-gray-900">{concern.email}</div>
                                <div className="text-sm text-gray-500">{concern.phone}</div>
                                {concern.companyName && (
                                    <div className="text-xs text-gray-400 mt-1">
                                        Company: {concern.companyName}
                                    </div>
                                )}
                            </td>
                            
                            {/* Type Column */}
                            <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">{formatConcernType(concern.inquiryType)}</div>
                                {concern.position && (
                                    <div className="text-xs text-gray-500 mt-1">
                                        Position: {concern.position}
                                    </div>
                                )}
                            </td>
                            
                            {/* Status Column */}
                            <td className="px-6 py-4">
                                <StatusBadge status={concern.status} />
                                {concern.notes && (
                                    <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                                        📝 {concern.notes}
                                    </div>
                                )}
                            </td>
                            
                            {/* Created At Column */}
                            <td className="px-6 py-4 text-sm text-gray-500">
                                <div>{new Date(concern.createdAt).toLocaleDateString()}</div>
                                <div className="text-xs">
                                    {new Date(concern.createdAt).toLocaleTimeString()}
                                </div>
                            </td>
                            
                            {/* Actions Column */}
                            <td className="px-6 py-4 text-right text-sm font-medium">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => onView && onView(concern)}
                                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                                        title="View Details"
                                    >
                                        <FontAwesomeIcon icon={faEye} />
                                    </button>
                                    <button
                                        onClick={() => onEdit && onEdit(concern)}
                                        className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
                                        title="Edit Status"
                                        disabled={updatingId === concern._id}
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button
                                        onClick={() => onDelete && onDelete(concern)}
                                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                                        title="Delete"
                                        disabled={updatingId === concern._id}
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </button>
                                    {updatingId === concern._id && (
                                        <span className="text-xs text-blue-500 animate-pulse">Updating...</span>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ConcernTable;