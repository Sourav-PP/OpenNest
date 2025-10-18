import { publicFrontendRoutes } from '@/constants/frontendRoutes/publicFrontendRoutes';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import { UserRole } from '@/constants/types/User';
import { psychologistFrontendRoutes } from '@/constants/frontendRoutes/psychologistFrontendRoutes';

export default function NotFound() {
  const role = useSelector((state: RootState) => state.auth.role);

  const redirectPath =
    role === UserRole.PSYCHOLOGIST ? psychologistFrontendRoutes.profile : publicFrontendRoutes.landing;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      <div className="bg-white rounded-2xl max-w-md w-full p-10 text-center">
        <h1 className="text-8xl font-extrabold text-indigo-600 mb-6 select-none text-center">404</h1>
        <p className="text-lg text-gray-700 mb-8 text-center">
          Sorry, the page you&#39;re looking for cannot be found or moved.
        </p>
        <Link
          to={redirectPath}
          className="inline-block text-center px-8 py-3 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 transition-all font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Go to Homepage
        </Link>
      </div>
      <p className="mt-8 text-sm text-gray-400 select-none">
        © {new Date().getFullYear()} Opennest. All rights reserved.
      </p>
    </div>
  );
}
