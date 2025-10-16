import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { userApi } from '@/services/api/user';
import { toast } from 'react-toastify';
import AnimatedTitle from '@/components/animation/AnimatedTitle';
import type { IUserConsultationHistoryDetailsResponseData } from '@/types/api/user';
import { handleApiError } from '@/lib/utils/handleApiError';
import { getCloudinaryUrl } from '@/lib/utils/cloudinary';
import { formatDuration, formatTime, formatTimeRange } from '@/lib/utils/dateTimeFormatter';
import { generalMessages } from '@/messages/GeneralMessages';
import { ConsultationStatus } from '@/constants/Consultation';
import { PaymentStatus } from '@/constants/Payment';

const UserConsultationHistoryDetail = () => {
  const { consultationId } = useParams<{ consultationId: string }>();
  const [consultation, setConsultation] = useState<IUserConsultationHistoryDetailsResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConsultationDetail = async () => {
      try {
        setLoading(true);
        const res = await userApi.getUserConsultationHistoryDetail(consultationId!);

        console.log('res: ', res);
        if (!res.data) {
          toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR);
          return;
        }
        setConsultation(res.data);
      } catch (err) {
        handleApiError(err);
        navigate('/user/consultation/history');
      } finally {
        setLoading(false);
      }
    };

    if (consultationId) fetchConsultationDetail();
  }, [consultationId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="relative h-12 w-12 animate-spin" style={{ animationDuration: '1.2s' }}>
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="absolute h-2 w-2 bg-indigo-400 rounded-full"
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
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Consultation not found.</p>
        <Link
          to="/user/consultation/history"
          className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 font-medium"
        >
          Back to History
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-12 py-8 sm:py-12 bg-gradient-to-br from-slate-200 to-white min-h-screen">
      <AnimatedTitle>
        <h2 className="text-3xl sm:text-4xl font-bold text-primaryText mb-6 tracking-tight text-start">
          Consultation History
        </h2>
      </AnimatedTitle>

      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 border border-gray-200 transition-shadow duration-300 space-y-8">
        {/* Status Badge */}
        <div className="flex justify-end">
          <span
            className={`px-4 py-1.5 rounded-full text-sm font-semibold tracking-tight ${
              consultation.status === ConsultationStatus.Completed
                ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-200'
                : consultation.status === ConsultationStatus.Cancelled
                  ? 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-200'
                  : consultation.status === ConsultationStatus.Rescheduled
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-200'
                    : 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-200'
            }`}
          >
            {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
          </span>
        </div>

        {/* Participants */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Psychologist</h3>
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
            <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-100 dark:border-gray-600">
              {consultation.psychologist.profileImage && (
                <img
                  src={getCloudinaryUrl(consultation.psychologist.profileImage) || undefined}
                  alt={consultation.psychologist.name}
                  className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-600 object-cover"
                />
              )}
              <div>
                <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                  {consultation.psychologist.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Psychologist</p>
              </div>
            </div>
          </div>
        </div>

        {/* Session Goal */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Session Goal</h3>
          <p className="text-gray-700 dark:text-gray-200 leading-relaxed bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-100 dark:border-gray-600">
            {consultation.sessionGoal}
          </p>
        </div>

        {/* Schedule */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Schedule</h3>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-100 dark:border-gray-600 space-y-2">
            <p className="text-gray-900 dark:text-gray-200 font-medium">
              {new Date(consultation.startDateTime).toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {formatTimeRange(consultation.startDateTime, consultation.endDateTime)} (
              {formatDuration(consultation.startDateTime, consultation.endDateTime)})
            </p>
          </div>
        </div>

        {/* Payment Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Details</h3>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-100 dark:border-gray-600 space-y-2">
            <p className="text-gray-900 dark:text-gray-200 font-medium">
              Amount: {consultation.payment.amount} {consultation.payment.currency}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Method:{' '}
              {consultation.payment.paymentMethod.charAt(0).toUpperCase() + consultation.payment.paymentMethod.slice(1)}
            </p>
            <p
              className={`font-medium ${
                consultation.payment.paymentStatus === PaymentStatus.SUCCEEDED
                  ? 'text-green-900 dark:text-green-200'
                  : consultation.payment.paymentStatus === PaymentStatus.FAILED
                    ? 'text-red-900 dark:text-red-200'
                    : 'text-yellow-900 dark:text-yellow-200'
              }`}
            >
              Status:{' '}
              {consultation.payment.paymentStatus.charAt(0).toUpperCase() + consultation.payment.paymentStatus.slice(1)}
            </p>
            {consultation.payment.refunded && <p className="text-red-900 dark:text-red-200 font-medium">Refunded</p>}
          </div>
        </div>

        {/* Video Call Details */}
        {consultation.video &&
          (consultation.video.startedAt || consultation.video.endedAt || consultation.video.duration) && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Video Call Details</h3>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-100 dark:border-gray-600 space-y-2">
              {consultation.video.startedAt && (
                <p className="text-gray-600 dark:text-gray-400">
                  Started: {formatTime(consultation.video.startedAt)}
                </p>
              )}
              {consultation.video.endedAt && (
                <p className="text-gray-600 dark:text-gray-400">Ended: {formatTime(consultation.video.endedAt)}</p>
              )}
              {consultation.video.duration && (
                <p className="text-gray-600 dark:text-gray-400">
                  Duration: {Math.floor(consultation.video.duration / 60)}m {consultation.video.duration % 60}s
                </p>
              )}
            </div>
          </div>
        )}

        {/* Meeting Link */}
        {consultation.meetingLink && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Meeting</h3>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-100 dark:border-gray-600">
              <a
                href={consultation.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors duration-200 ${
                  consultation.status === ConsultationStatus.Completed
                    ? 'bg-gray-400 cursor-not-allowed'
                    : consultation.status === ConsultationStatus.Cancelled
                      ? 'bg-red-400 cursor-not-allowed'
                      : consultation.status === ConsultationStatus.Rescheduled
                        ? 'bg-amber-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
                onClick={e => {
                  if (['completed', 'cancelled', 'rescheduled'].includes(consultation.status)) {
                    e.preventDefault();
                  }
                }}
              >
                {consultation.status === ConsultationStatus.Completed
                  ? 'Call Completed'
                  : consultation.status === ConsultationStatus.Cancelled
                    ? 'Call Cancelled'
                    : consultation.status === ConsultationStatus.Rescheduled
                      ? 'Call Rescheduled'
                      : 'Join Meeting'}
              </a>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="flex justify-end">
          <Link
            to="/user/consultation/history"
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 font-medium"
          >
            Back to History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserConsultationHistoryDetail;
