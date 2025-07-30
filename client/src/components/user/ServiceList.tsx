import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { serviceApi } from "../../server/api/service";

type Service = {
  id: string;
  name: string;
  description: string;
  bannerImage: string;
};

const ServiceList = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await serviceApi.getAll();

        const mapped = response.services.map((service: Service) => ({
          id: service.id,
          name: service.name,
          description: service.description,
          bannerImage: service.bannerImage,
        }));

        setServices(mapped);
      } catch (error) {
        toast.error("Failed to load specialization");
        console.error("Failed to fetch services:", error);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="bg-gray-100 py-16 px-8 sm:px-6 lg:px-36 pt-44">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-primaryText text-center">Our Services</h1>
        <p className="text-gray-600 mb-20 text-sm sm:text-base text-center">
          We offer a variety of services to support your mindfulness journey. Choose what best suits your needs.
        </p>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12 sm:gap-y-16 sm:mb-36">
          {services.map((service) => (
            <div
              key={service.id}
              className="relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-shadow duration-300 h-full flex flex-col justify-center items-center"
            >
              {/* Image */}
              <div className="absolute w-[230px] h-auto top-[-50px] left-1/2 transform -translate-x-1/2 mb-6 overflow-hidden rounded-2xl">
                <img
                  src={service.bannerImage}
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
      </div>
    </div>
  );
};

export default ServiceList;