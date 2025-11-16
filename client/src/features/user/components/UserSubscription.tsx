import { useCallback, useEffect, useState } from 'react';
import { userApi } from '@/services/api/user';
import AnimatedTitle from '@/components/animation/AnimatedTitle';
import { handleApiError } from '@/lib/utils/handleApiError';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ISubscriptionDto } from '@/types/dtos/subscription';
import { Link } from 'react-router-dom';
import { userFrontendRoutes } from '@/constants/frontendRoutes/userFrontendRoutes';

const UserSubscription = () => {
  const [activeSubscription, setActiveSubscriptionPlan] = useState<ISubscriptionDto | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchActiveSubscription = useCallback(async () => {
    setLoading(true);
    try {
      const subRes = await userApi.getActiveSubscription();
      if (subRes.data) {
        setActiveSubscriptionPlan(subRes.data);
      } else {
        setActiveSubscriptionPlan(null);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveSubscription();
  }, [fetchActiveSubscription]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="relative h-10 w-10 animate-spin" style={{ animationDuration: '1.2s' }}>
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="absolute h-2 w-2 bg-gray-300 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${index * 45}deg) translateY(-18px)`,
              }}
            ></div>
          ))}
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );

  return (
    <div className="px-4 sm:px-6 lg:px-12 py-8 sm:py-12 bg-gradient-to-br from-slate-200 to-white min-h-screen">
      <AnimatedTitle>
        <h2 className="text-3xl sm:text-4xl font-bold text-primaryText mb-3 tracking-tight text-start">
          Your Subscription
        </h2>
      </AnimatedTitle>
      <p className="mb-6 sm:mb-8 text-gray-600 text-sm sm:text-lg max-w-2xl leading-relaxed text-left">
        View your current active subscription plan and its details.
      </p>

      {/* === NO ACTIVE SUBSCRIPTION === */}
      {!activeSubscription ? (
        <div
          className="
            bg-white/80 backdrop-blur-sm 
            p-6 sm:p-10 
            rounded-2xl shadow-lg border border-gray-100 
            max-w-2xl 
            ml-0 mr-auto 
            flex flex-col 
            sm:items-start items-center 
            text-center sm:text-left
          "
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4 w-full">
            <div
              className="
                w-12 h-12 flex-shrink-0 
                bg-gradient-to-br from-gray-100 to-gray-200 
                rounded-full flex items-center justify-center 
                mt-0 sm:mt-1
              "
            >
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-1">
                No Active Plan
              </h3>
              <p className="text-gray-500 text-sm sm:text-base">
                You currently don’t have an active subscription. Choose a plan to get started.
              </p>
            </div>
          </div>

          <Link to={userFrontendRoutes.plans} className="w-full sm:w-auto">
            <div className="text-center sm:text-left group">
              <button
                className="
                  btn-primary 
                  w-full sm:w-auto 
                  px-6 py-2.5 
                  text-sm font-medium 
                  rounded-full 
                  group-hover:animate-glow-ring 
                  transition-all
                "
              >
                Explore Plans
              </button>
            </div>
          </Link>
        </div>

      ) : (
        /* === ACTIVE SUBSCRIPTION CARD === */
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border-0 rounded-2xl overflow-hidden max-w-2xl ml-0 mr-auto">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 pb-5 px-6">
            <div className="flex items-center justify-start gap-3">
              <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 capitalize">
                {activeSubscription.plan.name}
              </CardTitle>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  activeSubscription.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {activeSubscription.status}
              </span>
            </div>
            {activeSubscription.plan.description && (
              <p className="mt-2 text-sm text-gray-600 text-left">{activeSubscription.plan.description}</p>
            )}
          </CardHeader>

          <CardContent className="p-6 space-y-5 text-left">
            {/* Price */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <span className="font-medium text-gray-700">Price</span>
              <span className="text-lg font-bold text-primaryText">
                {activeSubscription.currency.toUpperCase()} {activeSubscription.amount}
                <span className="text-sm font-normal text-gray-500">/{activeSubscription.plan.billingPeriod}</span>
              </span>
            </div>

            {/* Credits + Progress Bar */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="font-medium text-gray-700">Credits Used</span>
                <span className="text-sm font-semibold text-gray-800">
                  {activeSubscription.creditRemaining} / {activeSubscription.creditsPerPeriod}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(
                      (activeSubscription.creditRemaining / activeSubscription.creditsPerPeriod) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Billing Period */}
            {activeSubscription.currentPeriodStart && (
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-3 border-t border-gray-100 gap-2">
                <span className="font-medium text-gray-700">Billing Period</span>
                <span className="text-sm text-gray-600">
                  {new Date(activeSubscription.currentPeriodStart).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  to{' '}
                  {new Date(activeSubscription.currentPeriodEnd).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}

            {/* Cancellation Notice */}
            {activeSubscription.canceledAt && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4 text-left">
                <p className="text-sm font-medium text-red-700 flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Subscription Canceled
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Ends on {new Date(activeSubscription.canceledAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserSubscription;
