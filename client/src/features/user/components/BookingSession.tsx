import { useState, useEffect, useCallback } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { userApi } from '@/services/api/user';
import type { ISlotDto } from '@/types/dtos/slot';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import { toast } from 'react-toastify';
import type { IPsychologistProfileDto } from '@/types/dtos/psychologist';
import BookingModal from './BookingModal';
import { handleApiError } from '@/lib/utils/handleApiError';
import type { IPlanDto } from '@/types/dtos/plan';
import type { ISubscriptionDto } from '@/types/dtos/subscription';
import { Button } from '@headlessui/react';
import { formatDateTime } from '@/lib/utils/dateTimeFormatter';
import { generalMessages } from '@/messages/GeneralMessages';

const BookingSession = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { psychologistUserId } = useParams<{ psychologistUserId: string }>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [allSlots, setAllSlots] = useState<ISlotDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [psychologist, setPsychologist] = useState<IPsychologistProfileDto | null>(null);
  const [slotId, setSlotId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [plans, setPlans] = useState<IPlanDto[]>([]);
  const [activeSubscriptionPlan, setActiveSubscriptionPlan] = useState<ISubscriptionDto | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  // Helper function to get local midnight time
  const getLocalMidnight = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // fetching psychologist details
  useEffect(() => {
    if (!psychologistUserId) return;
    const fetchPsychologist = async () => {
      setLoading(true);
      try {
        const res = await userApi.getPsychologistById(psychologistUserId!);

        if (!res.data) return;
        setPsychologist(res.data?.psychologist);
      } catch (err) {
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPsychologist();
  }, [psychologistUserId]);

  // fetching slots for the selected date
  const fetchSlots = useCallback(async () => {
    if (!psychologistUserId || !selectedDate) return;

    setLoading(true);
    try {
      const dateISO = getLocalMidnight(selectedDate).toISOString();
      const res = await userApi.getSlotsByPsychologist(psychologistUserId, dateISO);

      if (!res.data) {
        toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR);
        return;
      }
      setAllSlots(res.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, [psychologistUserId, selectedDate]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  // fetching subscription plans and active subscription
  const fetchActiveSubscription = useCallback(async () => {
    if (!isAuthenticated) return;
    setSubscriptionLoading(true);
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
      setSubscriptionLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchPlansAndSubscription = async () => {
      try {
        const plansRes = await userApi.getPlans();
        if (plansRes.data) setPlans(plansRes.data);
      } catch (error) {
        handleApiError(error);
      }
    };
    fetchPlansAndSubscription();

    fetchActiveSubscription();
  }, [fetchActiveSubscription]);

  const formatTime = (utcTime: string) => {
    return new Date(utcTime).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleBookSlot = async (slotId: string) => {
    if (!isAuthenticated) {
      toast.error('Please log in to book a slot');
      return;
    }

    setSlotId(slotId);
    setModalOpen(true);
  };

  // buy plan
  const handleBuyPlan = async (planId: string) => {
    try {
      if (!psychologistUserId) {
        toast.error('Psychologist details not found');
        return;
      }
      const res = await userApi.createSubscriptionCheckoutSession(planId, psychologistUserId);
      if (!res.data || !res.data.url) {
        toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR);
        return;
      }

      window.location.href = res.data.url;
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white p-6 sm:p-8 md:p-12 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-primaryText mb-6 text-center">
          Book a Session with {psychologist?.name}
        </h1>

        {/* subscription session */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-2 text-gray-900 border-b-2 sm:border-none pb-2">Subscription Plans</h2>
          {subscriptionLoading ? (
            <p className="text-gray-600 text-lg animate-pulse">Loading subscription details...</p>
          ) : activeSubscriptionPlan ? (
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-green-200 rounded-2xl overflow-hidden w-full ml-0 mr-auto">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 pb-5 px-6">
                <div className="flex items-center justify-start gap-3">
                  <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 capitalize">
                    {activeSubscriptionPlan.plan.name}
                  </CardTitle>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      activeSubscriptionPlan.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {activeSubscriptionPlan.status}
                  </span>
                </div>
                {activeSubscriptionPlan.plan.description && (
                  <p className="mt-2 text-sm text-gray-600 text-left">{activeSubscriptionPlan.plan.description}</p>
                )}
              </CardHeader>

              <CardContent className="p-6 space-y-5 text-left">
                {/* Price */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="font-medium text-gray-700">Price</span>
                  <span className="text-lg font-bold text-primaryText">
                    {activeSubscriptionPlan.currency.toUpperCase()} {activeSubscriptionPlan.amount}
                    <span className="text-sm font-normal text-gray-500">/{activeSubscriptionPlan.plan.billingPeriod}</span>
                  </span>
                </div>

                {/* Credits + Progress Bar */}
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="font-medium text-gray-700">Credits Used</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {activeSubscriptionPlan.creditRemaining} / {activeSubscriptionPlan.creditsPerPeriod}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(
                          (activeSubscriptionPlan.creditRemaining / activeSubscriptionPlan.creditsPerPeriod) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Billing Period */}
                {activeSubscriptionPlan.currentPeriodStart && (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-3 border-t border-gray-100 gap-2">
                    <span className="font-medium text-gray-700">Billing Period</span>
                    <span className="text-sm text-gray-600">
                      {new Date(activeSubscriptionPlan.currentPeriodStart).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      to{' '}
                      {new Date(activeSubscriptionPlan.currentPeriodEnd).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}

                {/* Cancellation Notice */}
                {activeSubscriptionPlan.canceledAt && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4 text-left">
                    <p className="text-sm font-medium text-red-700 flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Subscription Canceled
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      Ends on {new Date(activeSubscriptionPlan.canceledAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className='border-b-2 pb-6'>
              <p className="text-gray-600 mb-8 sm:text-lg sm:leading-relaxed">
                No active subscription found. Choose a plan below for discounted sessions or continue with standard
                consultations.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map(plan => (
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
            </div>
          )}
        </div>

        {/* booking session */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="p-6 shadow-lg border border-gray-200 rounded-lg bg-white">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border border-gray-200 w-full"
                classNames={{
                  day_selected: 'bg-blue-600 text-white hover:bg-blue-700',
                  day_today: 'bg-blue-100 text-blue-800 font-semibold',
                  nav_button: 'h-8 w-8 bg-gray-100 hover:bg-gray-200',
                }}
                disabled={{ before: new Date() }}
              />
            </Card>
          </div>

          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex justify-center items-center mt-48 bg-white">
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
            ) : allSlots.length === 0 ? (
              <Card className="p-6 text-center bg-white shadow-md border border-gray-200 rounded-lg">
                <p className="text-gray-600 text-lg">No slots available for this day.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {allSlots.map(slot => {
                  return (
                    <Card
                      key={slot.id}
                      className="p-5 bg-white shadow-md border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-200"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-lg font-semibold text-gray-800">
                            {slot.isBooked ? (
                              <span className="text-red-500">Booked</span>
                            ) : slot.isExpired ? (
                              <span className="text-gray-400">Expired</span>
                            ) : (
                              <span className="text-green-500">Available</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {formatTime(slot.startDateTime)} - {formatTime(slot.endDateTime)}
                          </div>
                          {slot.bookedBy && slot.bookedBy.name && slot.bookedBy.name.length > 0 && (
                            <div className="text-xs italic text-gray-400 mt-2">
                              Booked by: {slot.bookedBy.name || 'User'}
                            </div>
                          )}
                        </div>

                        {!slot.isBooked && !slot.isExpired && (
                          <button
                            onClick={() => handleBookSlot(slot.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                          >
                            Book Now
                          </button>
                        )}
                      </div>
                    </Card>
                  );
                })}
                {psychologist && (
                  <BookingModal
                    isOpen={modalOpen}
                    onOpenChange={setModalOpen}
                    slotId={slotId}
                    amount={psychologist.defaultFee}
                    onSuccess={async () => {
                      if (psychologistUserId && selectedDate) {
                        const res = await userApi.getSlotsByPsychologist(psychologistUserId, selectedDate.toISOString());
                        if (!res.data) return;
                        setAllSlots(res.data);
                      }
                      await fetchActiveSubscription();
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSession;
