const ServiceSession = () => {
  const services = [
    {
      id: 1,
      title: "Depression",
      image: "/images/depression.svg",
      description: "Overcome the grip of depression with our compassionate and effective therapy services. Our expert therapists work through evidence-based approaches to help you regain your joy, find inner strength, and live a fulfilling life.",
      buttonText: "Show Psychologists"
    },
    {
      id: 2,
      title: "Anxiety",
      image: "/images/anxiety.svg",
      description: "Feeling low and on the edge is a sign that you need help. There's an unmet need of either feeling loved, worthy or just self-assurance that can be met with professional assistance.",
      buttonText: "Show Psychologists"
    },
    {
      id: 3,
      title: "Stress",
      image: "/images/stress.svg",
      description: "Overwhelmed by stress? Our stress therapy services offer a compassionate and effective approach to help you overcome the challenges and regain a sense of peace and balance. Take the first step towards a stress-free life today.",
      buttonText: "Show Psychologists"
    }
  ];

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
                  src={service.image} 
                  alt={service.title}
                  className="w-[230px] h-auto object-cover"
                />
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center mt-20">
                {service.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6 text-center flex-grow">
                {service.description}
              </p>
              
              {/* Button */}
              <div className="text-center">
                <button className="text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors duration-200">
                  {service.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* See All Therapy Services Button */}
        <div className="group text-center sm:text-center">
          <button
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