import { useEffect, useState, useCallback } from 'react';
import { psychologistApi } from '@/services/api/psychologist';
import { Star } from 'lucide-react';
import { getCloudinaryUrl } from '@/lib/utils/cloudinary';
import { Button } from '@/components/ui/button';
import { handleApiError } from '@/lib/utils/handleApiError';
import type { PsychologistReviewDTO } from '@/types/api/psychologist';
import { toast } from 'react-toastify';
import { generalMessages } from '@/messages/GeneralMessages';
import type { IPsychologistProfileDto } from '@/types/dtos/psychologist';

const PsychologistReviews = () => {
  const [reviews, setReviews] = useState<PsychologistReviewDTO[]>([]);
  const [psychologist, setPsychologist] = useState<IPsychologistProfileDto | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch psychologist profile
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const res = await psychologistApi.getProfile();
        if (res?.id) setPsychologist(res);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  // Fetch reviews (memoized with useCallback)
  const fetchReviews = useCallback(
    async (pageNum: number, reset = false) => {
      if (!psychologist?.id) return;

      try {
        setLoading(true);
        const res = await psychologistApi.getPsychologistReviews(psychologist.id, pageNum, 6);

        if (!res.data) {
          toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR);
          return;
        }

        const { reviews: newReviews, hasMore } = res.data;
        setReviews(prev => (reset ? newReviews : [...prev, ...newReviews]));
        setHasMore(hasMore);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    },
    [psychologist?.id]
  );

  // Fetch when psychologist profile is ready
  useEffect(() => {
    if (psychologist?.id) {
      setPage(1);
      fetchReviews(1, true); // reset = true
    }
  }, [psychologist?.id, fetchReviews]);

  // No reviews yet
  if (reviews.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600 text-lg font-medium sm:text-xl">No reviews yet.</p>
          <p className="text-gray-500 text-sm sm:text-base mt-2">Be the first to share your experience!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-12 gap-4 sm:gap-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
            Patient Reviews
          </h1>

          {/* Rating Summary */}
          {psychologist && (
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-4 py-2 sm:px-5 sm:py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-base sm:text-lg font-semibold text-gray-800">
                  {psychologist.averageRating?.toFixed(1) ?? '—'}
                </span>
              </div>
              <span className="text-xs sm:text-sm text-gray-500">
                ({psychologist.totalReviews ?? 0} reviews)
              </span>
            </div>
          )}
        </div>

        {/* Reviews Grid */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map(review => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-lg transition-shadow duration-300"
              role="article"
              aria-labelledby={`review-${review.id}`}
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <img
                  src={
                    (review.patient.profileImage &&
                      getCloudinaryUrl(review.patient.profileImage)) ||
                    '/default-avatar.png'
                  }
                  alt={`${review.patient.name}'s profile`}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-gray-200"
                  loading="lazy"
                />
                <div>
                  <p
                    id={`review-${review.id}`}
                    className="font-semibold text-gray-900 text-base sm:text-lg"
                  >
                    {review.patient.name}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                    <span className="sr-only">{review.rating} out of 5 stars</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-4">
                {review.userFeedback}
              </p>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-8 sm:mt-12">
            <Button
              onClick={() => {
                const nextPage = page + 1;
                setPage(nextPage);
                fetchReviews(nextPage);
              }}
              disabled={loading}
              className="btn-primary rounded-full group-hover:animate-glow-ring mb-2"
              aria-label={loading ? 'Loading more reviews' : 'Load more reviews'}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                'Load More'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PsychologistReviews;