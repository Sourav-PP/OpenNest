import { Loader2 } from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { getCloudinaryUrl } from '@/lib/utils/cloudinary';
import { useNavigate } from 'react-router-dom';
import { userFrontendRoutes } from '@/constants/frontendRoutes/userFrontendRoutes';

const ServiceList = () => {
  const { services, loading } = useServices();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="relative flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-200 to-white p-4 sm:p-8 md:p-12 lg:p-16 xl:pt-28">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-primaryText mb-4 text-center tracking-tight">
          Our Services
        </h1>
        <p className="text-gray-500 mb-20 font-extralight sm:text-lg text-center max-w-2xl mx-auto leading-relaxed">
          Discover a range of services tailored to support your mindfulness journey. Find the perfect fit for your
          needs.
        </p>

        {/* Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-24 sm:gap-y-20">
          {services.map(service => (
            <div
              key={service.id}
              className="relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col justify-center items-center animate-fadeIn"
            >
              {/* Image */}
              <div className="absolute w-[230px] h-auto top-[-50px] left-1/2 transform -translate-x-1/2 mb-6 overflow-hidden rounded-2xl">
                <img
                  src={getCloudinaryUrl(service.bannerImage) || undefined}
                  alt={service.name}
                  className="w-[230px] h-auto object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center mt-20">{service.name}</h3>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6 text-center flex-grow">{service.description}</p>

              {/* Button */}
              <div className="text-center">
                <button
                  className="text-blue-600 font-medium text-sm hover:text-blue-800 transition-colors duration-300 hover:underline"
                  onClick={() => navigate(userFrontendRoutes.psychologist)}
                >
                  Show Psychologists
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceList;
