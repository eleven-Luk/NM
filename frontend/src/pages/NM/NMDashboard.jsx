import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBriefcase,
    faUserGraduate,
    faComments,
    faArrowRight,
    faCalendarDay,
    faCalendarWeek,
    faCheckCircle,
    faClock,
    faExclamationTriangle,
    faFire,
    faUserPlus,
    faMessage,
    faChartLine,
    faEye,
    faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from "../../components/common/LoadingSpinner";

import api from '../services/api.js';

const NMDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        jobs: [],
        applicants: [],
        concerns: []
    });
    const [stats, setStats] = useState({
        totalJobs: 0,
        totalApplicants: 0,
        totalConcerns: 0,
        todayApplicants: 0,
        weekApplicants: 0,
        todayConcerns: 0,
        weekConcerns: 0,
        activeJobs: 0
    });
    const [timeRange, setTimeRange] = useState('week');
    const navigate = useNavigate();

    const goToHomepage = () => {
        navigate('/main');
    };

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please login first');
                navigate('/login');
                return;
            }

            const jobsResponse = await api.get('/jobs/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const jobsResult = await jobsResponse.json();
            
            const applicantsResponse = await api.get('/applications/getAll', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const applicantsResult = await applicantsResponse.json();
            
            const concernsResponse = await api.get('/concerns/business/nm', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const concernsResult = await concernsResponse.json();

            if (jobsResult.success && applicantsResult.success && concernsResult.success) {
                const jobs = jobsResult.data || [];
                const applicants = applicantsResult.data || [];
                const concerns = concernsResult.data || [];
                
                setDashboardData({ jobs, applicants, concerns });
                
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const weekAgo = new Date(today);
                weekAgo.setDate(weekAgo.getDate() - 7);
                
                const todayApplicants = applicants.filter(app => new Date(app.createdAt) >= today).length;
                const weekApplicants = applicants.filter(app => new Date(app.createdAt) >= weekAgo).length;
                const todayConcerns = concerns.filter(concern => new Date(concern.createdAt) >= today).length;
                const weekConcerns = concerns.filter(concern => new Date(concern.createdAt) >= weekAgo).length;
                const activeJobs = jobs.filter(job => job.status !== 'closed' && job.status !== 'archived').length;
                
                setStats({
                    totalJobs: jobs.length,
                    totalApplicants: applicants.length,
                    totalConcerns: concerns.length,
                    todayApplicants,
                    weekApplicants,
                    todayConcerns,
                    weekConcerns,
                    activeJobs
                });
            } else {
                throw new Error('Failed to fetch dashboard data');
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError(error.message || 'Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const getRecentItems = (items, count = 5) => {
        return [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, count);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const diffDays = Math.floor((today - targetDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            reviewed: 'bg-blue-100 text-blue-800',
            interviewed: 'bg-purple-100 text-purple-800',
            hired: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            resolved: 'bg-green-100 text-green-800',
            'Full-Time': 'bg-blue-100 text-blue-800',
            'Part-Time': 'bg-purple-100 text-purple-800',
            Contract: 'bg-orange-100 text-orange-800',
            Internship: 'bg-pink-100 text-pink-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const RecentItemCard = ({ item, type, onClick }) => {
        const getIcon = () => {
            if (type === 'applicant') return faUserGraduate;
            if (type === 'concern') return faComments;
            return faBriefcase;
        };
        
        const getTitle = () => {
            if (type === 'applicant') return `${item.firstName} ${item.lastName}`;
            if (type === 'concern') return item.name;
            return item.name;
        };
        
        const getSubtitle = () => {
            if (type === 'applicant') return item.jobId?.name || 'Position not specified';
            if (type === 'concern') return item.inquiryType || 'General Inquiry';
            return item.type || item.location || 'Job';
        };
        
        const getStatus = () => {
            if (type === 'applicant') return item.status;
            if (type === 'concern') return item.status;
            return null;
        };
        
        return (
            <div 
                onClick={onClick}
                className="p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors last:border-b-0"
            >
                <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <FontAwesomeIcon icon={getIcon()} className="text-orange-600 text-sm sm:text-base" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{getTitle()}</p>
                        <p className="text-xs text-gray-500 mt-1 truncate">{getSubtitle()}</p>
                        {getStatus() && (
                            <span className={`inline-block mt-1 sm:mt-2 px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(getStatus())}`}>
                                {getStatus().toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div className="text-xs text-gray-400 flex-shrink-0">
                        {formatDate(item.createdAt)}
                    </div>
                </div>
            </div>
        );
    };

    const getDisplayCount = () => {
        if (timeRange === 'day') {
            return { applicants: stats.todayApplicants, concerns: stats.todayConcerns };
        }
        return { applicants: stats.weekApplicants, concerns: stats.weekConcerns };
    };

    const displayCount = getDisplayCount();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner message="Loading dashboard..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 sm:p-8 text-center">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-3xl sm:text-4xl mb-4" />
                    <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>
                    <button 
                        onClick={fetchDashboardData}
                        className="px-4 sm:px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const recentApplicants = getRecentItems(dashboardData.applicants, 5);
    const recentConcerns = getRecentItems(dashboardData.concerns, 5);

    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
            {/* Header */}
            <header className="mb-6 sm:mb-8">
                <p className="text-xs sm:text-sm font-light text-orange-400 mb-1 sm:mb-2 tracking-wider">DASHBOARD</p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-500 text-xs sm:text-sm mt-1">Overview of your platform activity</p>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 self-start sm:self-auto">
                        <button
                            onClick={() => setTimeRange('day')}
                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                                timeRange === 'day' 
                                    ? 'bg-white text-orange-600 shadow-sm' 
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <FontAwesomeIcon icon={faCalendarDay} className="mr-1 sm:mr-2 text-xs sm:text-sm" />
                            Today
                        </button>
                        <button
                            onClick={() => setTimeRange('week')}
                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                                timeRange === 'week' 
                                    ? 'bg-white text-orange-600 shadow-sm' 
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <FontAwesomeIcon icon={faCalendarWeek} className="mr-1 sm:mr-2 text-xs sm:text-sm" />
                            This Week
                        </button>
                    </div>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
                {/* Active Jobs Card */}
                <div 
                    onClick={() => navigate('/nm/jobs')}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-5 md:p-6 border border-blue-200 cursor-pointer hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FontAwesomeIcon icon={faBriefcase} className="text-blue-600 text-base sm:text-xl" />
                        </div>
                        <span className="text-xl sm:text-2xl font-bold text-blue-600">{stats.activeJobs}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">Active Jobs</p>
                    <div className="mt-2 sm:mt-3 flex items-center gap-1 sm:gap-2 text-xs">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 text-xs" />
                        <span className="text-gray-500">Out of {stats.totalJobs} total jobs</span>
                    </div>
                    <div className="mt-2">
                        <span className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                            View All Jobs <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                        </span>
                    </div>
                </div>

                {/* Total Jobs Card */}
                <div 
                    onClick={() => navigate('/nm/jobs')}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 sm:p-5 md:p-6 border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FontAwesomeIcon icon={faBriefcase} className="text-gray-600 text-base sm:text-xl" />
                        </div>
                        <span className="text-xl sm:text-2xl font-bold text-gray-600">{stats.totalJobs}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">Total Jobs</p>
                    <div className="mt-2 sm:mt-3 flex items-center gap-1 sm:gap-2 text-xs">
                        <FontAwesomeIcon icon={faChartLine} className="text-gray-500 text-xs" />
                        <span className="text-gray-500">All job listings</span>
                    </div>
                    <div className="mt-2">
                        <span className="text-xs text-gray-600 hover:text-gray-700 font-medium flex items-center gap-1">
                            View All Jobs <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                        </span>
                    </div>
                </div>

                {/* New Applicants Card */}
                <div 
                    onClick={() => navigate('/nm/applicants')}
                    className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 sm:p-5 md:p-6 border border-orange-200 cursor-pointer hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <FontAwesomeIcon icon={faUserGraduate} className="text-orange-600 text-base sm:text-xl" />
                        </div>
                        <span className="text-xl sm:text-2xl font-bold text-orange-600">{displayCount.applicants}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">New Applicants ({timeRange === 'day' ? 'Today' : 'This Week'})</p>
                    <div className="mt-2 sm:mt-3 flex items-center gap-1 sm:gap-2 text-xs">
                        <FontAwesomeIcon icon={faFire} className="text-orange-500 text-xs" />
                        <span className="text-gray-500">{displayCount.applicants} new {timeRange === 'day' ? 'today' : 'this week'}</span>
                    </div>
                    <div className="mt-2">
                        <span className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
                            View All Applicants <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                        </span>
                    </div>
                </div>

                {/* New Concerns Card */}
                <div 
                    onClick={() => navigate('/nm/concerns')}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-5 md:p-6 border border-green-200 cursor-pointer hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <FontAwesomeIcon icon={faComments} className="text-green-600 text-base sm:text-xl" />
                        </div>
                        <span className="text-xl sm:text-2xl font-bold text-green-600">{displayCount.concerns}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">New Concerns ({timeRange === 'day' ? 'Today' : 'This Week'})</p>
                    <div className="mt-2 sm:mt-3 flex items-center gap-1 sm:gap-2 text-xs">
                        <FontAwesomeIcon icon={faFire} className="text-green-500 text-xs" />
                        <span className="text-gray-500">{displayCount.concerns} new {timeRange === 'day' ? 'today' : 'this week'}</span>
                    </div>
                    <div className="mt-2">
                        <span className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
                            View All Concerns <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                        </span>
                    </div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Recent Applicants */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-4 sm:p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faUserGraduate} className="text-orange-500 text-sm sm:text-base" />
                                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Recent Applicants</h3>
                            </div>
                            <button 
                                onClick={() => navigate('/nm/applicants')}
                                className="text-xs sm:text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1"
                            >
                                View All <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Latest 5 applications</p>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {recentApplicants.length > 0 ? (
                            recentApplicants.map(applicant => (
                                <RecentItemCard 
                                    key={applicant._id}
                                    item={applicant}
                                    type="applicant"
                                    onClick={() => navigate('/nm/applicants')}
                                />
                            ))
                        ) : (
                            <div className="p-8 text-center">
                                <FontAwesomeIcon icon={faUserGraduate} className="text-gray-300 text-3xl sm:text-4xl mb-3" />
                                <p className="text-gray-500 text-sm">No applicants yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Concerns */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-4 sm:p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faComments} className="text-orange-500 text-sm sm:text-base" />
                                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Recent Concerns</h3>
                            </div>
                            <button 
                                onClick={() => navigate('/nm/concerns')}
                                className="text-xs sm:text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1"
                            >
                                View All <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Latest 5 concerns</p>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {recentConcerns.length > 0 ? (
                            recentConcerns.map(concern => (
                                <RecentItemCard 
                                    key={concern._id}
                                    item={concern}
                                    type="concern"
                                    onClick={() => navigate('/nm/concerns')}
                                />
                            ))
                        ) : (
                            <div className="p-8 text-center">
                                <FontAwesomeIcon icon={faComments} className="text-gray-300 text-3xl sm:text-4xl mb-3" />
                                <p className="text-gray-500 text-sm">No concerns submitted yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NMDashboard;