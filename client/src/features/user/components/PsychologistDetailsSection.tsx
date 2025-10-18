import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { IPsychologistProfileDto } from '@/types/dtos/psychologist';
import { toast } from 'react-toastify';
import { userApi } from '@/services/api/user';
import { FiStar } from 'react-icons/fi';
import { handleApiError } from '@/lib/utils/handleApiError';
import { getCloudinaryUrl } from '@/lib/utils/cloudinary';
import { generalMessages } from '@/messages/GeneralMessages';

const PsychologistDetailsSection = () => {
  const { id } = useParams<{ id: string }>();
  const [psychologist, setPsychologist] = useState<IPsychologistProfileDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPsychologist = async () => {
      try {
        const res = await userApi.getPsychologistById(id!);
        if (!res.data) {
          toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR);
          return;
        }
        setPsychologist(res.data.psychologist);
      } catch (err) {
        console.log('its here: ', err);
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPsychologist();
  }, [id]);

  if (loading)
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
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );

  if (!psychologist) return <p className="text-white">Psychologist not found!</p>;

  const { email, name, defaultFee, qualification, aboutMe, specializations, profileImage } = psychologist;

  return (
    <div className="bg-gradient-to-b from-slate-100 to-white p-4 sm:p-8 md:p-12 lg:p-10 xl:pt-28">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-xl">
          <div className="relative">
            <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 ring-1 ring-yellow-200 ring-opacity-50 hover:ring-2 hover:ring-yellow-300 transition-all duration-200">
              <FiStar className="w-4 h-4" />
              <span>4.8</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 text-left">
            {/* Profile Image */}
            <div className="w-full sm:w-1/3 mt-8 sm:mt-0">
              <img
                src={getCloudinaryUrl(profileImage) || undefined}
                alt={`${name}'s profile`}
                className="w-full h-80 object-cover rounded-xl transform transition-all duration-300 hover:scale-105 shadow-md"
              />
            </div>

            {/* Details Section */}
            <div className="w-full sm:w-2/3 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-primaryText mb-1">{name}</h2>
              <p className="text-gray-500 text-sm mb-2">{email}</p>
              <p className="text-blue-700 text-base mb-1 font-medium">{qualification}</p>
              <p className="text-gray-600 text-base mb-4">
                <span className="font-semibold">Specializations:</span> {specializations.join(', ')}
              </p>
              <p className="text-gray-600 text-base leading-relaxed">
                <span className="font-semibold">About:</span> {aboutMe}
              </p>
              <p className="text-gray-900 text-base font-semibold mt-6">Consultation Fee: ${defaultFee}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PsychologistDetailsSection;
