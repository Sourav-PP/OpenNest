import { handleApiError } from '@/lib/utils/handleApiError';
import { generalMessages } from '@/messages/GeneralMessages';
import { adminApi } from '@/services/api/admin';
import type { IGetAdminDashboardTotalsResponseData } from '@/types/api/admin';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const TestimonialSection = () => {
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
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main heading */}
        <h2 className="text-2xl sm:text-2xl lg:text-3xl font-medium text-gray-700 mb-8 sm:mb-16 sm:leading-relaxed max-w-3xl mx-auto">
          OpenNest is the most preferred and trusted online counselling and therapy consultation platform in India
        </h2>

        {/* Statistics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
        
          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold text-gray-700 sm:mb-3">{totals ? totals.users : '...'}</div>
            <p className="text-gray-600 text-sm lg:text-lg">No. of people healed</p>
          </div>

          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold text-gray-700 sm:mb-3">{totals ? totals.psychologists : '...'}</div>
            <p className="text-gray-600 text-sm lg:text-lg">Therapists ready to help</p>
          </div>

          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold text-gray-700 sm:mb-3">{totals ? totals.consultations : '...'}</div>
            <p className="text-gray-600 text-sm lg:text-lg">No. of sessions given</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
