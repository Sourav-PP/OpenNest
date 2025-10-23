import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { adminApi } from '@/services/api/admin';
import { handleApiError } from '@/lib/utils/handleApiError';
import { generalMessages } from '@/messages/GeneralMessages';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { IGetAdminDashboardTotalsResponseData } from '@/types/api/admin';
import { useNavigate } from 'react-router-dom';
import { adminFrontendRoutes } from '@/constants/frontendRoutes/adminFrontendRoutes';
import { Calendar, DollarSign, Stethoscope, Users } from 'lucide-react';

const AdminDashboardTotals = () => {
  const navigate = useNavigate();
  const [totals, setTotals] = useState<IGetAdminDashboardTotalsResponseData | null>(null);

  const fetchTotals = useCallback(async () => {
    try {
      const res = await adminApi.getDashboardTotals();

      if (!res.data) {
        toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR);
        return;
      }

      setTotals(res.data);
    } catch (error) {
      handleApiError(error);
    }
  }, []);

  useEffect(() => {
    fetchTotals();
  }, [fetchTotals]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 mb-10">
      <h2 className="text-2xl font-semibold text-white mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          className="bg-admin-bg-box border-gray-700 rounded-xl shadow-lg hover:border-blue-400/40 hover:shadow-xl transition-all duration-300"
          onClick={() => navigate(adminFrontendRoutes.users)}
        >
          <CardHeader className="flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-400" />
            <CardTitle className="text-gray-300 text-lg">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">{totals ? totals.users : '...'}</p>
          </CardContent>
        </Card>

        <Card
          className="bg-admin-bg-box border-gray-700 rounded-xl shadow-lg hover:border-purple-400/40 hover:shadow-xl transition-all duration-300"
          onClick={() => navigate(adminFrontendRoutes.psychologists)}
        >
          <CardHeader className="flex items-center gap-3">
            <Stethoscope className="w-6 h-6 text-purple-400" />
            <CardTitle className="text-gray-300 text-lg">Total Psychologists</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">{totals ? totals.psychologists : '...'}</p>
          </CardContent>
        </Card>

        <Card
          className="bg-admin-bg-box border-gray-700 rounded-xl shadow-lg hover:border-orange-400/40 hover:shadow-xl transition-all duration-300"
          onClick={() => navigate(adminFrontendRoutes.sessions)}
        >
          <CardHeader className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-orange-400" />
            <CardTitle className="text-gray-300 text-lg">Total Consultations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">{totals ? totals.consultations : '...'}</p>
          </CardContent>
        </Card>

        <Card className="bg-admin-bg-box border-gray-700 rounded-xl shadow-lg hover:border-green-400/40 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-green-400" />
            <CardTitle className="text-gray-300 text-lg">Platform Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-400">{totals ? `$${totals.revenue}` : '...'}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardTotals;
