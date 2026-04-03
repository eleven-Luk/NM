import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCheckCircle, 
    faCamera, 
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
import AppointmentTable from "../../components/tables/AppointmentTable";

import ViewModalApp from "../../components/modals/Maple/appointments/ViewModal.jsx";
import DeleteModal from "../../components/modals/Maple/appointments/DeleteModal.jsx";
import EditModal from "../../components/modals/Maple/appointments/EditModal.jsx";


function MAppointments() {
    // State declarations
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [packageTypeFilter, setPackageTypeFilter] = useState('all');
    const [showNewAppointments, setShowNewAppointments] = useState(false);
    const [newAppointments, setNewAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Sorting States
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

    // Modal States
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const navigate = useNavigate();

    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'rescheduled', label: 'Rescheduled' },
    ];

    const typeOptions = [
        { value: 'newborn', label: 'Newborn' },
        { value: 'maternity', label: 'Maternity' },
        { value: 'family', label: 'Family' },
        { value: 'milestone', label: 'Milestone' },
        { value: 'portrait', label: 'Portrait' },
        { value: 'custom', label: 'Custom' },
    ];

    const fetchAppointments = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/appointments/get', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error(`Failed to fetch appointments: ${response.status}`);

            const result = await response.json();

            if (result.success) {
                const sortedAppointments = (result.data || []).sort((a, b) => 
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                setAppointments(sortedAppointments);
                setSuccessMessage('Appointments fetched successfully');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                throw new Error(result.message || 'Failed to fetch appointments');
            }

        } catch (error) {
            console.error('Error fetching appointments:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    // Update appointment status
    const handleUpdateAppointment = async (appointmentId, status, notes) => {
        try {
            setUpdatingId(appointmentId);
            const token = localStorage.getItem('token');

            if (!token) {
                setError('Please login to update appointment status');
                navigate('/login');
                return;
            }

            const response = await fetch(`http://localhost:5000/api/appointments/update/${appointmentId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status, notes })
            });

            const result = await response.json();

            if (result.success) {
                setAppointments(prev => prev.map(app =>
                    app._id === appointmentId ? { ...app, status, notes } : app
                ));

                setSuccessMessage(`Appointment updated successfully to ${status}`);
                setTimeout(() => setSuccessMessage(''), 3000);
                return result;
            } else {
                throw new Error(result.message || 'Failed to update appointment status');
            }

        } catch (error) {
            console.error('Error updating appointment status:', error);
            setError(error.message || 'Failed to update appointment status');
            throw error;
        } finally {
            setUpdatingId(null);
        }
    };

    // Modal handlers
    const handleEditClick = (appointment) => {
        setSelectedAppointment(appointment);
        setShowEditModal(true);
    };

    const handleSaveEdit = async (data) => {
        await handleUpdateAppointment(selectedAppointment._id, data.status, data.notes);
        setShowEditModal(false);
    };

    const handleViewAppointment = async (appointment) => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('Please login first');
                navigate('/login');
                return;
            }
            
            const response = await fetch(`http://localhost:5000/api/appointments/view/${appointment._id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (result.success) {
                setSelectedAppointment(result.data);
                setShowViewModal(true);
            } else {
                setError(result.message || 'Failed to fetch appointment details');
            }

        } catch (error) {
            console.error('Error fetching appointment details:', error);
            setError('Failed to fetch appointment details');
        }
    };

    const handleViewClick = (appointment) => {
        handleViewAppointment(appointment);
    };

    const handleDeleteAppointment = async (appointmentId) => {
        try {
            setDeleteLoading(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError('Please login first');
                navigate('/login');
                return;
            }

            const response = await fetch(`http://localhost:5000/api/appointments/delete/${appointmentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }); 
            
            const result = await response.json();

            if (result.success) {
                setAppointments(prev => prev.filter(app => app._id !== appointmentId));
                
                setSuccessMessage('Appointment deleted successfully');
                setTimeout(() => setSuccessMessage(''), 3000);
               
                setShowDeleteModal(false);
                setSelectedAppointment(null);

                const remainingCount = appointments.length - 1;
                const newTotalPages = Math.ceil(remainingCount / itemsPerPage);
                if (currentPage > newTotalPages && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }
            } else {
                throw new Error(result.message || 'Failed to delete appointment');
            }
        } catch (error) {
            console.error('Error deleting appointment:', error);
            setError(error.message || 'Failed to delete appointment');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDelete = (appointment) => {
        setSelectedAppointment(appointment);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedAppointment) {
            await handleDeleteAppointment(selectedAppointment._id);
        }
    };

    // Filter handlers
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);

        if (showNewAppointments) {
            setShowNewAppointments(false);
            setNewAppointments([]);
        }
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
        if (showNewAppointments) {
            setShowNewAppointments(false);
            setNewAppointments([]);
        }
    };

    const handlePackageTypeFilterChange = (e) => {
        setPackageTypeFilter(e.target.value);
        setCurrentPage(1);
        if (showNewAppointments) {
            setShowNewAppointments(false);
            setNewAppointments([]);
        }
    };

    const identifyNewAppointments = () => {
        const recent = [...appointments]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3);
        setNewAppointments(recent);
        setShowNewAppointments(true);
        setStatusFilter('all');
        setPackageTypeFilter('all');
        setSearchTerm('');
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setPackageTypeFilter('all');
        setShowNewAppointments(false);
        setNewAppointments([]);
        setCurrentPage(1);
    };

    // Sorting handlers
    const handleSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return faSort;
        return sortConfig.direction === 'asc' ? faSortUp : faSortDown;
    };

    // Get filtered and sorted appointments
    const getDisplayAppointments = () => {
        let displayApps = [...appointments];

        if (searchTerm) {
            displayApps = displayApps.filter(app => 
                app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.packageType?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'all' && !showNewAppointments) {
            displayApps = displayApps.filter(app => app.status === statusFilter);
        }

        if (packageTypeFilter !== 'all' && !showNewAppointments) {
            displayApps = displayApps.filter(app => app.packageType === packageTypeFilter);
        }

        if (showNewAppointments) {
            displayApps = newAppointments;
        }

        displayApps.sort((a, b) => {
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

        return displayApps;
    };

    const filteredAppointments = getDisplayAppointments();

    // Pagination calculations
    const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);

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
            confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
            completed: 'bg-green-100 text-green-800 border-green-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200',
            rescheduled: 'bg-purple-100 text-purple-800 border-purple-200'
        };
        
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
                {status?.toUpperCase()}
            </span>
        );
    };

    if (loading) return <LoadingSpinner message="Loading appointments..." />;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">    
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
                <p className="text-sm font-light text-gray-500 mb-2 tracking-wider">APPOINTMENTS</p>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-700 font-light">MANAGE YOUR PHOTOGRAPHY APPOINTMENTS</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FontAwesomeIcon icon={faCamera} />
                        <span>Total: {appointments.length}</span>
                    </div>
                </div>
            </header>

            <FilterBar 
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search appointments..."

                filterOptions={statusOptions}
                filterValue={statusFilter}
                onFilterChange={handleStatusFilterChange}
                filterPlaceholder="Filter by status"

                filterTypeOptions={typeOptions}
                filterTypeValue={packageTypeFilter}
                onFilterTypeChange={handlePackageTypeFilterChange}
                filterTypePlaceholder="Filter by package type"

                showSpecialFilter={true}
                specialFilterLabel="NEW APPOINTMENTS"
                specialFilterIcon={faFire}
                onSpecialFilterClick={identifyNewAppointments}
                isSpecialFilterActive={showNewAppointments}
                resultsCount={filteredAppointments.length}
                resultsLabel="APPOINTMENTS"
                onRefresh={fetchAppointments}
                onClearFilters={clearFilters}
                theme="maple"
            />

            <AppointmentTable 
                appointments={currentItems}
                onSort={handleSort}
                sortConfig={sortConfig}
                getSortIcon={getSortIcon}
                onView={handleViewClick}
                onEdit={handleEditClick}
                onDelete={handleDelete}
                updatingId={updatingId}
                StatusBadge={StatusBadge}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredAppointments.length)} of {filteredAppointments.length} appointments
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

            <ViewModalApp 
                isOpen={showViewModal}
                onClose={() => {
                    setShowViewModal(false);
                    setSelectedAppointment(null);
                }}
                appointment={selectedAppointment}
            />

            <EditModal 
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedAppointment(null);   
                }}
                onSave={handleSaveEdit}
                appointment={selectedAppointment}
            />

            <DeleteModal 
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedAppointment(null);
                }}
                onConfirm={handleConfirmDelete}
                item={selectedAppointment}
                title="Delete Appointment"
                subtitle="Are you sure you want to delete this appointment permanently"
                loading={deleteLoading}
            />
        </div>
    );
}

export default MAppointments;