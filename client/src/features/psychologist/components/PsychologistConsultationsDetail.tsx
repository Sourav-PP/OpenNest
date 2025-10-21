import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { userApi } from '@/services/api/user';
import { handleApiError } from '@/lib/utils/handleApiError';
import type { IUserConsultationDetailsResponseData } from '@/types/api/user';
import { getCloudinaryUrl } from '@/lib/utils/cloudinary';
import ConfirmationModal from '@/components/user/ConfirmationModal';
import { psychologistApi } from '@/services/api/psychologist';
import { History } from 'lucide-react';
import { generalMessages } from '@/messages/GeneralMessages';
import { ConsultationStatus } from '@/constants/types/Consultation';
import { PaymentStatus } from '@/constants/types/Payment';
import { psychologistFrontendRoutes } from '@/constants/frontendRoutes/psychologistFrontendRoutes';
import { Button } from '@/components/ui/button';
import ConsultationNotesModal from './ConsultationNotesModal';

const PsychologistConsultationsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState<IUserConsultationDetailsResponseData>();
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [reason, setReason] = useState('');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    if (!consultation?.startDateTime) return;

    const updateTimer = () => {
      const startTime = new Date(consultation.startDateTime).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, Math.floor((startTime - now) / 1000));
      setTimeLeft(diff);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [consultation?.startDateTime]);

  const formatTimeLeft = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    let text = '';
    if (hrs > 0) text += `${hrs}h `;
    if (mins > 0 || hrs > 0) text += `${mins}m `;
    text += `${secs}s`;

    return text;
  };

  const fetchConsultation = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await userApi.UserConsultationsDetail(id);

      console.log('reere: ', res);
      if (!res.data) {
        toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR);
        return;
      }

      setConsultation(res.data);

      if (res.data.patient.id) {
        try {
          const historyRes = await psychologistApi.getPatientHistory(res.data.patient.id, {
            page: 1,
            limit: 1,
          });

          setHasHistory((historyRes.data?.consultations.length ?? 0) > 0);
        } catch (error) {
          handleApiError(error);
          setHasHistory(false);
        }
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchConsultation();
  }, [fetchConsultation]);

  const handleCancelConsultation = async () => {
    if (!id || !reason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    try {
      setCancelLoading(true);
      const res = await psychologistApi.cancelConsultation(id, reason);
      if (!res.data) {
        toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR);
        return;
      }
      toast.success(res.message);
      setShowCancelModal(false);
      await fetchConsultation();

      navigate(psychologistFrontendRoutes.consultations);
    } catch (error) {
      handleApiError(error);
    } finally {
      setCancelLoading(false);
    }
  };

  const formatTime = (date: string | Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(new Date(date));
  };

  const getDuration = (start: string | Date, end: string | Date) => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const durationInMinutes = Math.round((endTime - startTime) / (1000 * 60));
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    return `${hours}h ${minutes}m`;
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
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Consultation Details</h2>
      {hasHistory && consultation?.patient?.id && (
        <Link
          to={psychologistFrontendRoutes.patientHistory(consultation.patient.id)}
          state={{ from: 'consultation-detail', patientName: consultation.patient.name }}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg 
                    bg-indigo-700 hover:bg-indigo-800 text-white shadow-md transition-colors 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
        >
          <History className="w-4 h-4" />
          View Patient History
        </Link>
      )}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 border border-gray-200 transition-shadow duration-300 space-y-8">
        {/* Status on top-right */}
        <div className="flex justify-end">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold tracking-tight ${
              consultation.status === ConsultationStatus.Booked
                ? 'bg-green-50 text-green-900'
                : consultation.status === ConsultationStatus.Cancelled
                  ? 'bg-red-50 text-red-900'
                  : consultation.status === ConsultationStatus.Completed
                    ? 'bg-blue-50 text-blue-900'
                    : 'bg-yellow-50 text-yellow-900'
            }`}
          >
            {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
          </span>
        </div>

        {/* Participants */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-3">Participants</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Psychologist */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-100">
              <img
                src={getCloudinaryUrl(consultation.psychologist.profileImage) || undefined}
                alt={consultation.psychologist.name}
                className="w-14 h-14 rounded-full border-2 border-gray-200 object-cover"
              />
              <div>
                <h3 className="text-base font-semibold text-gray-900">{consultation.psychologist.name}</h3>
                <p className="text-sm text-gray-600">Psychologist</p>
              </div>
            </div>

            {/* Patient */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-100">
              <img
                src={getCloudinaryUrl(consultation.patient.profileImage) || undefined}
                alt={consultation.patient.name}
                className="w-14 h-14 rounded-full border-2 border-gray-200 object-cover"
              />
              <div>
                <h3 className="text-base font-semibold text-gray-900">{consultation.patient.name}</h3>
                <p className="text-sm text-gray-600">Patient</p>
              </div>
            </div>
          </div>
        </div>

        {/* Session Goal */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-3">Session Goal</h4>
          <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-100">
            {consultation.sessionGoal}
          </p>
        </div>

        {/* notes */}
        {consultation.notes && (consultation.notes.privateNotes || consultation.notes.feedback) && (
          <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-4">
            {consultation.notes.privateNotes && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Private Notes</h4>
                <p className="text-gray-800">{consultation.notes.privateNotes}</p>
              </div>
            )}
            {consultation.notes.feedback && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Feedback to Patient</h4>
                <p className="text-gray-800">{consultation.notes.feedback}</p>
              </div>
            )}
          </div>
        )}

        { consultation.status === ConsultationStatus.Completed && (
          <div>
            <Button
              onClick={() => setIsNotesModalOpen(true)}
              className="mt-4 bg-indigo-700 hover:bg-indigo-800 text-white"
            >
              Add / Edit Notes & Feedback
            </Button>
          </div>
        )}

        {/* Payment Details */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-3">Payment Details</h4>
          {consultation.payment ? (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 space-y-2">
              <p className="text-gray-900 font-medium">
                Amount: {consultation.payment.amount} {consultation.payment.currency}
              </p>
              <p className="text-gray-600 ">
                Method:{' '}
                {consultation.payment.paymentMethod.charAt(0).toUpperCase() +
                  consultation.payment.paymentMethod.slice(1)}
              </p>
              <p
                className={`font-medium ${
                  consultation.payment.paymentStatus === PaymentStatus.SUCCEEDED
                    ? 'text-green-900'
                    : consultation.payment.paymentStatus === PaymentStatus.FAILED
                      ? 'text-red-900'
                      : 'text-yellow-900'
                }`}
              >
                Status:{' '}
                {consultation.payment.paymentStatus.charAt(0).toUpperCase() +
                  consultation.payment.paymentStatus.slice(1)}
              </p>
              {consultation.payment.refunded && <p className="text-red-900 font-medium">Refunded</p>}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 space-y-2 text-gray-900 font-medium">
              <p>Amount: Included in Subscription</p>
              <p>Method: Subscription</p>
              <p>Status: Paid</p>
            </div>
          )}
        </div>

        {/* Schedule */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-3">Schedule</h4>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <p className="text-gray-900 font-medium">
              {new Date(consultation.startDateTime).toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="text-gray-600 text-sm">
              {formatTime(consultation.startDateTime)} – {formatTime(consultation.endDateTime)} (
              {getDuration(consultation.startDateTime, consultation.endDateTime)})
            </p>
          </div>
        </div>

        {/* Meeting */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-3">Meeting</h4>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            {consultation.meetingLink ? (
              <Link
                to={psychologistFrontendRoutes.videoCall(consultation.id)}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors duration-200 ${
                  consultation.status === ConsultationStatus.Completed ||
                  consultation.status === ConsultationStatus.Cancelled ||
                  consultation.status === ConsultationStatus.Missed
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-700 hover:bg-indigo-800'
                }`}
                onClick={e => {
                  if (
                    consultation.status === ConsultationStatus.Completed ||
                    consultation.status === ConsultationStatus.Cancelled ||
                    consultation.status === ConsultationStatus.Missed
                  ) {
                    e.preventDefault();
                  }
                }}
              >
                {consultation.status === ConsultationStatus.Completed
                  ? 'Call Completed'
                  : consultation.status === ConsultationStatus.Cancelled
                    ? 'Call Cancelled'
                    : consultation.status === ConsultationStatus.Missed
                      ? 'Call Missed'
                      : timeLeft > 0
                        ? `Starts in ${formatTimeLeft(timeLeft)}`
                        : 'Join Meeting'}
              </Link>
            ) : (
              <p className="text-gray-500 italic text-sm">Meeting link not available</p>
            )}
          </div>
        </div>

        {/* Actions */}
        {consultation.status === ConsultationStatus.Booked && (
          <div className="pt-2">
            <button
              onClick={() => setShowCancelModal(true)}
              disabled={cancelLoading}
              className={`inline-flex items-center px-5 py-2 rounded-lg text-white text-sm font-medium transition-colors duration-200 ${
                cancelLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-700 hover:bg-red-800'
              }`}
            >
              {cancelLoading ? 'Cancelling...' : 'Cancel Consultation'}
            </button>
          </div>
        )}
      </div>

      {/* Cancel Modal */}
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
          onChange={e => setReason(e.target.value)}
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
          placeholder="Enter reason..."
        />
      </ConfirmationModal>

      {/* add notes Modal */}
      <ConsultationNotesModal
        consultationId={consultation.id}
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        initialNotes={consultation.notes}
        onSaved={(notes) => setConsultation({ ...consultation, notes })}
      />
    </div>
  );
};

export default PsychologistConsultationsDetail;
