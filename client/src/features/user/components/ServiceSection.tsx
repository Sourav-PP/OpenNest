import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { serviceApi } from '@/services/api/service';
import { useNavigate } from 'react-router-dom';
import { handleApiError } from '@/lib/utils/handleApiError';
import { getCloudinaryUrl } from '@/lib/utils/cloudinary';


type Service = {
  id: string,
  name: string,
  description: string,
  bannerImage: string
}

const ServiceSession = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await serviceApi.getAll();

        if(!response.data) {
          toast.error('Error fetching the services');
          return;
        }
        const mapped = response.data.services.slice(1, 4).map((service: Service) => ({
          id: service.id,
          name: service.name,
          description: service.description,
          bannerImage: service.bannerImage,
        }));

        setServices(mapped);
      } catch (error) {
        handleApiError(error);
      }
    };

    fetchServices();
  },[]);

  return (
    <div className="bg-gray-200 py-16 px-8 sm:px-6 lg:px-36 pt-32">
      <div className="max-w-7xl mx-auto">
        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20 sm:gap-8 mb-12">
          {services.map((service) => (
            <div key={service.id} className="relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-shadow duration-300 h-full flex flex-col justify-center items-center">
              {/* Image */}
              <div className="absolute w-[230px] h-auto top-[-50px] left-1/2 transform -translate-x-1/2 mb-6 overflow-hidden rounded-2xl">
                <img 
                  src={getCloudinaryUrl(service.bannerImage) || undefined} 
                  alt={service.name}
                  className="w-[230px] h-auto object-cover"
                />
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center mt-20">
                {service.name}
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6 text-center flex-grow">
                {service.description}
              </p>
              
              {/* Button */}
              <div className="text-center">
                <button className="text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors duration-200">
                  Show Psychologists
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* See All Therapy Services Button */}
        <div className="group text-center sm:text-center">
          <button
            onClick={() => navigate('/user/services')}
            className="btn-primary px-6 py-2 sm:px-auto sm:py-auto text-white bg-[#3EB1EB] sm:bg-inherit hover:bg-[#2A9CDB] sm:hover:bg-inherit transition-colors duration-200 group-hover:animate-glow-ring"
            aria-label="Login as Therapist"
          >
            See all Services
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceSession;