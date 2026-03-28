// components/modals/jobs/SoftDeleteModal.jsx
import React from 'react';
import ConfirmModal from '../../common/ConfirmModal.jsx';

function SoftDeleteModal({ isOpen, onClose, onDeleteSuccess, job }) {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleDelete = async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please login first');
                setLoading(false);
                return;
            }

            const response = await fetch(`http://localhost:5000/api/jobs/soft-delete/${job._id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (result.success) {
                onDeleteSuccess(job._id);
                onClose();
            } else {
                setError(result.message || 'Failed to delete job');
            }
        } catch (error) {
            console.error('Error deleting job:', error);
            setError('Failed to delete job. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getJobTypeDisplay = (type) => {
        switch(type?.toLowerCase()) {
            case 'fulltime': return 'Full Time';
            case 'parttime': return 'Part Time';
            case 'contract': return 'Contract';
            case 'internship': return 'Internship';
            default: return type || 'N/A';
        }
    };

    return (
        <>
            {error && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-lg p-4 max-w-md">
                        <p className="text-red-600">{error}</p>
                        <button onClick={() => setError('')} className="mt-2 px-4 py-2 bg-gray-200 rounded">
                            Close
                        </button>
                    </div>
                </div>
            )}
            
            <ConfirmModal
                isOpen={isOpen && !error}
                onClose={onClose}
                onConfirm={handleDelete}
                title="Archive Job"
                message="This job will be archived and won't appear in active listings. You can restore it later if needed."
                itemName={job?.name}
                itemDetails={{
                    type: getJobTypeDisplay(job?.type),
                    location: job?.location,
                    salary: job?.salary
                }}
                confirmText="Archive"
                type="warning"
                isLoading={loading}
            />
        </>
    );
}

export default SoftDeleteModal;