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

const BookingSession = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { id } = useParams<{ id: string }>();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [allSlots, setAllSlots] = useState<ISlotDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [psychologist, setPsychologist] = useState<IPsychologistProfileDto | null>(null);
  const [slotId, setSlotId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const getLocalMidnight = (date: Date) => {
    const d = new Date(date);
    d.setHours(0,0,0,0);
    return d;
  };

  useEffect(() => {
    if (!id) return;

    const fetchPsychologist = async () => {
      setLoading(true);
      try {
        const res = await userApi.getPsychologistById(id!);

        if (!res.data) return;
        setPsychologist(res.data?.psychologist);
      } catch (err) {
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPsychologist();
  }, [id]);

  const fetchSlots = useCallback(async () => {
    if (!id || !selectedDate) return;

    setLoading(true);
    try {
      const dateISO = getLocalMidnight(selectedDate).toISOString();
      const res = await userApi.getSlotsByPsychologist(id, dateISO);

      console.log('slots: ',res);
      if(!res.data) {
        toast.error('Something went wrong');
        return;
      }
      setAllSlots(res.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, [id, selectedDate]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white p-4 sm:p-8 md:p-12 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-primaryText mb-6 text-center">
          Book a Session with {psychologist?.name}
        </h1>
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
                      if (id && selectedDate) {
                        const res = await userApi.getSlotsByPsychologist(
                          id,
                          selectedDate.toISOString()
                        );
                        if (!res.data) return;
                        setAllSlots(res.data);
                      }
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
