import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import JobCard from "../../components/JobCard.jsx";

// Modals
import AddJobModal from "../../components/modals/NM/jobs/AddJobModal.jsx";
import ViewJobModal from "../../components/modals/NM/jobs/ViewJobModal.jsx";
import EditJobModal from "../../components/modals/NM/jobs/EditJobModal.jsx";
import MoveToArchiveModal from "../../components/modals/NM/jobs/MoveToArchiveModal.jsx";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPlus, 
    faBox, 
    faSearch,
    faFire,
    faTimes,
    faCheckCircle,
    faSort,
    faSortUp,
    faSortDown,
    faAngleDoubleLeft,
    faChevronLeft,
    faChevronRight,
    faAngleDoubleRight,
    faBriefcase
} from '@fortawesome/free-solid-svg-icons';
import FilterBar from "../../components/common/FilterBar.jsx";

import api from '../../services/api.js';


function NMJobs(){
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    
    const [successMessage, setSuccessMessage] = useState('');

    // Sorting states
    const [sortConfig, setSortConfig] = useState({
        key: 'createdAt',
        direction: 'desc'
    });

    // Modal States
    const [showAddJobModal, setShowAddJobModal] = useState(false);
    const [showViewJobModal, setShowViewJobModal] = useState(false);
    const [showEditJobModal, setShowEditJobModal] = useState(false);
    const [showArchiveModal, setShowArchiveModal] = useState(false);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewJob, setShowNewJob] = useState(false);
    const [newJobs, setNewJobs] = useState([]);
    const [typeFilter, setTypeFilter] = useState('all');
    const [typeSetup, setTypeSetup] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const navigate = useNavigate();

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            
            // api.get already returns the parsed response data
            const response = await api.get('/jobs/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // With axios, response IS the data (no .json() needed)
            if (response && response.success) {
                const sortedJobs = (response.data || []).sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                setJobs(sortedJobs);
                setSuccessMessage('Jobs fetched successfully');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                throw new Error(response?.message || 'Failed to fetch jobs');
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setError(error.message || 'Failed to fetch jobs');
        } finally {
            setLoading(false);
        }
    }, []);

    // Call fetchJobs when component mounts
    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);


    const handleAddJob = async (jobData) => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                console.log('Please login first')
                return navigate('/login');
            }

            const response = await api.post('/jobs/create', 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json', 
                    }
                });

            if (result.success){
                setJobs(prev => [result.data, ...prev]);
                setShowAddJobModal(false);
                setSuccessMessage('Job added successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
                return result;
            } else {
                throw new Error(result.message || 'Failed to add job');
            }

        } catch (error) {
            console.error('Error adding job:', error);
            setError(error.message || 'Failed to add job');
            throw error;
        }
    };

    const handleDeleteSuccess = (deletedJobId) => {
        setJobs(prev => prev.filter(job => job._id !== deletedJobId));
        setSelectedJob(null);
        setSuccessMessage('Job archived successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    // ✅ FIXED: This function now makes the actual API call
    const handleEditSuccess = async (jobData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            console.log('Updating job with data:', jobData);

            const response = await api.put(`/jobs/update/${jobData.id}`, {
                name: jobData.name,
                description: jobData.description,
                type: jobData.type,
                salary: jobData.salary,
                location: jobData.location,
                status: jobData.status
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            console.log('Update response:', response);

            if (result.success) {
                // Update the jobs list with the updated job
                setJobs(prev => prev.map(job => 
                    job._id === jobData.id ? result.data : job
                ));
                setSuccessMessage('Job updated successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
                setShowEditJobModal(false);
                setSelectedJob(null);
                return result;
            } else {
                throw new Error(result.message || 'Failed to update job');
            }
        } catch (error) {
            console.error('Error updating job:', error);
            setError(error.message || 'Failed to update job');
            throw error;
        }
    };


    const handleConfirmArchive = async () => {
    if (selectedJob) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please login first');
                navigate('/login');
                return;
            }

            const response = await api.patch(`/jobs/archive/${selectedJob._id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response && response.success) {
                setJobs(prev => prev.filter(job => job._id !== selectedJob._id));
                
                if (showNewJob) {
                    setNewJobs(prev => prev.filter(job => job._id !== selectedJob._id));
                }
                
                setSuccessMessage('Job archived successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
                setShowArchiveModal(false);
                setSelectedJob(null);
            } else {
                throw new Error(response?.message || 'Failed to archive job');
            }
        } catch (error) {
            console.error('Error archiving job:', error);
            setError(error.message || 'Failed to archive job');
        }
    }
};


    const handleArchive = (job) => {
        setSelectedJob(job);
        setShowArchiveModal(true);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);

        if (showNewJob) {
            setShowNewJob(false);
            setNewJobs([]);
        }
    }

    const handleType = (e) => {
        setTypeFilter(e.target.value);
        setCurrentPage(1);

        if (showNewJob) {
            setShowNewJob(false);
            setNewJobs([]);
        }
    }

    const handleSetup = (e) => {
        setTypeSetup(e.target.value);
        setCurrentPage(1);

        if (showNewJob) {
            setShowNewJob(false);
            setNewJobs([]);
        }
    }

    const handleStatus = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);

        if (showNewJob) {
            setShowNewJob(false);
            setNewJobs([]);
        }
    }

    const identifyNewJobs = () => {
        const recent = [...jobs].sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateB - dateA;
        }).slice(0, 3);
        setNewJobs(recent);
        setShowNewJob(true);
        setSearchTerm('');
        setTypeFilter('all');
        setTypeSetup('all');
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setTypeFilter('all');
        setTypeSetup('all');
        setShowNewJob(false);
        setNewJobs([]);
        setCurrentPage(1);
    }

    const typeOptions = [
        { value: 'Full-Time', label: 'Full-time' },
        { value: 'Part-Time', label: 'Part-time' },
        { value: 'Contract', label: 'Contract' },
        { value: 'Internship', label: 'Internship' },
    ]

    const setupOptions = [
        { value: 'onsite', label: 'Onsite' },
        { value: 'hybrid', label: 'Hybrid' },
        { value: 'remote', label: 'Remote' },
    ]

    const statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'closed', label: 'Closed' },
    ]

    const getDisplayJobs = () => {
        let displayJobs = [...jobs];

        // Apply search filter
        if (searchTerm) {
            displayJobs = displayJobs.filter(job => 
                job.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.salary?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply type filter
        if (typeFilter !== 'all') {
            displayJobs = displayJobs.filter(job => job.type === typeFilter);
        }
        
        // Apply setup filter
        if (typeSetup !== 'all') {
            displayJobs = displayJobs.filter(job => {
                const location = job.location?.toLowerCase() || '';
                if (typeSetup === 'onsite') {
                    return !location.includes('remote') && !location.includes('hybrid') && location !== '';
                }
                if (typeSetup === 'hybrid') {
                    return location.includes('hybrid');
                }
                if (typeSetup === 'remote') {
                    return location.includes('remote');
                }
                return true;
            });
        }

        if (statusFilter !== 'all') {
            displayJobs = displayJobs.filter(job => job.status === statusFilter);
        }

        // Apply new jobs filter
        if (showNewJob) {
            displayJobs = newJobs;
        }

        // Apply sorting
        displayJobs.sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (sortConfig.key === 'createdAt') {
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
        return displayJobs;
    };
 
    const filteredJobs = getDisplayJobs();

    // Pagination
    const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;    
    const currentItems = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);
       
    // Navigation
    const goToPage = (page) => {
        setCurrentPage(Math.min(Math.max(1, page), totalPages));
    }

    const goToFirstPage = () => goToPage(1);
    const goToLastPage = () => goToPage(totalPages);
    const goToNextPage = () => goToPage(currentPage + 1);
    const goToPreviousPage = () => goToPage(currentPage - 1);

    // Generate Page numbers to display
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

    if (loading) return <LoadingSpinner message='Loading jobs...' />;

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
                <div className="bg-white border border-orange-200 p-8 text-center">
                    <p className="text-6xl text-orange-200 mb-4">—</p>
                    <p className="text-gray-500 font-light mb-4">Error: {error}</p>
                    <button 
                        onClick={fetchJobs}
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
                <p className="text-sm font-light text-orange-400 mb-2 tracking-wider">JOBS</p>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-orange-900 font-light">MANAGE YOUR JOB LISTINGS</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FontAwesomeIcon icon={faBriefcase} />
                        <span>Total: {jobs.length}</span>
                    </div>
                </div>
            </header>

            <div className="mb-6 flex justify-end">
                <button
                    onClick={() => setShowAddJobModal(true)}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-600 text-sm font-light tracking-wider hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all duration-300"
                >
                    <FontAwesomeIcon icon={faPlus} className='text-xs'/>
                    <span>CREATE JOB</span>
                </button>
            </div>

            {/* Filter Bar */}
            <FilterBar 
                searchTerm={searchTerm}
                onSearchChange={handleSearch}
                searchPlaceholder="Search jobs..."
                
                // Type filter dropdown
                filterOptions={typeOptions}
                filterValue={typeFilter}
                onFilterChange={handleType}
                filterPlaceholder="Type of Job"

                // Filter Setup
                filterSetupOptions={setupOptions}
                filterSetupValue={typeSetup}
                onFilterSetupChange={handleSetup}
                filterSetupPlaceholder="Setup of Job"

                // Filter Status
                filterStatusOptions={statusOptions}
                filterStatusValue={statusFilter}
                onFilterStatusChange={handleStatus}
                filterStatusPlaceholder="Status of Job"
                
                // New Job filter
                showSpecialFilter={true}
                specialFilterLabel="NEW JOBS"
                specialFilterIcon={faFire}
                onSpecialFilterClick={identifyNewJobs}
                isSpecialFilterActive={showNewJob}
                
                // Results count and refresh
                resultsCount={filteredJobs.length}
                resultsLabel="JOBS"
                onRefresh={fetchJobs}
                onClearFilters={clearFilters}
            />

            {/* Job Grid */}
            <div>
                {currentItems.length === 0 ? (
                    <div className="bg-white border border-gray-200 p-16 text-center">
                        <FontAwesomeIcon icon={faBox} className="text-5xl text-gray-200 mb-4" />
                        <p className="text-gray-500 font-light mb-2">No jobs found</p>
                        <p className="text-sm text-gray-400 font-light">
                            {searchTerm ? 'Try a different search term' : 'Add a new job to get started'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentItems.map((job) => (
                            <JobCard
                                key={job._id}
                                job={job}
                                onView={() => {
                                    setSelectedJobId(job._id);
                                    setShowViewJobModal(true);
                                }}
                                onEdit={() => {
                                    setSelectedJob(job);
                                    setShowEditJobModal(true);
                                }}
                                onArchive={() => 
                                    handleArchive(job)
                                }
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
                        <button onClick={goToFirstPage} disabled={currentPage === 1} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">
                            <FontAwesomeIcon icon={faAngleDoubleLeft} className="text-xs" />
                        </button>
                        <button onClick={goToPreviousPage} disabled={currentPage === 1} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">
                            <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                        </button>

                        <div className="flex items-center gap-1">
                            {showStartPage && <span className="px-2 py-1.5 text-gray-400">...</span>}
                            {pageNumbers.map(page => (
                                <button key={page} onClick={() => goToPage(page)} className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors ${currentPage === page ? 'border-orange-500 bg-orange-500 text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                                    {page}
                                </button>
                            ))}
                            {showEndPage && <span className="px-2 py-1.5 text-gray-400">...</span>}
                        </div>

                        <button onClick={goToNextPage} disabled={currentPage === totalPages} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">
                            <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                        </button>
                        <button onClick={goToLastPage} disabled={currentPage === totalPages} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">
                            <FontAwesomeIcon icon={faAngleDoubleRight} className="text-xs" />
                        </button>
                    </div>
                </div>
            )}

            {/* Modals */}
            <AddJobModal 
                isOpen={showAddJobModal} 
                onClose={() => setShowAddJobModal(false)} 
                onSave={handleAddJob} 
            />

            <ViewJobModal 
                isOpen={showViewJobModal} 
                onClose={() => { setShowViewJobModal(false); 
                setSelectedJobId(null); }} 
                jobId={selectedJobId} 
                userType="admin" 
            />

            <EditJobModal 
                isOpen={showEditJobModal} 
                onClose={() => { setShowEditJobModal(false); 
                setSelectedJob(null); }} 
                onSave={handleEditSuccess} 
                job={selectedJob} 
            />
            
            <MoveToArchiveModal 
                isOpen={showArchiveModal} 
                onClose={() => { 
                    setShowArchiveModal(false); 
                    setSelectedJob(null); 
                }} 
                onConfirm={handleConfirmArchive} 
                job={selectedJob} 
                loading={false}
            />
        </div>
    );
}

export default NMJobs;