// pages/NM/NMApplicantsArchive.jsx
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCheckCircle, 
    faArchive, 
    faSearch,
    faTimes,
    faSort,
    faSortUp,
    faSortDown,
    faArrowLeft,
    faAngleDoubleLeft,
    faChevronLeft,
    faChevronRight,
    faAngleDoubleRight,
    faCheckSquare,
    faSquare,
    faTrash,
    faFileExcel
} from '@fortawesome/free-solid-svg-icons';
import ArchivedApplicantTable from "../../components/tables/ArchivedApplicantTable";
import ViewAppModal from "../../components/modals/NM/applicants/ViewAppModal";
import RestoreModal from "../../components/modals/NM/applicants/archieve/RestoreModal.jsx";
import DeleteModal from "../../components/modals/NM/applicants/archieve/DeleteModal.jsx";


function NMApplicantsArchive() {
    // State declarations
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [archivedApplicants, setArchivedApplicants] = useState([]);
    const [restoringId, setRestoringId] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Sorting states
    const [sortConfig, setSortConfig] = useState({ key: 'archivedAt', direction: 'desc' });

    // Modal states
    const [showViewModal, setShowViewModal] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [newApplications, setNewApplications] = useState([]);

    // Bulk delete states
    const [selectedApplications, setSelectedApplications] = useState([]);
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
    const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);

    const navigate = useNavigate();

    // Fetch archived applications
    const fetchArchivedApplications = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/applications/archived', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error(`Failed to fetch archived applications: ${response.status}`);

            const result = await response.json();

            if (result.success) {
                const sortedApplications = (result.data || []).sort((a, b) =>
                    new Date(b.archivedAt) - new Date(a.archivedAt)
                );
                setArchivedApplicants(sortedApplications);
                setSuccessMessage('Archived applications fetched successfully');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                throw new Error(result.message || 'Failed to fetch archived applications');
            }
        } catch (error) {
            console.error('Error fetching archived applications:', error);
            setError(error.message || 'Failed to fetch archived applications');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchArchivedApplications();
    }, [fetchArchivedApplications]);

    // Restore application
    const handleRestoreApplication = async (applicationId) => {
        try {
            setRestoringId(applicationId);
            const token = localStorage.getItem('token');
            
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`http://localhost:5000/api/applications/restore/${applicationId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (result.success) {
                setArchivedApplicants(prev => prev.filter(app => app._id !== applicationId));
                setSuccessMessage('Application restored successfully');
                setTimeout(() => setSuccessMessage(''), 3000);
                setShowRestoreModal(false);
                handleExitSelectMode();
            } else {
                throw new Error(result.message || 'Failed to restore application');
            }
        } catch (error) {
            console.error('Error restoring application:', error);
            setError(error.message || 'Failed to restore application');
        } finally {
            setRestoringId(null);
        }
    };

    // Bulk delete functions
    const handleSelectApplication = (applicationId) => {
        setSelectedApplications(prev => 
            prev.includes(applicationId) 
                ? prev.filter(id => id !== applicationId)
                : [...prev, applicationId]
        );
    };

    const handleSelectAll = (applicationIds) => {
        setSelectedApplications(applicationIds);
    };

    const handleExitSelectMode = () => {
        setIsSelectMode(false);
        setSelectedApplications([]);
    };

    const handleBulkDelete = async () => {
        if (selectedApplications.length === 0) {
            setError('Please select at least one application to delete');
            return;
        }

        setBulkDeleteLoading(true);
        let successCount = 0;
        let errorCount = 0;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please login to delete applications');
                navigate('/login');
                return;
            }

            // Delete each selected application
            for (const applicationId of selectedApplications) {
                try {
                    const response = await fetch(`http://localhost:5000/api/applications/delete/${applicationId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    const result = await response.json();

                    if (result.success) {
                        successCount++;
                    } else {
                        errorCount++;
                        console.error(`Failed to delete application ${applicationId}:`, result.message);
                    }
                } catch (error) {
                    errorCount++;
                    console.error(`Error deleting application ${applicationId}:`, error);
                }
            }

            // Update the applications list
            setArchivedApplicants(prev => prev.filter(app => !selectedApplications.includes(app._id)));
            
            if (newApplications) {
                setNewApplications(prev => prev.filter(app => !selectedApplications.includes(app._id)));
            }

            // Show success message
            if (successCount > 0) {
                setSuccessMessage(`Successfully deleted ${successCount} application(s). ${errorCount > 0 ? `Failed to delete ${errorCount} application(s).` : ''}`);
                setTimeout(() => setSuccessMessage(''), 5000);
            } else {
                setError(`Failed to delete ${errorCount} application(s). Please try again.`);
            }

            // Clear selections and exit select mode
            setSelectedApplications([]);
            setIsSelectMode(false);
            setShowBulkDeleteModal(false);

            // Adjust pagination if needed
            const remainingCount = archivedApplicants.length - successCount;
            const newTotalPages = Math.ceil(remainingCount / itemsPerPage);
            if (currentPage > newTotalPages && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }

        } catch (error) {
            console.error('Error during bulk delete:', error);
            setError('Failed to delete selected applications. Please try again.');
        } finally {
            setBulkDeleteLoading(false);
        }
    };

    const handleBulkDeleteClick = () => {
        if (selectedApplications.length === 0) {
            setError('Please select at least one application to delete');
            return;
        }
        setShowBulkDeleteModal(true);
    };

    // Modal handlers
    const handleViewClick = (application) => {
        setSelectedApplication(application);
        setShowViewModal(true);
    };

    const handleRestoreClick = (application) => {
        setSelectedApplication(application);
        setShowRestoreModal(true);
    };

    const handleConfirmRestore = () => {
        handleRestoreApplication(selectedApplication._id);
    };

    const handleDeleteApplication = async (applicationId) => {
        try {
            setDeleteLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                setError('Please login to delete application');
                navigate('/login');
                return;
            }

            const response = await fetch(`http://localhost:5000/api/applications/delete/${applicationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (result.success) {
                setArchivedApplicants(prev => prev.filter(app => app._id !== applicationId));

                if (newApplications) {
                    setNewApplications(prev => prev.filter(app => app._id !== applicationId));
                }
                
                setSuccessMessage('Application deleted successfully');
                setTimeout(() => setSuccessMessage(''), 3000);

                setShowDeleteModal(false);
                setSelectedApplication(null);
                handleExitSelectMode();

                const remainingCount = archivedApplicants.length - 1;
                const newTotalPages = Math.ceil(remainingCount / itemsPerPage);
                if (currentPage > newTotalPages && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }
            } else {
                throw new Error(result.message || 'Failed to delete application');
            }
            
        } catch (error) {
            console.error('Error deleting application:', error);
            setError(error.message || 'Failed to delete application');
            throw error;
        } finally {
            setDeleteLoading(false);
        } 
    };

    const handleDelete = (application) => {
        setSelectedApplication(application);
        setShowDeleteModal(true);
    };
    
    const handleConfirmDelete = async () => {
        if (selectedApplication){
            await handleDeleteApplication(selectedApplication._id);
        }
    };

    // Filter handlers
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
        handleExitSelectMode();
    };

    const clearFilters = () => {
        setSearchTerm('');
        setCurrentPage(1);
        handleExitSelectMode();
    };

    // Sorting handlers
    const handleSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key, direction });
        handleExitSelectMode();
    };
    
    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return faSort;
        return sortConfig.direction === 'asc' ? faSortUp : faSortDown;
    };

    // Get filtered and sorted applications
    const getDisplayApplications = () => {
        let displayApps = [...archivedApplicants];

        if (searchTerm) {
            displayApps = displayApps.filter(app => 
                `${app.firstName} ${app.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.jobId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        displayApps.sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (sortConfig.key === 'archivedAt') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            if (sortConfig.key === 'name') {
                aValue = `${a.firstName} ${a.lastName}`;
                bValue = `${b.firstName} ${b.lastName}`;
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return displayApps;
    };

    const filteredApplications = getDisplayApplications();
    
    // Pagination calculations
    const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);

    // Pagination navigation
    const goToPage = (page) => {
        setCurrentPage(Math.min(Math.max(1, page), totalPages));
    };

    const goToFirstPage = () => goToPage(1);
    const goToLastPage = () => goToPage(totalPages);
    const goToNextPage = () => goToPage(currentPage + 1);
    const goToPrevPage = () => goToPage(currentPage - 1);

    // Generate page numbers
    const getPageNumbers = () => {
        const maxButtons = 5;
        const pages = [];
        const half = Math.floor(maxButtons / 2);
        let start = Math.max(1, currentPage - half);
        let end = Math.min(totalPages, start + maxButtons - 1);
        
        if (end - start + 1 < maxButtons) {
            start = Math.max(1, end - maxButtons + 1);
        }
        
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    const pageNumbers = getPageNumbers();
    const showEllipsisStart = pageNumbers[0] > 1;
    const showEllipsisEnd = pageNumbers[pageNumbers.length - 1] < totalPages;

    // Status badge component
    const StatusBadge = ({ status }) => {
        const statusColors = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            reviewed: 'bg-blue-100 text-blue-800 border-blue-200',
            interviewed: 'bg-purple-100 text-purple-800 border-purple-200',
            hired: 'bg-green-100 text-green-800 border-green-200',
            rejected: 'bg-red-100 text-red-800 border-red-200',
            archived: 'bg-gray-100 text-gray-800 border-gray-200'
        };
        
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
                {status?.toUpperCase()}
            </span>
        );
    };

    // Export functions
const formatDateForExport = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};

    const exportToExcel = () => {
        const dataToExport = getDisplayApplications();
        
        const headers = [
            'ID', 'Full Name', 'Email', 'Phone', 'Job Position', 'Status',
            'Archived Date', 'Notes'
        ];

        const rows = dataToExport.map(app => ({
            'ID': app._id?.slice(-8) || 'N/A',
            'Full Name': `${app.firstName || ''} ${app.middleName || ''} ${app.lastName || ''}`.trim() || 'N/A',
            'Email': app.email || 'N/A',
            'Phone': app.phone || 'N/A',
            'Job Position': app.jobId?.name || 'N/A',
            'Status': app.status || 'N/A',
            'Archived Date': formatDateForExport(app.archivedAt),
            'Notes': app.notes || 'N/A'
        }));

        // Create HTML table for Excel
        let htmlContent = `
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Archived Applicants Export</title>
                <style>
                    th { background-color: #f97316; color: white; padding: 8px; }
                    td { padding: 6px; border: 1px solid #ddd; }
                    table { border-collapse: collapse; width: 100%; }
                </style>
            </head>
            <body>
                <h2>Archived Applicants Report</h2>
                <p>Generated on: ${new Date().toLocaleString()}</p>
                <p>Total Records: ${dataToExport.length}</p>
                <table border="1">
                    <thead>
                        <tr>
                            ${headers.map(h => `<th>${h}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.map(row => `
                            <tr>
                                ${Object.values(row).map(val => `<td>${String(val).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;

        const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', `archived_applicants_export_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.xls`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        setSuccessMessage(`Exported ${dataToExport.length} archived applicants to Excel`);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    if (loading) return <LoadingSpinner message="Loading archived applicants..." />;

    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
            {/* Back Button */}
            <button
                onClick={() => navigate('/nm/applicants')} 
                className="mb-6 flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors"
            >
                <FontAwesomeIcon icon={faArrowLeft} />
                <span className="text-sm">Back to Applicants</span>
            </button>

            {/* Success Message */}
            {successMessage && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                    <p className="text-green-700">{successMessage}</p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {/* Header */}
            <header className="mb-8">
                <p className="text-sm font-light text-orange-400 mb-2 tracking-wider">ARCHIVE</p>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-light text-orange-900">MANAGE ARCHIVED JOB APPLICATIONS</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-orange-500">
                        <FontAwesomeIcon icon={faArchive} />
                        <span>Total: {archivedApplicants.length}</span>
                    </div>
                     <button
                        onClick={exportToExcel}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors flex items-center gap-2 bg-white"
                    >
                        <FontAwesomeIcon icon={faFileExcel} className="text-green-700" />
                        Export to Excel
                    </button>
                </div>
            </header>

            {/* Bulk Actions Bar */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {!isSelectMode ? (
                        <button
                            onClick={() => setIsSelectMode(true)}
                            className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:border-orange-400 hover:text-orange-500 transition-colors flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faCheckSquare} />
                            Select Multiple
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => handleSelectAll(currentItems.map(app => app._id))}
                                className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:border-orange-400 hover:text-orange-500 transition-colors flex items-center gap-2"
                            >
                                <FontAwesomeIcon icon={selectedApplications.length === currentItems.length ? faCheckSquare : faSquare} />
                                {selectedApplications.length === currentItems.length ? 'Deselect All' : 'Select All'}
                            </button>
                            <button
                                onClick={handleBulkDeleteClick}
                                disabled={selectedApplications.length === 0}
                                className={`px-4 py-2 text-sm border rounded-lg transition-colors flex items-center gap-2 ${
                                    selectedApplications.length > 0
                                        ? 'border-red-300 text-red-600 hover:bg-red-50 hover:border-red-500'
                                        : 'border-gray-300 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                                Delete Selected ({selectedApplications.length})
                            </button>
                            <button
                                onClick={handleExitSelectMode}
                                className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:border-gray-500 transition-colors"
                            >
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Filter Bar */}
            <div className="mb-8 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Search Input */}
                        <div className="relative">
                            <input 
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder="Search archived applicants..."
                                className="pl-10 pr-4 py-2 border border-orange-300 text-orange-600 font-light focus:border-orange-400 focus:outline-none transition-colors w-64"
                            />
                            <FontAwesomeIcon 
                                icon={faSearch} 
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 text-sm" 
                            />
                        </div>

                        {/* Results Count */}
                        <p className="text-sm text-orange-500 font-light">
                            {filteredApplications.length} {filteredApplications.length === 1 ? 'ARCHIVED APPLICANT' : 'ARCHIVED APPLICANTS'} FOUND
                        </p>
                    </div>

                    {/* Refresh Button */}
                    <button
                        onClick={fetchArchivedApplications}
                        className="text-xs text-orange-500 hover:text-orange-700 transition-colors font-light tracking-wider"
                    >
                        REFRESH
                    </button>
                </div>

                {/* Active Filters */}
                {searchTerm && (
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-xs text-gray-400 font-light">FILTERING BY:</span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-light border border-gray-200">
                            SEARCH: "{searchTerm}"
                        </span>
                        <button
                            onClick={clearFilters}
                            className="px-2 py-1 text-xs font-light tracking-wider text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
                        >
                            <FontAwesomeIcon icon={faTimes} className="text-xs" />
                            CLEAR
                        </button>
                    </div>
                )}
            </div>

            {/* Archived Applicants Table */}
            <ArchivedApplicantTable
                applicants={currentItems}
                onSort={handleSort}
                sortConfig={sortConfig}
                getSortIcon={getSortIcon}
                onView={handleViewClick}
                onDelete={handleDelete}
                onRestore={handleRestoreClick}
                updatingId={updatingId}
                restoringId={restoringId}
                StatusBadge={StatusBadge}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                isSelectMode={isSelectMode}
                selectedApplications={selectedApplications}
                onSelectApplication={handleSelectApplication}
                onSelectAll={handleSelectAll}
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredApplications.length)} of {filteredApplications.length} archived applicants
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button
                            onClick={goToFirstPage}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FontAwesomeIcon icon={faAngleDoubleLeft} className="text-xs" />
                        </button>
                        <button
                            onClick={goToPrevPage}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                        </button>
                        
                        <div className="flex items-center gap-1">
                            {showEllipsisStart && <span className="px-2 py-1.5 text-gray-400">...</span>}
                            {pageNumbers.map(page => (
                                <button
                                    key={page}
                                    onClick={() => goToPage(page)}
                                    className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors ${
                                        currentPage === page
                                            ? 'border-gray-500 bg-gray-500 text-white'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            {showEllipsisEnd && <span className="px-2 py-1.5 text-gray-400">...</span>}
                        </div>
                        
                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                        </button>
                        <button
                            onClick={goToLastPage}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FontAwesomeIcon icon={faAngleDoubleRight} className="text-xs" />
                        </button>
                    </div>
                </div>
            )}

            {/* Modals */}
            <ViewAppModal
                isOpen={showViewModal}
                onClose={() => setShowViewModal(false)}
                application={selectedApplication}
            />

            <RestoreModal
                isOpen={showRestoreModal}
                onClose={() => setShowRestoreModal(false)}
                onConfirm={handleConfirmRestore}
                application={selectedApplication}
                isRestoring={restoringId === selectedApplication?._id}
            />

            <DeleteModal 
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false)
                    setSelectedApplication(null);
                }}
                onConfirm={handleConfirmDelete}
                item={selectedApplication}
                title="Delete Application"
                subtitle="Are you sure you want to delete this application permanently?"
                loading={deleteLoading}
            />

            {/* Bulk Delete Confirmation Modal */}
            <DeleteModal 
                isOpen={showBulkDeleteModal}
                onClose={() => setShowBulkDeleteModal(false)}
                onConfirm={handleBulkDelete}
                item={null}
                title="Bulk Delete Applications"
                subtitle={`Are you sure you want to delete ${selectedApplications.length} application(s) permanently? This action cannot be undone.`}
                loading={bulkDeleteLoading}
            />
        </div>
    );
}

export default NMApplicantsArchive;