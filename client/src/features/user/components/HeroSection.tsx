import { publicFrontendRoutes } from '@/constants/frontendRoutes/publicFrontendRoutes';
import { UserRole } from '@/constants/types/User';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleTherapistLogin = () => {
    navigate(publicFrontendRoutes.signup, { state: { role: UserRole.PSYCHOLOGIST } });
  };
  return (
    <section className="relative w-full h-[60vh] sm:h-auto">
      {/* Background Image */}
      <img
        src="/images/hero_banner.jpg"
        alt="Psychologist consultation banner"
        className="w-full h-full object-cover object-center sm:object-contain sm:h-auto"
        style={{ objectPosition: '90% center' }}
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 flex items-center justify-center sm:justify-start text-center sm:text-start px-7 sm:px-36 pt-36 sm:pt-24 bg-black/40 sm:bg-black/10">
        <div className="max-w-full sm:max-w-xl">
          <h1 className="text-2xl sm:text-[6rem] leading-tight sm:leading-[1] font-bold text-white sm:text-primaryText drop-shadow-md sm:drop-shadow-none">
            Get the help you need
          </h1>
          <p className="text-sm sm:text-lg mt-4 text-white sm:text-gray-800 mb-6 sm:mb-5 drop-shadow-md sm:drop-shadow-none">
            Connect with the best Psychologist in India at a single click
          </p>
          <div className="group text-center sm:text-start">
            <button
              onClick={handleTherapistLogin}
              className="btn-primary px-6 py-2 sm:px-auto sm:py-auto text-white bg-[#3EB1EB] sm:bg-inherit hover:bg-[#2A9CDB] sm:hover:bg-inherit transition-colors duration-200 group-hover:animate-glow-ring"
              aria-label="Login as Therapist"
            >
              Login as Therapist
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
