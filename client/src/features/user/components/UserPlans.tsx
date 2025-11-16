import { useEffect, useState } from 'react';
import { userApi } from '@/services/api/user';
import AnimatedTitle from '@/components/animation/AnimatedTitle';
import { handleApiError } from '@/lib/utils/handleApiError';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { userFrontendRoutes } from '@/constants/frontendRoutes/userFrontendRoutes';
import type { IPlanDto } from '@/types/dtos/plan';
import { generalMessages } from '@/messages/GeneralMessages';

const UserPlans = () => {
  const [plans, setPlans] = useState<IPlanDto[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPlans = async () => {
    try {
      const res = await userApi.getPlans();
      
      if (res.data) setPlans(res.data);
    } catch (error) {
      handleApiError(error);
      toast.error('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleBuyPlan = async (planId: string) => {
    try {
      const res = await userApi.createSubscriptionCheckoutSession(planId);
      if (!res.data || !res.data.url) {
        toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR);
        return;
      }

      window.location.href = res.data.url;
    } catch (error) {
      handleApiError(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <Loader2 className="h-10 w-10 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-12 py-8 sm:py-12 bg-gradient-to-br from-slate-200 to-white min-h-screen">
      <AnimatedTitle>
        <h2 className="text-3xl sm:text-4xl font-bold text-primaryText mb-3 tracking-tight text-start">
          Choose Your Plan
        </h2>
      </AnimatedTitle>
      <p className="mb-6 sm:mb-8 text-gray-600 text-sm sm:text-lg max-w-2xl">
        Select the plan that best fits your therapy or consultation needs.
      </p>

      {plans.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow text-center text-gray-500">
          No plans are currently available.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className="relative bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800 capitalize">
                  {plan.name}
                </CardTitle>
                {plan.description && <p className="text-sm text-gray-500">{plan.description}</p>}
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between text-gray-700 text-sm">
                  <span className="font-medium">Price:</span>
                  <span>
                    {plan.currency.toUpperCase()} {plan.price}/{plan.billingPeriod}
                  </span>
                </div>

                <div className="flex justify-between text-gray-700 text-sm">
                  <span className="font-medium">Credits:</span>
                  <span>{plan.creditsPerPeriod}</span>
                </div>
                <div className='group'>
                  <button
                    className="btn-primary w-full px-6 py-2.5 text-sm font-medium rounded-full group-hover:animate-glow-ring transition-all"
                    onClick={() => handleBuyPlan(plan.id)}
                  >
                    Subscribe
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPlans;
