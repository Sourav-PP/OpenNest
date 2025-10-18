import { publicFrontendRoutes } from '@/constants/frontendRoutes/publicFrontendRoutes';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import { UserRole } from '@/constants/types/User';
import { psychologistFrontendRoutes } from '@/constants/frontendRoutes/psychologistFrontendRoutes';

export default function SystemError() {
  const role = useSelector((state: RootState) => state.auth.role);

  const redirectPath =
    role === UserRole.PSYCHOLOGIST ? psychologistFrontendRoutes.profile : publicFrontendRoutes.landing;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-7xl font-bold text-red-600 mb-4">System Error</h1>
      <p className="text-lg text-gray-600 mb-6">Something went wrong on our side. Please try again later.</p>
      <Link to={redirectPath} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
        Go Home
      </Link>
    </div>
  );
}
