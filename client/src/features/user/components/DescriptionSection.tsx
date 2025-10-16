const DescriptionSection = () => {
  return (
    <section className="w-full py-12 sm:py-16 bg-white">
      <div className="container mx-autpx-7 px-6 sm:px-24 lg:px-36 flex flex-col sm:flex-row items-center justify-between">
        {/* Text Content */}
        <div className="w-full sm:w-1/2 mb-8 sm:mb-0 text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primaryText mb-4 text-center sm:text-left">
            Best Online Counselling and Therapy Consultation
          </h2>
          <p className="text-sm text-center sm:text-left sm:text-base md:text-lg text-gray-500 leading-relaxed">
            OpenNest provides the best online therapy and counseling consultation in India and around the globe. Consult
            Online Psychologist, therapist, counsellors, mental health experts via chat, phone or video call. Best
            Online Psychologist consultation and Online Psychiatric Consultation.
          </p>
        </div>
        {/* Illustration */}
        <div className="w-full sm:w-1/2 flex justify-center sm:justify-end ml-auto sm:ml-0">
          <img
            src="/images/hero_cartoon.svg"
            alt="Online counseling illustration"
            className="w-full sm:w-auto h-auto max-w-md sm:max-w-xl object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default DescriptionSection;
