import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCheckCircle, 
    faUserGraduate, 
    faFire,
    faSort,
    faSortUp,
    faSortDown,
    faAngleDoubleRight,
    faChevronRight,
    faChevronLeft,
    faAngleDoubleLeft
} from '@fortawesome/free-solid-svg-icons';

import FilterBar from "../../components/common/FilterBar";
import ApplicantTable from "../../components/tables/ApplicantTable";

// Modals
import EditAppModal from "../../components/modals/NM/applicants/EditAppModal.jsx";
import MoveToArchiveModal from "../../components/modals/NM/applicants/MoveToArchiveModal.jsx";
import ViewAppModal from "../../components/modals/NM/applicants/ViewAppModal.jsx";

function NMApplicants() {
    // State declarations
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showNewApplications, setShowNewApplications] = useState(false);
    const [newApplications, setNewApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Sorting states
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

    // Modal states
    const [showEditModal, setShowEditModal] = useState(false);
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const navigate = useNavigate();

    // Filter options
    const statusOptions = [
        { value: 'pending', label: 'PENDING' },
        { value: 'reviewed', label: 'REVIEWED' },
        { value: 'interviewed', label: 'INTERVIEWED' },
        { value: 'hired', label: 'HIRED' },
        { value: 'rejected', label: 'REJECTED' }
    ];

    // Fetch applications
    const fetchApplications = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/applications/getAll', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error(`Failed to fetch applications: ${response.status}`);

            const result = await response.json();

            if (result.success) {
                const sortedApplications = (result.data || []).sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                setApplicants(sortedApplications);
                setSuccessMessage('Applications fetched successfully');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                throw new Error(result.message || 'Failed to fetch applications');
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            setError(error.message || 'Failed to fetch applications');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

 
    // Update application status with email
    const handleUpdateApplication = async (applicationId, status, notes, sendEmail = true, adminMessage = '') => {
        try {
            setUpdatingId(applicationId);
            const token = localStorage.getItem('token');
            
            if (!token) {
                navigate('/login');
                return;
            }

            // Log what we're sending
            console.log('Sending to backend:', { status, notes, sendEmail, adminMessage });

            const response = await fetch(`http://localhost:5000/api/applications/updateStatus/${applicationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    status, 
                    notes, 
                    sendEmail: sendEmail === true, // Force boolean
                    adminMessage: adminMessage || '' 
                })
            });

            const result = await response.json();

            if (result.success) {
                setApplicants(prev => prev.map(app => 
                    app._id === applicationId ? { ...app, status, notes } : app
                ));

                if (sendEmail === true && status !== originalStatus) {
                    setSuccessMessage(`Application updated and email notification sent!`);
                } else {
                    setSuccessMessage(`Application updated successfully to ${status}`);
                }
                setTimeout(() => setSuccessMessage(''), 3000);
                return result;
            } else {
                throw new Error(result.message || 'Failed to update application');
            }
        } catch (error) {
            console.error('Error updating application:', error);
            setError(error.message || 'Failed to update application');
            throw error;
        } finally {
            setUpdatingId(null);
        }
    };

    // Store original status for comparison
    const [originalStatus, setOriginalStatus] = useState('');

    const handleEditClick = (application) => {
        setSelectedApplication(application);
        setOriginalStatus(application.status); // Store original status
        setShowEditModal(true);
    };

    const handleSaveEdit = async (data) => {
        if (selectedApplication && selectedApplication._id) {
            // Compare if status actually changed
            const statusChanged = data.status !== originalStatus;
            
            await handleUpdateApplication(
                selectedApplication._id, 
                data.status, 
                data.notes,
                data.sendEmail && statusChanged, // Only send email if checkbox checked AND status changed
                data.adminMessage
            );
            setShowEditModal(false);
        }
    };

    // Archive handlers
    const handleArchiveClick = (application) => {
        setSelectedApplication(application);
        setShowArchiveModal(true);
    };

    const handleArchiveSuccess = (applicationId) => {
        setApplicants(prev => prev.filter(app => app._id !== applicationId));
        setSuccessMessage('Application archived successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

   
    // View handler
    const handleViewClick = (application) => {
        setSelectedApplication(application);
        setShowViewModal(true);
    };

    // Filter handlers
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
        // When searching, disable new applicants filter
        if (showNewApplications) {
            setShowNewApplications(false);
            setNewApplications([]);
        }
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
        // When filtering by status, disable new applicants filter
        if (showNewApplications) {
            setShowNewApplications(false);
            setNewApplications([]);
        }
    };

    const identifyNewApplicants = () => {
        const recent = [...applicants]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3);
        setNewApplications(recent);
        setShowNewApplications(true);
        setStatusFilter('all'); // Reset status filter
        setSearchTerm(''); // Clear search term
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setShowNewApplications(false);
        setNewApplications([]);
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
        let displayApps = [...applicants];

        // Apply search filter
        if (searchTerm) {
            displayApps = displayApps.filter(app => 
                `${app.firstName} ${app.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.status.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply status filter (only if not showing new applications)
        if (statusFilter !== 'all' && !showNewApplications) {
            displayApps = displayApps.filter(app => app.status === statusFilter);
        }

        // Apply new applications filter (takes priority)
        if (showNewApplications) {
            displayApps = newApplications;
        }

        // Apply sorting
        displayApps.sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (sortConfig.key === 'createdAt') {
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

    // Generate page numbers to display
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
            rejected: 'bg-red-100 text-red-800 border-red-200'
        };
        
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
                {status?.toUpperCase()}
            </span>
        );
    };

    if (loading) return <LoadingSpinner message="Loading applicants..." />;

    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
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
                <p className="text-sm font-light text-orange-400 mb-2 tracking-wider">APPLICANTS</p>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-orange-900 font-light">MANAGE YOUR JOB APPLICATIONS</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-orange-500">
                        <FontAwesomeIcon icon={faUserGraduate} />
                        <span>Total: {applicants.length}</span>
                    </div>
                </div>
            </header>

            {/* Filter Bar */}
            <FilterBar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search applicants..."
                filterOptions={statusOptions}
                filterValue={statusFilter}
                onFilterChange={handleStatusFilterChange}
                filterPlaceholder="ALL STATUS"
                showSpecialFilter={true}
                specialFilterLabel="NEW APPLICANTS"
                specialFilterIcon={faFire}
                onSpecialFilterClick={identifyNewApplicants}
                isSpecialFilterActive={showNewApplications}
                resultsCount={filteredApplications.length}
                resultsLabel="APPLICANTS"
                onRefresh={fetchApplications}
                onClearFilters={clearFilters}
            />

            {/* Applicants Table */}
            <ApplicantTable
                applicants={currentItems}
                onSort={handleSort}
                sortConfig={sortConfig}
                getSortIcon={getSortIcon}
                onView={handleViewClick}
                onEdit={handleEditClick}
                onArchive={handleArchiveClick}
                updatingId={updatingId}
                StatusBadge={StatusBadge}
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredApplications.length)} of {filteredApplications.length} applicants
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {/* First Page */}
                        <button
                            onClick={goToFirstPage}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="First Page"
                        >
                            <FontAwesomeIcon icon={faAngleDoubleLeft} className="text-xs" />
                        </button>
                        
                        {/* Previous Page */}
                        <button
                            onClick={goToPrevPage}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Previous Page"
                        >
                            <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                        </button>
                        
                        {/* Page Numbers */}
                        <div className="flex items-center gap-1">
                            {showEllipsisStart && (
                                <span className="px-2 py-1.5 text-gray-400">...</span>
                            )}
                            
                            {pageNumbers.map(page => (
                                <button
                                    key={page}
                                    onClick={() => goToPage(page)}
                                    className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors ${
                                        currentPage === page
                                            ? 'border-orange-500 bg-orange-500 text-white'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            
                            {showEllipsisEnd && (
                                <span className="px-2 py-1.5 text-gray-400">...</span>
                            )}
                        </div>
                        
                        {/* Next Page */}
                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Next Page"
                        >
                            <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                        </button>
                        
                        {/* Last Page */}
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

            <EditAppModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSave={handleSaveEdit}
                application={selectedApplication}
            />

            <MoveToArchiveModal
                isOpen={showArchiveModal}
                onClose={() => setShowArchiveModal(false)}
                onMoveToArchiveSuccess={handleArchiveSuccess}
                application={selectedApplication}
            />
        </div>
    );
}

export default NMApplicants;