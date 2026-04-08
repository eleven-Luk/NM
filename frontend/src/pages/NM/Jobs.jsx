import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBriefcase,
    faMapMarkerAlt,
    faClock,
    faMoneyBillWave,
    faBuilding,
    faBookmark,
    faShare,
    faChevronLeft,
    faChevronRight,
    faAngleDoubleRight,
    faAngleDoubleLeft,
    faFire,
    faTimes,
    faCalendarAlt,
    faTag,
    faUsers,
    faChartLine,
    faGlobe,
    faLaptop,
    faHome,
    faCheckCircle,
    faBan,
    faArrowLeft
} from '@fortawesome/free-solid-svg-icons';

import NMContactModal from '../../components/modals/NMContactModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import FilterBar from '../../components/common/FilterBar';

import bgImg from '../../assets/NM.png';

function Jobs() {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [setupFilter, setSetupFilter] = useState('all');
    const [showNewJob, setShowNewJob] = useState(false);
    const [newJobs, setNewJobs] = useState([]);
    const [bookmarked, setBookmarked] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Pagination states - FIXED: Use state instead of constant
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6); // Changed from const to state

    // Filter options
    const typeOptions = [
        { value: 'Full-Time', label: 'Full-time' },
        { value: 'Part-Time', label: 'Part-time' },
        { value: 'Contract', label: 'Contract' },
        { value: 'Internship', label: 'Internship' },
    ];

    const setupOptions = [
        { value: 'onsite', label: 'Onsite' },
        { value: 'hybrid', label: 'Hybrid' },
        { value: 'remote', label: 'Remote' },
    ];

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/jobs/all', {
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : '',
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const result = await response.json();

                if (result.success) {
                    const activeJobs = (result.data || []).filter(job => 
                        job.status !== 'closed' && job.status !== 'archived'
                    );
                    const sortedJobs = activeJobs.sort((a, b) => 
                        new Date(b.createdAt) - new Date(a.createdAt)
                    );
                    setJobs(sortedJobs);
                } else {
                    throw new Error(result.message || 'Failed to fetch jobs');
                }
                
            } catch (error) {
                console.error('Error fetching jobs:', error);
                setError('Failed to load job listings. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchJobs();
    }, []);

    // Responsive items per page based on screen size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                // Mobile
                setItemsPerPage(4);
            } else if (window.innerWidth < 1024) {
                // Tablet
                setItemsPerPage(6);
            } else {
                // Desktop
                setItemsPerPage(9);
            }
        };
        
        handleResize(); // Call initially
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Get status badge styling
    const getStatusBadge = (status) => {
        const statusConfig = {
            active: {
                color: 'bg-green-100 text-green-800',
                icon: faCheckCircle,
                label: 'Active'
            },
            inactive: {
                color: 'bg-yellow-100 text-yellow-800',
                icon: faClock,
                label: 'Inactive'
            },
            closed: {
                color: 'bg-red-100 text-red-800',
                icon: faBan,
                label: 'Closed'
            },
            archived: {
                color: 'bg-gray-100 text-gray-800',
                icon: faBan,
                label: 'Archived'
            }
        };
        return statusConfig[status?.toLowerCase()] || statusConfig.active;
    };

    // Format date function
    const formatPostedDate = (dateString) => {
        if (!dateString) return 'Recently';
        const now = new Date();
        const posted = new Date(dateString);
        const diffDays = Math.floor((now - posted) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return posted.toLocaleDateString();
    };

    // Format job type for display
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
        return typeMap[type] || type || 'Full-Time';
    };

    // Get work setup icon
    const getSetupIcon = (location) => {
        const loc = location?.toLowerCase() || '';
        if (loc.includes('remote')) return faLaptop;
        if (loc.includes('hybrid')) return faGlobe;
        return faBuilding;
    };

    // Get work setup label
    const getSetupLabel = (location) => {
        const loc = location?.toLowerCase() || '';
        if (loc.includes('remote')) return 'Remote';
        if (loc.includes('hybrid')) return 'Hybrid';
        return 'Onsite';
    };

    // Handle apply button click
    const handleApplyClick = (job) => {
        if (job.status !== 'active') {
            alert('This job is currently inactive and not accepting applications.');
            return;
        }
        
        if (!job || !job._id) {
            console.error('Invalid job selection:', job);
            alert('Invalid job selection. Please try again.');
            return;
        }
        
        console.log('Applying for job:', job.name);
        setSelectedJob(job);
        setIsJobModalOpen(true);
    };

    // Toggle bookmark
    const toggleBookmark = (jobId) => {
        setBookmarked(prev => 
            prev.includes(jobId) 
                ? prev.filter(id => id !== jobId)
                : [...prev, jobId]
        );
    };

    // Filter handlers
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
        if (showNewJob) {
            setShowNewJob(false);
            setNewJobs([]);
        }
    };

    const handleType = (e) => {
        setTypeFilter(e.target.value);
        setCurrentPage(1);
        if (showNewJob) {
            setShowNewJob(false);
            setNewJobs([]);
        }
    };

    const handleSetup = (e) => {
        setSetupFilter(e.target.value);
        setCurrentPage(1);
        if (showNewJob) {
            setShowNewJob(false);
            setNewJobs([]);
        }
    };

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
        setSetupFilter('all');
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setTypeFilter('all');
        setSetupFilter('all');
        setShowNewJob(false);
        setNewJobs([]);
        setCurrentPage(1);
    };

    // Filter jobs
    const getDisplayJobs = () => {
        let displayJobs = [...jobs];

        if (searchTerm) {
            displayJobs = displayJobs.filter(job => 
                job.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.salary?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (typeFilter !== 'all') {
            displayJobs = displayJobs.filter(job => job.type === typeFilter);
        }
        
        if (setupFilter !== 'all') {
            displayJobs = displayJobs.filter(job => {
                const location = job.location?.toLowerCase() || '';
                if (setupFilter === 'onsite') {
                    return !location.includes('remote') && !location.includes('hybrid') && location !== '';
                }
                if (setupFilter === 'hybrid') {
                    return location.includes('hybrid');
                }
                if (setupFilter === 'remote') {
                    return location.includes('remote');
                }
                return true;
            });
        }

        if (showNewJob) {
            displayJobs = newJobs;
        }

        return displayJobs;
    };

    const filteredJobs = getDisplayJobs();
    const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;    
    const currentItems = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);

    // Navigation functions
    const goToPage = (page) => {
        setCurrentPage(Math.min(Math.max(1, page), totalPages));
    }

    const goToFirstPage = () => setCurrentPage(1);
    const goToLastPage = () => setCurrentPage(totalPages);
    const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const goToPreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

    // Generate Page numbers
    const getPageNumbers = () => {
        const maxButtons = window.innerWidth < 640 ? 3 : 5;
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

    // Featured jobs (first 3 active jobs)
    const featuredJobs = jobs.slice(0, 3);

    // Go back to homepage
    const goToHomepage = () => {
        window.location.href = '/main';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-white">
                <LoadingSpinner message="Loading job opportunities..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-white px-4">
                <div className="text-center p-6 sm:p-8 max-w-md">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FontAwesomeIcon icon={faTimes} className="text-red-500 text-xl sm:text-2xl" />
                    </div>
                    <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-4 sm:px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm sm:text-base"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gradient-to-b from-orange-50 to-white pt-8'>
            {/* Back to Homepage Button */}
            <div className='fixed top-4 left-4 z-20 sm:top-6 sm:left-6'>
                <button
                    onClick={goToHomepage}
                    className='flex items-center  gap-2 bg-white/90 hover:bg-white backdrop-blur-sm text-gray-700 px-3 py-2 rounded-lg shadow-md transition-all duration-300 border border-gray-200 text-sm sm:text-base'
                >
                    <FontAwesomeIcon icon={faArrowLeft} className='w-3 h-3 sm:w-4 sm:h-4' />
                    <span className='hidden sm:inline'>Back to Home</span>
                    <span className='sm:hidden'>Home</span>
                </button>
            </div>

            {/* Header Section - Responsive */}
            <div className='bg-gradient-to-b from-orange-50 to-orange-100 border-b border-orange-200'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12'>
                    <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4'>
                        <div className='flex items-center gap-3'>
                            <img 
                                src={bgImg} 
                                alt="N&M Staffing Logo"   
                                className='w-14 h-14 sm:w-20 sm:h-20 rounded-xl shadow-md border-2 border-orange-300 object-cover'
                            />
                            <div className='w-10 h-10 sm:w-12 sm:h-12 bg-orange-200 rounded-full flex items-center justify-center'>
                                <FontAwesomeIcon icon={faBriefcase} className='text-orange-600 text-lg sm:text-xl' />
                            </div>
                        </div>
                        <h1 className='text-2xl sm:text-3xl font-light text-orange-800'>Job Opportunities</h1>
                    </div>
                    <div className='w-16 sm:w-20 h-0.5 bg-orange-400 mb-4 sm:mb-6'></div>
                    
                    <div className='bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-orange-100'>
                        <p className='text-orange-500 text-xs uppercase tracking-widest mb-2 sm:mb-3 font-light flex items-center gap-2'>
                            <span className='w-1 h-4 bg-orange-400'></span>
                            BILINGUAL | MULTILINGUAL | PROFESSIONAL OPPORTUNITIES
                        </p>
                        <p className='text-orange-700 leading-relaxed text-sm sm:text-base'>
                            We connect bilingual and multilingual professionals with premier career opportunities across the Philippines. 
                            Browse through our current job openings and find your next career move.
                        </p>
                    </div>
                </div>
            </div>

            {/* Featured Jobs Section - Responsive Grid */}
            {featuredJobs.length > 0 && (
                <div className='max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12'>
                    <div className="flex items-center gap-2 mb-4 sm:mb-6">
                        <FontAwesomeIcon icon={faFire} className="text-orange-500 text-sm sm:text-base" />
                        <h2 className='text-xl sm:text-2xl font-light text-orange-800'>Featured Opportunities</h2>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
                        {featuredJobs.map(job => {
                            const statusConfig = getStatusBadge(job.status);
                            const isActive = job.status === 'active';
                            return (
                                <div 
                                    key={job._id}
                                    className='relative group cursor-pointer overflow-hidden rounded-xl shadow-lg bg-white border border-orange-100 hover:shadow-xl transition-all hover:border-orange-300'
                                    onClick={() => setSelectedJob(job)}
                                >
                                    <div className='p-4 sm:p-6'>
                                        <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4'>
                                            <div className='flex-1'>
                                                <h3 className='font-semibold text-orange-800 text-base sm:text-lg mb-2 line-clamp-1'>{job.name}</h3>
                                                <div className='flex flex-wrap gap-2'>
                                                    <span className='inline-flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full'>
                                                        <FontAwesomeIcon icon={faTag} className='text-xs' />
                                                        {formatJobType(job.type)}
                                                    </span>
                                                    <span className='inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full'>
                                                        <FontAwesomeIcon icon={getSetupIcon(job.location)} className='text-xs' />
                                                        {getSetupLabel(job.location)}
                                                    </span>
                                                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${statusConfig.color}`}>
                                                        <FontAwesomeIcon icon={statusConfig.icon} className='text-xs' />
                                                        {statusConfig.label}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className='bg-orange-500 text-white text-xs px-2 sm:px-3 py-1 rounded-full self-start'>
                                                Featured
                                            </span>
                                        </div>
                                        
                                        <div className='space-y-2 sm:space-y-3 mb-4'>
                                            <p className='text-xs sm:text-sm text-gray-600 flex items-center gap-2'>
                                                <FontAwesomeIcon icon={faMapMarkerAlt} className='text-orange-400 w-3 sm:w-4' />
                                                <span className="truncate">{job.location || 'Remote'}</span>
                                            </p>
                                            <p className='text-xs sm:text-sm text-gray-600 flex items-center gap-2'>
                                                <FontAwesomeIcon icon={faMoneyBillWave} className='text-orange-400 w-3 sm:w-4' />
                                                {job.salary || 'Negotiable'}
                                            </p>
                                            <p className='text-xs sm:text-sm text-gray-600 flex items-center gap-2'>
                                                <FontAwesomeIcon icon={faCalendarAlt} className='text-orange-400 w-3 sm:w-4' />
                                                Posted {formatPostedDate(job.createdAt)}
                                            </p>
                                        </div>
                                        
                                        <div className='flex items-center justify-between pt-3 border-t border-orange-100'>
                                            {isActive ? (
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleApplyClick(job);
                                                    }} 
                                                    className='text-xs sm:text-sm text-orange-500 hover:text-orange-600 hover:underline transition-all'
                                                >
                                                    Apply now
                                                </button>
                                            ) : (
                                                <span className='text-xs sm:text-sm text-gray-400 cursor-not-allowed'>
                                                    Not accepting
                                                </span>
                                            )}
                                            <span className='text-orange-600 font-medium text-xs sm:text-sm group-hover:translate-x-1 transition-transform'>
                                                View Details →
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Main Jobs Section */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12'>
                {/* Filter Bar - Responsive */}
                <div className="mb-6">
                    <FilterBar 
                        searchTerm={searchTerm}
                        onSearchChange={handleSearch}
                        searchPlaceholder="Search jobs..."
                        
                        filterOptions={typeOptions}
                        filterValue={typeFilter}
                        onFilterChange={handleType}
                        filterPlaceholder="Job Type"

                        filterSetupOptions={setupOptions}
                        filterSetupValue={setupFilter}
                        onFilterSetupChange={handleSetup}
                        filterSetupPlaceholder="Work Setup"
                        
                        showSpecialFilter={true}
                        specialFilterLabel="NEW JOBS"
                        specialFilterIcon={faFire}
                        onSpecialFilterClick={identifyNewJobs}
                        isSpecialFilterActive={showNewJob}
                        
                        resultsCount={filteredJobs.length}
                        resultsLabel="JOBS"
                        onRefresh={() => window.location.reload()}
                        onClearFilters={clearFilters}
                        theme="nm"
                    />
                </div>

                {/* Jobs Grid - Responsive */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
                    {currentItems.map(job => {
                        const statusConfig = getStatusBadge(job.status);
                        const isActive = job.status === 'active';
                        return (
                            <div 
                                key={job._id}
                                className='group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer border border-orange-100 hover:border-orange-300'
                                onClick={() => setSelectedJob(job)}
                            >
                                <div className='p-4 sm:p-5'>
                                    <div className='mb-3 sm:mb-4'>
                                        <h3 className='font-semibold text-orange-800 text-base sm:text-lg mb-2 line-clamp-1'>{job.name}</h3>
                                        <div className='flex flex-wrap gap-1.5 sm:gap-2'>
                                            <span className='inline-flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-1.5 sm:px-2 py-1 rounded-full'>
                                                <FontAwesomeIcon icon={faTag} className='text-xs' />
                                                {formatJobType(job.type)}
                                            </span>
                                            <span className='inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-1.5 sm:px-2 py-1 rounded-full'>
                                                <FontAwesomeIcon icon={getSetupIcon(job.location)} className='text-xs' />
                                                {getSetupLabel(job.location)}
                                            </span>
                                            <span className={`inline-flex items-center gap-1 text-xs px-1.5 sm:px-2 py-1 rounded-full ${statusConfig.color}`}>
                                                <FontAwesomeIcon icon={statusConfig.icon} className='text-xs' />
                                                {statusConfig.label}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className='space-y-2 mb-3 sm:mb-4'>
                                        <div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600'>
                                            <FontAwesomeIcon icon={faMapMarkerAlt} className='text-orange-400 w-3 sm:w-4' />
                                            <span className='truncate'>{job.location || 'Remote'}</span>
                                        </div>
                                        <div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600'>
                                            <FontAwesomeIcon icon={faMoneyBillWave} className='text-orange-400 w-3 sm:w-4' />
                                            <span className="truncate">{job.salary || 'Negotiable'}</span>
                                        </div>
                                        <div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600'>
                                            <FontAwesomeIcon icon={faCalendarAlt} className='text-orange-400 w-3 sm:w-4' />
                                            <span>Posted {formatPostedDate(job.createdAt)}</span>
                                        </div>
                                    </div>
                                    
                                    <div className='flex items-center justify-between pt-3 border-t border-orange-100'>
                                        {isActive ? (
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleApplyClick(job);
                                                }} 
                                                className='text-xs sm:text-sm text-orange-500 hover:text-orange-600 hover:underline transition-all'
                                            >
                                                Apply now
                                            </button>
                                        ) : (
                                            <span className='text-xs sm:text-sm text-gray-400 cursor-not-allowed'>
                                                Closed
                                            </span>
                                        )}
                                        <span className='text-orange-600 font-medium text-xs sm:text-sm group-hover:translate-x-1 transition-transform flex items-center gap-1'>
                                            Details <FontAwesomeIcon icon={faChevronRight} className='text-xs' />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State - Responsive */}
                {filteredJobs.length === 0 && (
                    <div className='text-center py-12 sm:py-16'>
                        <div className='w-16 h-16 sm:w-20 sm:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <FontAwesomeIcon icon={faBriefcase} className='text-orange-400 text-xl sm:text-2xl' />
                        </div>
                        <h3 className='text-base sm:text-lg font-medium text-orange-800 mb-2'>No jobs found</h3>
                        <p className='text-sm sm:text-base text-orange-500'>Try adjusting your search or filter criteria</p>
                        <button
                            onClick={clearFilters}
                            className='mt-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-xs sm:text-sm'
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}

                {/* Pagination Controls - Responsive */}
                {totalPages > 1 && filteredJobs.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
                        <div className="text-xs sm:text-sm text-gray-500">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredJobs.length)} of {filteredJobs.length} jobs
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2">
                            <button 
                                onClick={goToFirstPage} 
                                disabled={currentPage === 1} 
                                className="px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FontAwesomeIcon icon={faAngleDoubleLeft} className="text-xs" />
                            </button>
                            <button 
                                onClick={goToPreviousPage} 
                                disabled={currentPage === 1} 
                                className="px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                            </button>

                            <div className="flex items-center gap-1">
                                {showStartPage && <span className="px-1 sm:px-2 py-1 text-gray-400 text-xs sm:text-sm">...</span>}
                                {pageNumbers.map(page => (
                                    <button 
                                        key={page} 
                                        onClick={() => goToPage(page)} 
                                        className={`px-2 sm:px-3 py-1 sm:py-1.5 border rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                                            currentPage === page 
                                                ? 'border-orange-500 bg-orange-500 text-white' 
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                {showEndPage && <span className="px-1 sm:px-2 py-1 text-gray-400 text-xs sm:text-sm">...</span>}
                            </div>

                            <button 
                                onClick={goToNextPage} 
                                disabled={currentPage === totalPages} 
                                className="px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                            </button>
                            <button 
                                onClick={goToLastPage} 
                                disabled={currentPage === totalPages} 
                                className="px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FontAwesomeIcon icon={faAngleDoubleRight} className="text-xs" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Apply Modal */}
            <NMContactModal 
                isOpen={isJobModalOpen}
                onClose={() => {
                    setIsJobModalOpen(false);
                    setSelectedJob(null);
                }}
                job={selectedJob}
            />

            {/* Job Details Modal - Responsive */}
            {selectedJob && !isJobModalOpen && (
                <div 
                    className='fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4'
                    onClick={() => setSelectedJob(null)}
                >
                    <button
                        onClick={() => setSelectedJob(null)}
                        className='absolute top-3 right-3 sm:top-4 sm:right-4 text-white hover:text-orange-300 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 rounded-full flex items-center justify-center'
                    >
                        <FontAwesomeIcon icon={faTimes} className='text-base sm:text-xl' />
                    </button>
                    
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            const currentIndex = filteredJobs.findIndex(j => j._id === selectedJob._id);
                            if (currentIndex > 0) {
                                setSelectedJob(filteredJobs[currentIndex - 1]);
                            }
                        }}
                        className='absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white hover:text-orange-300 disabled:opacity-50 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 rounded-full flex items-center justify-center'
                        disabled={filteredJobs.findIndex(j => j._id === selectedJob._id) === 0}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} className="text-sm sm:text-base" />
                    </button>
                    
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            const currentIndex = filteredJobs.findIndex(j => j._id === selectedJob._id);
                            if (currentIndex < filteredJobs.length - 1) {
                                setSelectedJob(filteredJobs[currentIndex + 1]);
                            }
                        }}
                        className='absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:text-orange-300 disabled:opacity-50 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 rounded-full flex items-center justify-center'
                        disabled={filteredJobs.findIndex(j => j._id === selectedJob._id) === filteredJobs.length - 1}
                    >
                        <FontAwesomeIcon icon={faChevronRight} className="text-sm sm:text-base" />
                    </button>

                    <div 
                        className='relative max-w-3xl w-full max-h-[85vh] sm:max-h-[90vh] overflow-y-auto bg-white rounded-xl'
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Job Header */}
                        <div className='bg-gradient-to-r from-orange-500 to-orange-600 p-4 sm:p-6 text-white'>
                            <h2 className='text-lg sm:text-2xl font-bold mb-2'>{selectedJob.name}</h2>
                            <div className='flex flex-wrap gap-2 mt-2'>
                                <span className='inline-flex items-center gap-1 text-xs bg-white/20 px-2 sm:px-3 py-1 rounded-full'>
                                    <FontAwesomeIcon icon={faTag} className='text-xs' />
                                    {formatJobType(selectedJob.type)}
                                </span>
                                <span className='inline-flex items-center gap-1 text-xs bg-white/20 px-2 sm:px-3 py-1 rounded-full'>
                                    <FontAwesomeIcon icon={getSetupIcon(selectedJob.location)} className='text-xs' />
                                    {getSetupLabel(selectedJob.location)}
                                </span>
                                <span className='inline-flex items-center gap-1 text-xs bg-white/20 px-2 sm:px-3 py-1 rounded-full'>
                                    <FontAwesomeIcon icon={getStatusBadge(selectedJob.status).icon} className='text-xs' />
                                    {getStatusBadge(selectedJob.status).label}
                                </span>
                            </div>
                        </div>

                        {/* Job Details */}
                        <div className='p-4 sm:p-6'>
                            {/* Quick Info Grid - Responsive */}
                            <div className='grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6'>
                                <div className='bg-orange-50 p-2 sm:p-3 rounded-lg'>
                                    <p className='text-xs text-orange-400 mb-1'>Location</p>
                                    <p className='text-xs sm:text-sm font-medium text-orange-800 truncate'>{selectedJob.location || 'Remote'}</p>
                                </div>
                                <div className='bg-orange-50 p-2 sm:p-3 rounded-lg'>
                                    <p className='text-xs text-orange-400 mb-1'>Job Type</p>
                                    <p className='text-xs sm:text-sm font-medium text-orange-800'>{formatJobType(selectedJob.type)}</p>
                                </div>
                                <div className='bg-orange-50 p-2 sm:p-3 rounded-lg'>
                                    <p className='text-xs text-orange-400 mb-1'>Salary</p>
                                    <p className='text-xs sm:text-sm font-medium text-orange-800'>{selectedJob.salary || 'Negotiable'}</p>
                                </div>
                                <div className='bg-orange-50 p-2 sm:p-3 rounded-lg'>
                                    <p className='text-xs text-orange-400 mb-1'>Posted</p>
                                    <p className='text-xs sm:text-sm font-medium text-orange-800'>{formatPostedDate(selectedJob.createdAt)}</p>
                                </div>
                                <div className='bg-orange-50 p-2 sm:p-3 rounded-lg'>
                                    <p className='text-xs text-orange-400 mb-1'>Work Setup</p>
                                    <p className='text-xs sm:text-sm font-medium text-orange-800'>{getSetupLabel(selectedJob.location)}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className='mb-6'>
                                <h3 className='text-base sm:text-lg font-medium text-orange-800 mb-3'>Job Description</h3>
                                <div className='bg-gray-50 p-3 sm:p-4 rounded-lg'>
                                    <p className='text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap'>
                                        {selectedJob.description || 'No description available'}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex items-center gap-3 pt-4 border-t border-orange-100'>
                                {selectedJob.status === 'active' ? (
                                    <button 
                                        onClick={() => handleApplyClick(selectedJob)}
                                        className='flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base'
                                    >
                                        Apply Now
                                    </button>
                                ) : (
                                    <div className='flex-1 text-center py-2 sm:py-3 bg-gray-100 text-gray-500 rounded-lg text-sm sm:text-base'>
                                        This job is currently not accepting applications
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Jobs;