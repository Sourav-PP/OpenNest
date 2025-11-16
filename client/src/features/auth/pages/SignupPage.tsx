import { publicFrontendRoutes } from '@/constants/frontendRoutes/publicFrontendRoutes';
import SignupForm from '../components/SignupForm';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const navigate = useNavigate();
  return (
    <div className="relative flex items-center justify-center min-h-screen px-7 sm:px-6 bg-auth bg-cover bg-center py-8 sm:py-12 overflow-auto">
      <div className="absolute inset-0 bg-white opacity-10 z-0"></div>
      <div className="relative z-10 bg-white p-8 rounded-[40px] shadow-2xl w-full max-w-sm mx-auto sm:w-96 text-gray-500 text-sm">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#3EB1EB] text-center">Create Account</h2>
        <p className="text-center  mb-4">Create a new account here</p>
        <SignupForm />
        {/* Back to Home Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate(publicFrontendRoutes.landing)} // or '/'
            className="flex items-center gap-1 px-2 py-1 border bg-gray-200 text-gray-500 font-medium rounded-full hover:bg-gray-300 transition-all duration-300 shadow-sm"
          >
            <span className="text-lg"></span>
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}
