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
    faArrowLeft
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
    const [sortConfig, setSortConfig] = useState({ key: 'deletedAt', direction: 'desc' });

    // Modal states
    const [showViewModal, setShowViewModal] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

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
                setApplicants(prev => prev.filter(app => app._id !== applicationId));
            }

            if (showNewApplications) {
                setNewApplications(prev => prev.filter(app => app._id !== applicationId));
            }
            
            setSuccessMessage('Application deleted successfully');
            setTimeout(() => setSuccessMessage(''), 3000);

            setShowDeleteModal(false);
            setSelectedApplication(null);

            const remainingItems = filteredApplications.length - 1;
            const newTotalPages = Math.ceil(remainingItems / itemsPerPage);
            if (currentPage > newTotalPages && currentPage > 1) {
                setCurrentPage(currentPage - 1);
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
    }
    
    const handleConfirmDelete = async () => {
        if (selectedApplication){
            await handleDeleteApplication(selectedApplication._id);
        }
    }


    // Filter handlers
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setCurrentPage(1);
    };

    // Sorting handlers
    const handleSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key, direction });
    }
    
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

            if (sortConfig.key === 'deletedAt') {
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
            deleted: 'bg-gray-100 text-gray-800 border-gray-200'
        };
        
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
                {status?.toUpperCase()}
            </span>
        );
    };

    if (loading) return <LoadingSpinner message="Loading archived applicants..." />;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Back Button */}
            <button
                onClick={() => navigate('/nm-admin/applicants')}
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
                </div>
            </header>

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
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            <FontAwesomeIcon icon={faAngleDoubleLeft} className="text-xs" />
                        </button>
                        <button
                            onClick={goToPrevPage}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
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
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                        </button>
                        <button
                            onClick={goToLastPage}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
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
                subtitle="Are you sure you want to delete this application?"
                loading={deleteLoading}
            />
        </div>
    );
}

export default NMApplicantsArchive;