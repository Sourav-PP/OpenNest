

const TestimonialSection = () => {
  const stats = [
    {
      id: 1,
      number: '8,000+',
      description: 'No. of people healed'
    },
    {
      id: 2,
      number: '25+',
      description: 'Therapists ready to help'
    },
    {
      id: 3,
      number: '25,000+',
      description: 'No. of sessions given'
    }
  ];

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main heading */}
        <h2 className="text-2xl sm:text-2xl lg:text-3xl font-medium text-gray-700 mb-16 leading-relaxed max-w-3xl mx-auto">
          OpenNest is the most preferred and trusted online counselling and therapy consultation platform in India
        </h2>
        
        {/* Statistics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-gray-700 mb-3">
                {stat.number}
              </div>
              <p className="text-gray-600 text-base lg:text-lg">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
