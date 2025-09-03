import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { userApi } from '@/services/api/user';
import { handleApiError } from '@/lib/utils/handleApiError';
import type { IUserConsultationDetailsResponseData } from '@/types/api/user';
import { getCloudinaryUrl } from '@/lib/utils/cloudinary';
import ConfirmationModal from '@/components/user/ConfirmationModal';

const UserConsultationsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState<IUserConsultationDetailsResponseData>();
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [reason, setReason] = useState('');

  useEffect(() => {
    const fetchConsultation = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await userApi.UserConsultationsDetail(id);

        if (!res.data) {
          toast.error('Something went wrong');
          return;
        }

        setConsultation(res.data);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultation();
  }, [id]);

  const handleCancelConsultation = async () => {
    if (!id || !reason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    try {
      setCancelLoading(true);
      const res = await userApi.cancelConsultation(id, reason);
      toast.success(res.message);
      setShowCancelModal(false);
      navigate('/user/consultations');
    } catch (error) {
      handleApiError(error);
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="relative h-10 w-10 animate-spin" style={{ animationDuration: '1.2s' }}>
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="absolute h-2 w-2 bg-gray-300 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${index * 45}deg) translateY(-18px)`,
              }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (!consultation) {
    return <div className="text-center py-12">No consultation found</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-12 py-8 sm:py-12 bg-gradient-to-br from-slate-200 to-white min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Consultation Details</h2>
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8 border border-gray-50 hover:shadow-2xl transition-shadow duration-300">
        <div className="flex items-center mb-6">
          <img
            src={getCloudinaryUrl(consultation.psychologist.profileImage) || 'https://via.placeholder.com/80'}
            alt={consultation.psychologist.name}
            className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-indigo-100"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {consultation.psychologist.name}
            </h3>
            <p className="text-sm text-gray-500">Psychologist</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <strong className="text-gray-700">Session Goal:</strong>{' '}
            <span className="text-gray-900">{consultation.sessionGoal}</span>
          </div>

          <div>
            <strong className="text-gray-700">Status:</strong>{' '}
            <span
              className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                consultation.status === 'booked'
                  ? 'bg-green-100 text-green-700'
                  : consultation.status === 'cancelled'
                    ? 'bg-red-100 text-red-700'
                    : consultation.status === 'completed'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
            </span>
          </div>

          <div>
            <strong className="text-gray-700">Start:</strong>{' '}
            <span className="text-gray-900">
              {new Date(consultation.startDateTime).toLocaleString()}
            </span>
          </div>

          <div>
            <strong className="text-gray-700">End:</strong>{' '}
            <span className="text-gray-900">
              {new Date(consultation.endDateTime).toLocaleString()}
            </span>
          </div>

          <div>
            <strong className="text-gray-700">Slot:</strong>{' '}
            <span className="text-gray-900">
              {new Date(consultation.slot.startDateTime).toLocaleTimeString()} -{' '}
              {new Date(consultation.slot.endDateTime).toLocaleTimeString()}
            </span>
          </div>

          <div className="flex gap-4 mt-6">
            {consultation.meetingLink && (
              <a
                href={consultation.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Join Meeting
              </a>
            )}
            {consultation.status === 'booked' && (
              <button
                onClick={() => setShowCancelModal(true)}
                disabled={cancelLoading}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200 ${
                  cancelLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {cancelLoading ? 'Cancelling...' : 'Cancel Consultation'}
              </button>
            )}
          </div>
        </div>
      </div>
      <ConfirmationModal
        title="Cancel Consultation"
        description="Please provide a reason for cancelling this consultation:"
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelConsultation}
        confirmText="Confirm Cancel"
        confirmLoading={cancelLoading}
      >
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Enter reason..."
        />
      </ConfirmationModal>
    </div>
  );
};

export default UserConsultationsDetail;