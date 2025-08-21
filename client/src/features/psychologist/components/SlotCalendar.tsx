import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { psychologistApi } from '@/services/api/psychologist';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ISlotDto } from '@/types/dtos/slot';
import { toast } from 'react-toastify';
import SlotDetailModal from './SlotDetailModal';
import { handleApiError } from '@/lib/utils/handleApiError';

type SlotEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
};

interface SlotCalendarProps {
  slotsChanged: boolean;
}

const SlotCalendar: React.FC<SlotCalendarProps> = ({slotsChanged}) => {
  const [events, setEvents] = useState<SlotEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ISlotDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSlots = async () => {
    try {
      const slots = await psychologistApi.getPsychologistSlots();

      if (!slots || slots.length === 0) {
        toast.info('No slots available.');
        setEvents([]); 
        return;
      }

      const mapped = slots.map((slot: ISlotDto) => ({
        id: slot.id,
        title: slot.isBooked ? 'Booked' : 'Available',
        start: slot.startDateTime,
        end: slot.endDateTime,
        allDay: false,
        extendedProps: {
          isBooked: slot.isBooked,
          bookedBy: slot.bookedBy,
          startTime: slot.startDateTime,
          endTime: slot.endDateTime,
        },
      }));
      setEvents(mapped);
    } catch (error: any) {
      if (error.response?.data?.message === 'Requested slot not found') {
        toast.info('No slots available.');
        setEvents([]);
      } else {
        handleApiError(error);
      }
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [slotsChanged]);

  const handleDelete = async () => {
    if (!selectedEvent || !selectedEvent?.id) return;
    try {
      const res = await psychologistApi.deleteSlotByPsychologist({ slotId: selectedEvent.id });
      if (res.success) {
        toast.success(res.message);
        setIsModalOpen(false);
        setSelectedEvent(null);
        await fetchSlots();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const getEventStyles = (isPast: boolean, isBooked: boolean) => {
    if (isPast && !isBooked) {
      return {
        backgroundColor: '#d1d5db', // Gray for expired (past, not booked)
        borderColor: '#9ca3af',
        textColor: '#4b5563',
      };
    } else if (isPast && isBooked) {
      return {
        backgroundColor: '#fca5a5', // Light red for past booked
        borderColor: '#b91c1c',
        textColor: '#7f1d1d',
      };
    } else if (!isPast && isBooked) {
      return {
        backgroundColor: '#ef4444', // Red for upcoming booked
        borderColor: '#dc2626',
        textColor: '#ffffff',
      };
    } else {
      return {
        backgroundColor: '#3b82f6', // Blue for upcoming available
        borderColor: '#2563eb',
        textColor: '#ffffff',
      };
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 md:px-8">
      <Card className="mt-6 mx-auto max-w-7xl bg-white shadow-xl rounded-2xl border border-gray-100 animate-fadeIn">
        <CardHeader className="pb-3 px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">
            My Slots
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="overflow-x-auto">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              allDaySlot={false}
              slotMinTime="08:00:00"
              slotMaxTime="20:00:00"
              events={events}
              height="auto"
              eventContent={({ event }) => {
                const now = new Date();
                const eventEnd = event.end ?? new Date();
                const isPast = eventEnd < now;
                const { isBooked, notes } = event.extendedProps;
                const startTime = new Date(event.start!).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });
                const endTime = new Date(event.end!).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                const styles = getEventStyles(isPast, isBooked);

                return (
                  <div
                    className={`rounded-md px-1.5 py-1 text-[9px] xs:text-[10px] sm:text-xs font-medium shadow-sm w-full h-full transition-all duration-200 ${
                      isPast ? 'opacity-75' : 'hover:opacity-90'
                    }`}
                    style={{
                      backgroundColor: styles.backgroundColor,
                      color: styles.textColor,
                      border: `1px solid ${styles.borderColor}`,
                    }}
                  >
                    <div className="font-semibold truncate">
                      {isPast && !isBooked ? 'Expired' : isBooked ? 'Booked' : 'Available'}
                    </div>
                    <div className="opacity-90 truncate">
                      {startTime} - {endTime}
                    </div>
                    {/* {isBooked && bookedBy && (
                      <div className="italic text-[8px] xs:text-[9px] sm:text-[10px] opacity-75 truncate">
                        By: {bookedBy.name || 'User'}
                      </div>
                    )} */}
                    {notes && (
                      <div className="mt-0.5 text-[8px] xs:text-[9px] sm:text-[10px] truncate">
                        {notes}
                      </div>
                    )}
                  </div>
                );
              }}
              eventClick={({ event }) => {
                const slotData: ISlotDto = {
                  id: event.id,
                  psychologistId: event.id,
                  startDateTime: event.startStr,
                  endDateTime: event.endStr,
                  isBooked: event.extendedProps.isBooked,
                  bookedBy: event.extendedProps.bookedBy,
                };
                setSelectedEvent(slotData);
                setIsModalOpen(true);
              }}
              eventClassNames={({ event }) => {
                const now = new Date();
                const isPast = (event.end ?? new Date()) < now;
                const isBooked = event.extendedProps.isBooked;
                let classes = 'rounded-md transition-all duration-200 !bg-transparent ';
                if (isPast && !isBooked) {
                  classes += 'pointer-events-none'; // Expired
                } else if (isPast && isBooked) {
                  classes += 'pointer-events-none'; // Past booked
                } else if (!isPast && isBooked) {
                  classes += 'cursor-pointer'; // Upcoming booked
                } else {
                  classes += 'cursor-pointer'; // Upcoming available
                }
                return classes;
              }}
              eventBorderColor="transparent"
              eventBackgroundColor="transparent"
              dayHeaderClassNames="text-gray-800 font-semibold bg-gray-100 text-[10px] xs:text-xs sm:text-sm border-b border-gray-200 py-2"
              slotLabelClassNames="text-gray-600 text-[10px] xs:text-xs sm:text-sm font-medium"
              dayCellClassNames="border-gray-200 bg-white hover:bg-gray-50 transition-colors duration-200"
              viewClassNames="bg-white rounded-lg shadow-sm"
              dayHeaderContent={({ date, view }) => {
                const isDayView = view.type === 'timeGridDay';
                return (
                  <div className="flex flex-col items-center py-1.5">
                    <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">
                      {isDayView
                        ? new Date(date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })
                        : new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    {!isDayView && (
                      <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600">
                        {new Date(date).getDate()}
                      </span>
                    )}
                  </div>
                );
              }}
              slotLabelContent={({ date }) => (
                <span className="text-[10px] xs:text-xs sm:text-sm font-medium text-gray-600">
                  {date.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </span>
              )}
            />
            <SlotDetailModal
              open={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedEvent(null);
              }}
              slot={selectedEvent}
              onDelete={handleDelete}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SlotCalendar;
