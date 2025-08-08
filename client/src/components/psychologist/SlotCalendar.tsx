import { useState, useEffect } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { psychologistApi } from "@/server/api/psychologist";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { ISlotDto } from "@/types/slot";
import { toast } from "react-toastify";
import SlotDetailModal from "./SlotDetailModal";

type SlotEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
};

const SlotCalendar = () => {
  const [events, setEvents] = useState<SlotEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ISlotDto | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchSlots = async () => {
    try {
      const slots = await psychologistApi.getPsychologistSlots();
      const mapped = slots.map((slot: ISlotDto) => ({
        id: slot.id,
        title: slot.isBooked ? "Booked" : "Available",
        start: slot.startDateTime,
        end: slot.endDateTime,
        backgroundColor: slot.isBooked ? "#ef4444" : "#10b981",
        borderColor: slot.isBooked ? "#ef4444" : "#10b981",
        textColor: "#ffffff",
        allDay: false,
        extendedProps: {
          isBooked: slot.isBooked,
          bookedBy: slot.bookedBy, // if exists
          startTime: slot.startDateTime,
          endTime: slot.endDateTime,
        },
      }));
      setEvents(mapped);
    } catch (error) {
      toast.error("Error fetching slots");
      console.log('Error fetching slots: ', error);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleDelete = async () => {
    console.log("its here")
    console.log("selected event: ", selectedEvent)
    if(!selectedEvent || !selectedEvent?.id) return 
    console.log("its here also")

    try {
      const res = await psychologistApi.deleteSlotByPsychologist({slotId: selectedEvent.id})
      console.log('res: ', res)
      if(res.success) {
        toast.success(res.message)
        setIsModalOpen(false)
        setSelectedEvent(null)   
        await fetchSlots()  
      } else {
        toast.error(res.message)
      }
    } catch (error) {
      toast.error("Error deleting slots");
      console.log('Error fetching slots: ', error);
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
    <Card className="mt-12 mx-2 sm:mx-4 md:mx-6 lg:mx-auto max-w-7xl bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-3xl border border-gray-100">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          My Slots
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="overflow-x-auto">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            allDaySlot={false}
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
            events={events}
            height="auto"
            eventContent={({ event }) => {
              const { isBooked, bookedBy, notes } = event.extendedProps;
              const startTime = new Date(event.start!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const endTime = new Date(event.end!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div
                  className="rounded px-2 py-1 text-white text-[10px] sm:text-xs"
                  style={{ backgroundColor: event.backgroundColor }}
                >
                  <div className="font-semibold">
                    {isBooked ? "Booked" : "Available"}
                  </div>
                  <div className="opacity-90">
                    {startTime} - {endTime}
                  </div>
                  {isBooked && bookedBy && (
                    <div className="italic text-[10px] opacity-75">
                      By: {bookedBy.name || "User"}
                    </div>
                  )}
                  {notes && (
                    <div className="mt-1 text-[10px]">{notes}</div>
                  )}
                </div>
              );
            }}
            eventClick={({event}) => {
              const slotData: ISlotDto = {
                id: event.id,
                psychologistId: event.id,
                startDateTime: event.startStr,
                endDateTime: event.endStr,
                isBooked: event.extendedProps.isBooked,
                bookedBy: event.extendedProps.bookedBy,
              }
              setSelectedEvent(slotData)
              console.log('events: ', event)
              setIsModalOpen(true)
            }}
            dayHeaderClassNames="text-gray-700 font-medium bg-gray-50 text-xs sm:text-sm md:text-base"
            slotLabelClassNames="text-gray-600 text-xs sm:text-sm"
            eventClassNames="border-0 rounded-lg shadow-sm p-1"
            dayCellClassNames="border-gray-200"
            viewClassNames="bg-white rounded-lg"
            dayHeaderContent={({ date, view }) => {
              const isDayView = view.type === "timeGridDay";
              return (
                <div className="flex flex-col items-center">
                  <span className="text-[10px] sm:text-xs md:text-sm font-semibold">
                    {isDayView 
                      ? new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                      : new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  {!isDayView && (
                    <span className="text-[10px] sm:text-xs md:text-sm text-gray-500">
                      {new Date(date).getDate()}
                    </span>
                  )}
                </div>
              );
            }}
            slotLabelContent={({ date }) => (
              <span className="text-[10px] sm:text-xs md:text-sm">
                {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
              </span>
            )}
          />
          <SlotDetailModal 
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedEvent(null)
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