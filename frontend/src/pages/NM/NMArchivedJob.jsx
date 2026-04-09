import { useNavigate } from "react-router-dom";
import React, { useCallback, useState, useEffect } from "react";
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
    faBox
} from '@fortawesome/free-solid-svg-icons';

import FilterBar from "../../components/common/FilterBar.jsx";
import ArchivedJobCard from "../../components/ArchivedJobCard.jsx";

// Modals
import ViewArchivedJobModal from "../../components/modals/NM/jobs/archived/ViewArchivedJobModal.jsx";
import RestoreJobModal from "../../components/modals/NM/jobs/archived/RestoreJobModal.jsx";
import DeleteJobModal from "../../components/modals/NM/jobs/archived/DeleteJobModal.jsx";

import api from '../services/api.js';

function NMArchivedJob() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [archivedJobs, setArchivedJobs] = useState([]);
    const [restoringId, setRestoringId] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    
    // Sorting states
    const [sortConfig, setSortConfig] = useState({ key: 'archivedAt', direction: 'desc' });
    
    // Modal states
    const [showViewModal, setShowViewModal] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    const navigate = useNavigate();

    const fetchArchivedJobs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError('Authentication token not found. Please log in again.');
                navigate('/login');
                return;
            }
            
            const response = await api.get('/jobs/archived', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
                throw new Error('Session expired. Please log in again.');
            }

            if (!response.ok) {
                throw new Error(`Failed to fetch archived jobs ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                const sortedJobs = (result.data || []).sort((a, b) => 
                    new Date(b.archivedAt) - new Date(a.archivedAt)
                );
                setArchivedJobs(sortedJobs);
                setSuccessMessage('Archived jobs loaded successfully');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                throw new Error(result.message || 'Failed to load archived jobs');
            }
            
        } catch (error) {
            console.error('Fetch Archived Jobs Error: ', error);
            setError(error.message || 'An error occurred while fetching archived jobs');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchArchivedJobs();
    }, [fetchArchivedJobs]);

    const handleRestoreJob = async (jobId) => {
        try {
            setRestoringId(jobId);
            const token = localStorage.getItem('token');

            if (!token) {
                setError('Authentication token not found. Please log in again.');
                navigate('/login');
                return;
            }

            const response = await api.put(`/jobs/restore/${jobId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
                throw new Error('Session expired. Please log in again.');
            }

            const result = await response.json();

            if (result.success) {
                // Update the jobs list by removing the restored job
                setArchivedJobs(prev => {
                    const updatedJobs = prev.filter(job => job._id !== jobId);
                    // Reset pagination if current page becomes empty
                    const newTotalPages = Math.ceil(updatedJobs.length / itemsPerPage);
                    if (currentPage > newTotalPages && newTotalPages > 0) {
                        setCurrentPage(newTotalPages);
                    }
                    return updatedJobs;
                });
                
                setSuccessMessage('Job restored successfully');
                setTimeout(() => setSuccessMessage(''), 3000);
                setShowRestoreModal(false);
                setSelectedJob(null);
            } else {
                throw new Error(result.message || 'Failed to restore job');
            }
            
        } catch (error) {
            console.error('Restore Job Error: ', error);
            setError(error.message || 'Failed to restore job');
        } finally {
            setRestoringId(null);
        }
    };

    const handleRestoreClick = (job) => {
        setSelectedJob(job);
        setShowRestoreModal(true);
    };

    const handleConfirmRestore = () => {
        if (selectedJob) {
            handleRestoreJob(selectedJob._id);
        }
    };

    const handleDeleteJob = async (jobId) => {
        try {
            setDeleteLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                setError('Authentication token not found. Please log in again.');
                navigate('/login');
                return;
            }

            const response = await api.delete(`/jobs/delete/${jobId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
                throw new Error('Session expired. Please log in again.');
            }

            const result = await response.json();

            if (result.success) {
                // Update the jobs list by removing the deleted job
                setArchivedJobs(prev => {
                    const updatedJobs = prev.filter(job => job._id !== jobId);
                    // Reset pagination if current page becomes empty
                    const newTotalPages = Math.ceil(updatedJobs.length / itemsPerPage);
                    if (currentPage > newTotalPages && newTotalPages > 0) {
                        setCurrentPage(newTotalPages);
                    }
                    return updatedJobs;
                });
                
                setSuccessMessage('Job deleted permanently');
                setTimeout(() => setSuccessMessage(''), 3000);
                setShowDeleteModal(false);
                setSelectedJob(null);
            } else {
                throw new Error(result.message || 'Failed to delete job');
            }
        } catch (error) {
            console.error('Delete Job Error: ', error);
            setError(error.message || 'Failed to delete job');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteClick = (job) => {
        setSelectedJob(job);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedJob) {
            await handleDeleteJob(selectedJob._id);
        }
    };

    // Filter handlers
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setCurrentPage(1);
    };

    const getFilteredJobs = () => {
        let filtered = [...archivedJobs];

        if (searchTerm) {
            filtered = filtered.filter(job => 
                job.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.salary?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (sortConfig.key === 'archivedAt') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            if (sortConfig.key === 'name') {
                aValue = a.name || '';
                bValue = b.name || '';
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    };

    const filteredJobs = getFilteredJobs();
    
    // Pagination calculations
    const totalPages = Math.max(1, Math.ceil(filteredJobs.length / itemsPerPage));
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);

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
    const showStartPage = pageNumbers[0] > 1;
    const showEndPage = pageNumbers[pageNumbers.length - 1] < totalPages;

    if (loading) return <LoadingSpinner message="Loading archived jobs..." />;

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
                <div className="bg-white border border-orange-200 p-8 text-center">
                    <p className="text-6xl text-orange-200 mb-4">—</p>
                    <p className="text-gray-500 font-light mb-4">Error: {error}</p>
                    <button 
                        onClick={fetchArchivedJobs}
                        className="px-6 py-2 border border-orange-300 text-gray-600 text-sm font-light tracking-wider hover:border-orange-900 hover:text-orange-900 hover:bg-stone-50 transition-all duration-300"
                    >
                        RETRY
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
            {/* Back Button */}
            <button
                onClick={() => navigate('/nm-admin/jobs')}
                className="mb-6 flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors"
            >
                <FontAwesomeIcon icon={faArrowLeft} />
                <span className="text-sm">Back to Active Jobs</span>
            </button>

            {/* Success Message */}
            {successMessage && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                    <span className="text-green-700">{successMessage}</span>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <span className="text-red-700">{error}</span>
                </div>
            )}

            {/* Header */}
            <header className="mb-8">
                <p className="text-sm font-light text-orange-400 mb-2 tracking-wider">ARCHIVED JOBS</p>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-orange-900 font-light">MANAGE YOUR ARCHIVED JOB LISTINGS</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FontAwesomeIcon icon={faArchive} />
                        <span>{archivedJobs.length} {archivedJobs.length === 1 ? 'job' : 'jobs'} archived</span>
                    </div>
                </div>
            </header>

            {/* Filter Bar */}
            <FilterBar 
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search archived jobs..."
                resultsCount={filteredJobs.length}
                resultsLabel="JOBS"
                onRefresh={fetchArchivedJobs}
            />

            {/* Job Grid */}
            <div>
                {currentItems.length === 0 ? (
                    <div className="bg-white border border-gray-200 p-16 text-center rounded-xl">
                        <FontAwesomeIcon icon={faBox} className="text-5xl text-gray-200 mb-4" />
                        <p className="text-gray-500 font-light mb-2">No archived jobs found</p>
                        <p className="text-sm text-gray-400 font-light">
                            {searchTerm ? 'Try a different search term' : 'Archived jobs will appear here'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentItems.map((job) => (
                            <ArchivedJobCard 
                                key={job._id} 
                                job={job} 
                                onView={() => {
                                    setSelectedJob(job);
                                    setShowViewModal(true);
                                }}
                                onRestore={() => handleRestoreClick(job)}
                                onDelete={() => handleDeleteClick(job)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredJobs.length)} of {filteredJobs.length} jobs
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={goToFirstPage} disabled={currentPage === 1} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <FontAwesomeIcon icon={faAngleDoubleLeft} className="text-xs" />
                        </button>
                        <button onClick={goToPrevPage} disabled={currentPage === 1} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                        </button>

                        <div className="flex items-center gap-1">
                            {showStartPage && <span className="px-2 py-1.5 text-gray-400">...</span>}
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
                            {showEndPage && <span className="px-2 py-1.5 text-gray-400">...</span>}
                        </div>

                        <button onClick={goToNextPage} disabled={currentPage === totalPages} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                        </button>
                        <button onClick={goToLastPage} disabled={currentPage === totalPages} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <FontAwesomeIcon icon={faAngleDoubleRight} className="text-xs" />
                        </button>
                    </div>
                </div>
            )}

            {/* Modals */}
            <ViewArchivedJobModal 
                isOpen={showViewModal}
                onClose={() => {
                    setShowViewModal(false);
                    setSelectedJob(null);
                }}
                jobId={selectedJob?._id}
            />

            <RestoreJobModal 
                isOpen={showRestoreModal}
                onClose={() => {
                    setShowRestoreModal(false);
                    setSelectedJob(null);
                }}
                onConfirm={handleConfirmRestore}
                job={selectedJob}
                isRestoring={restoringId === selectedJob?._id}
            />

            <DeleteJobModal 
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedJob(null);
                }}
                onConfirm={handleConfirmDelete}
                job={selectedJob}
                loading={deleteLoading}
            />
        </div>
    );
}

export default NMArchivedJob;