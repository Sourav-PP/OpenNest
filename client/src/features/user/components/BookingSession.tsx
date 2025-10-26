import { useState, useEffect, useCallback } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
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

    console.log('puserId: ', psychologistUserId);
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
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white p-4 sm:p-8 md:p-12 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-primaryText mb-6 text-center">
          Book a Session with {psychologist?.name}
        </h1>

        {/* subscription session */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Subscription Plans</h2>
          {subscriptionLoading ? (
            <p className="text-gray-600 text-lg animate-pulse">Loading subscription details...</p>
          ) : activeSubscriptionPlan ? (
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-2xl shadow-xl mb-6 transition-transform hover:scale-[1.02] duration-200">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                {/* Header */}
                <div>
                  <p className="text-sm text-gray-600 font-medium">Active Plan</p>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-green-900">
                    {activeSubscriptionPlan.plan.name}
                  </h3>
                </div>

                {/* Badge for plan type */}
                <span className="inline-block bg-green-200 text-green-800 text-sm font-medium px-3 py-1 rounded-full uppercase tracking-wide">
                  {activeSubscriptionPlan.plan.billingPeriod} plan
                </span>
              </div>

              {/* Plan details */}
              <div className="mt-6 space-y-3">
                <p className="text-gray-700 text-base sm:text-lg">
                  Credits Remaining: <span className="font-semibold">{activeSubscriptionPlan.creditRemaining}</span> /{' '}
                  {activeSubscriptionPlan.plan.creditsPerPeriod}
                </p>
                <p className="text-gray-600 text-sm sm:text-base">
                  Valid Until:{' '}
                  <span className="font-medium">{formatDateTime(activeSubscriptionPlan.currentPeriodEnd)}</span>
                </p>
                <p className="text-gray-600 text-sm sm:text-base">
                  Price:{' '}
                  <span className="font-medium">
                    ${activeSubscriptionPlan.plan.price} / {activeSubscriptionPlan.plan.billingPeriod}
                  </span>
                </p>
                {activeSubscriptionPlan.plan.description && (
                  <p className="text-gray-700 text-sm sm:text-base mt-2">{activeSubscriptionPlan.plan.description}</p>
                )}
              </div>

              {/* Call to action */}
              {/* <div className="mt-6">
                <button className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium shadow-md">
                  Manage Subscription
                </button>
              </div> */}
            </Card>
          ) : (
            <div>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                No active subscription found. Choose a plan below for discounted sessions or continue with standard
                consultations.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map(plan => (
                  <Card
                    key={plan.id}
                    className="p-8 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{plan.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{plan.description}</p>
                    <p className="text-3xl font-bold text-blue-700 mb-6">
                      ${plan.price.toFixed(2)}{' '}
                      <span className="text-base font-normal text-gray-500">/ {plan.billingPeriod}</span>
                    </p>
                    <Button
                      onClick={() => handleBuyPlan(plan.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors duration-200"
                    >
                      Subscribe Now
                    </Button>
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
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
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
