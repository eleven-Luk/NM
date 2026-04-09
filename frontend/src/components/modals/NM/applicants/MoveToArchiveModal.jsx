import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive, faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons';
import ConfirmModal from '../../common/ConfirmModal.jsx';
import api from '../../../../services/api.js';


const MoveToArchiveModal = ({ isOpen, onClose, onMoveToArchiveSuccess, application }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    useEffect(() => {
        if (isOpen) {
            setError('');
            setIsLoading(false);
        }
    }, [isOpen]);

    const resetModalState = () => {
        setError('');
        setIsLoading(false);
    };


    if (!isOpen || !application) return null;

    const handleMoveToArchive = async () => {
        setIsLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please login first');
                setIsLoading(false);
                return;
            }

            const response = await api.patch(`/applications/archive/${application._id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (result.success) {
                onMoveToArchiveSuccess(application._id);
                resetModalState();
                onClose();
            } else {
                setError(result.message || 'Failed to archive application');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error archiving application:', error);
            setError('Failed to archive application. Please try again.');
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Prepare item details for display
    const itemDetails = {
        'Position': application.jobId?.name || 'N/A',
        'Status': application.status?.toUpperCase(),
        'Applied': formatDate(application.createdAt),
        'Email': application.email,
        'Phone': application.phone
    };

    // If there's an error, show error message
    if (error) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                <div className="bg-white rounded-lg p-6 max-w-md">
                    <div className="flex items-center gap-3 text-red-600 mb-4">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-xl" />
                        <h3 className="text-lg font-semibold">Error</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => setError('')}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={handleMoveToArchive}
            title="Archive Application"
            message="This application will be moved to the archive and won't appear in active listings. You can restore it later if needed."
            itemName={`${application.firstName} ${application.middleName || ''} ${application.lastName}`}
            itemDetails={itemDetails}
            confirmText="Archive"
            cancelText="Cancel"
            type="warning"
            icon={faArchive}
            isLoading={isLoading}
        />
    );
};

export default MoveToArchiveModal;