import { useEffect, useState } from 'react';
import { psychologistApi } from '@/services/api/psychologist';
import { useParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import { getCloudinaryUrl } from '@/lib/utils/cloudinary';
import { Button } from '@/components/ui/button';
import { handleApiError } from '@/lib/utils/handleApiError';
import { userApi } from '@/services/api/user';
import type { IPsychologistProfileDto } from '@/types/dtos/psychologist';
import type { PsychologistReviewDTO } from '@/types/api/psychologist';
import { toast } from 'react-toastify';
import { generalMessages } from '@/messages/GeneralMessages';

const UserReviewsSection = () => {
  const { id } = useParams<{ id: string }>();

  const [reviews, setReviews] = useState<PsychologistReviewDTO[]>([]);
  const [psychologist, setPsychologist] = useState<IPsychologistProfileDto | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch psychologist details
  useEffect(() => {
    if (!id) return;

    const fetchPsychologist = async () => {
      setLoading(true);
      try {
        const res = await userApi.getPsychologistById(id);
        if (res.data?.psychologist) {
          setPsychologist(res.data.psychologist);
        }
      } catch (err) {
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPsychologist();
  }, [id]);

  // Fetch reviews
  const fetchReviews = async (pageNum: number) => {
    if (!psychologist?.id) return;
    try {
      setLoading(true);
      const res = await psychologistApi.getPsychologistReviews(psychologist.id, pageNum, 2);
      if (!res.data) {
        toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR);
        return;
      }

      const { reviews: newReviews, hasMore } = res.data;
      setReviews(prev => [...prev, ...newReviews]);
      setHasMore(hasMore);

    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (psychologist?.id) {
      setReviews([]); // reset when psychologist changes
      setPage(1);
      fetchReviews(1);
    }
  }, [psychologist?.id]);

  if (reviews.length === 0 && !loading) return null;

  return (
    <section className="py-10 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Patient Reviews</h2>

        <div className="grid gap-6 sm:grid-cols-2">
          {reviews.map(review => (
            <div
              key={review.id}
              className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={
                    (review.patient.profileImage &&
                      getCloudinaryUrl(review.patient.profileImage)) ||
                    '/default-avatar.png'
                  }
                  alt={review.patient.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">{review.patient.name}</p>
                  <div className="flex text-sm">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm">{review.userFeedback}</p>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="text-center mt-8">
            <Button
              onClick={() => {
                setPage(prev => {
                  const next = prev + 1;
                  fetchReviews(next);
                  return next;
                });
              }}
              disabled={loading}
              className="bg-indigo-700 hover:bg-indigo-800 text-white"
            >
              {loading ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default UserReviewsSection;
