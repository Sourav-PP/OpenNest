import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
 } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {format, parseISO} from 'date-fns'

import { useForm } from "react-hook-form";
import {
  slotSchema,
  type slotData,
} from "../../lib/validations/psychologist/slotValidation";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { psychologistApi } from "../../server/api/psychologist";
import type { AxiosError } from "axios";
import { CalendarIcon } from "lucide-react";

const weekDays = [
  { label: "Mon", value: "MO" },
  { label: "Tue", value: "TU" },
  { label: "Wed", value: "WE" },
  { label: "Thu", value: "TH" },
  { label: "Fri", value: "FR" },
  { label: "Sat", value: "SA" },
  { label: "Sun", value: "SU" },
];

const CreateSlotForm = () => {
  const form = useForm<slotData>({
    defaultValues: {
      isRecurring: false,
      weekDays: [],
      fromDate: "",
      toDate: "",
      startDateTime: "",
      endDateTime: "",
      startTime: "",
      endTime: "",
      duration: null,
    },
    resolver: zodResolver(slotSchema),
  });

  const {control, watch, handleSubmit, reset} = form

  const isRecurring = watch("isRecurring");

  const onSubmit = async (data: slotData) => {
    try {

      if (isRecurring) {
        data.startDateTime = ""
        data.endDateTime = ""
        console.log('recurring slot data: ', data)
        const res = await psychologistApi.createRecurringSlot({
          fromDate: data.fromDate!,
          toDate: data.toDate!,
          weekDays: data.weekDays!,
          startTime: data.startTime!,
          endTime: data.endTime!,
          duration: data.duration!,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
        console.log('res', res)
        reset()
      } else {
        data.fromDate = "";
        data.toDate = "";
        data.weekDays = [];
        data.startTime = "";
        data.endTime = "";
        data.duration = null;

        console.log('single slot data', data)
        
        await psychologistApi.createSingleSlot({
          startDateTime: data.startDateTime!,
          endDateTime: data.endDateTime!,
        });
        reset()
      }

      toast.success("Slot created successfully");
    } catch (err) {
        console.log("errororiere: ", err)
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-gradient-to-br from-white to-gray-50 shadow-2xl rounded-3xl border border-gray-100">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 tracking-tight">
        Create New Slot
      </h2>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8  ">
            <FormField
              control={control}
              name="isRecurring"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3">
                  <FormControl>
                    <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="h-5 w-5 border-2 border-gray-300 rounded-md"
                    />                    
                  </FormControl>
                  <FormLabel className="text-lg font-medium text-gray-700 !mt-0">Recurring Slot</FormLabel>
                </FormItem>
              )}
            />

            {isRecurring ? (
              <>
                {/* From Date */}
                <FormField
                  control={control}
                  name="fromDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm font-medium text-gray-700">From Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                            variant="outline"
                            className="w-full justify-between text-left font-normal bg-white border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                              {field.value ? format(parseISO(field.value), "PPP") : (
                              <span className="text-gray-400">Pick a date</span>
                            )}
                              <CalendarIcon className="ml-2 h-5 w-5 text-gray-500" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 bg-white border border-gray-200 rounded-xl shadow-lg">
                          <Calendar
                            mode="single"
                            selected={field.value ? parseISO(field.value) : undefined}
                            onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                            autoFocus
                            className="rounded-xl"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-red-500 text-sm mt-1" />
                    </FormItem>
                  )}
                />

                {/* To Date */}
                <FormField
                  control={control}
                  name="toDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm font-medium text-gray-700">To Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                            variant="outline"
                            className="w-full justify-between text-left font-normal bg-white border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                              {field.value ? format(parseISO(field.value), "PPP") : (
                              <span className="text-gray-400">Pick a date</span>
                            )}
                              <CalendarIcon className="ml-2 h-5 w-5 text-gray-500" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 bg-white border border-gray-200 rounded-xl shadow-lg">
                          <Calendar
                            mode="single"
                            selected={field.value ? parseISO(field.value) : undefined}
                            onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                            autoFocus
                            className="rounded-xl"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-red-500 text-sm mt-1"/>
                    </FormItem>
                  )}
                />

                {/* Weekdays */}
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Select Weekdays</FormLabel>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                    {weekDays.map((day) => (
                      <FormField
                      key={day.value}
                      control={control}
                      name="weekDays"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(day.value)}
                              onCheckedChange={(checked) => {
                                const prev = field.value || [];
                                field.onChange(
                                  checked
                                    ? [...prev, day.value]
                                    : prev.filter((v) => v !== day.value)
                                );
                              }}
                              className="h-5 w-5 border-2 border-gray-300 rounded-md"
                            />
                          </FormControl>
                          <FormLabel className="text-sm text-gray-600">{day.label}</FormLabel>
                        </FormItem>
                      )}
                    />
                    ))}
                  </div>
                  <FormMessage className="text-red-500 text-sm mt-1">{form.formState.errors.weekDays?.message}</FormMessage>
                </FormItem>

                {/* Time Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Start Time</FormLabel>
                      <FormControl>
                        <Input 
                          type="time" 
                          {...field} 
                          className="w-full border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-lg"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm mt-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">End Time</FormLabel>
                      <FormControl>
                        <Input 
                          type="time" 
                          {...field} 
                          className="w-full border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-lg"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm mt-1" />
                    </FormItem>
                  )}
                />
              </div>

                <FormField
                  control={control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" 
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                          className="w-full border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <>
                <FormField
                  control={control}
                  name="startDateTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Start Date & Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" 
                          {...field}
                          value={field.value || ""}
                          className="w-full border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-lg"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm mt-1"/>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="endDateTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">End Date & Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" 
                          {...field}
                          value={field.value || ""}
                          className="w-full border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-lg"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm mt-1"/>
                    </FormItem>
                  )}
                />
              </>
            )}

            <Button type="submit" className="w-full mt-4">
              Create Slot
            </Button>
          </form>
        </Form>
    </div>
  );
};

export default CreateSlotForm;
