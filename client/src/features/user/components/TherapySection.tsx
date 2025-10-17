import { userFrontendRoutes } from '@/constants/frontendRoutes/userFrontendRoutes';
import { useNavigate } from 'react-router-dom';

const TherapySection = () => {
  const navigate = useNavigate();
  return (
    <div className="relative bg-gray-200 py-16 px-8 sm:px-6 lg:px-36 pt-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Image */}
          <div className="hidden sm:block order-2 lg:order-1">
            <div className="w-full">
              <img
                src="/images/girl_with_clipboard.png"
                alt="Professional psychologist with clipboard"
                className="lg:w-[500px] w-[350px] absolute bottom-0 h-auto object-cover rounded-lg min-h-[400px] max-w-none"
                style={{ maxWidth: 'none' }}
              />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="order-1 lg:order-2 space-y-8">
            {/* Main Heading */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-primaryText mb-6">
                Consult Best Psychologists in India
              </h2>
              <p className="text-gray-600 lg:text-lg leading-relaxed">
                Top Therapists, Counsellors, Mental Health Experts in India. See the List of Top Psychologists in India.
                Best Online Psychologist Consultation in India.
              </p>
            </div>

            {/* Certified & Experienced Section */}
            <div>
              <h3 className="text-2xl font-semibold text-primaryText mb-4">Certified & Experienced</h3>
              <p className="text-gray-600 lg:text-lg leading-relaxed mb-6">
                Get the best online Therapy & Counseling Experience from the Verified Professionals. Top Therapists for
                your mental health.
              </p>
              <p className="text-gray-600 lg:text-lg font-semibold leading-relaxed">
                We assign the best psychologist and counsellor as per your case. We Choose the best for you.
              </p>
            </div>

            {/* Button */}
            <div className="group text-center sm:text-start">
              <button
                onClick={() => navigate(userFrontendRoutes.psychologist)}
                className="btn-primary px-6 py-2 sm:px-auto sm:py-auto text-white bg-[#3EB1EB] sm:bg-inherit hover:bg-[#2A9CDB] sm:hover:bg-inherit transition-colors duration-200 group-hover:animate-glow-ring"
                aria-label="Login as Therapist"
              >
                See all Psychologists
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapySection;
