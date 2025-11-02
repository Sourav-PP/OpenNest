import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parseISO } from 'date-fns';
import CustomTimePicker from '@/components/psychologist/CustomTimePicker';
import { useForm } from 'react-hook-form';
import { slotSchema, type slotData } from '@/lib/validations/psychologist/slotValidation';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import { psychologistApi } from '@/services/api/psychologist';
import { CalendarIcon } from 'lucide-react';
import { handleApiError } from '@/lib/utils/handleApiError';

const weekDays = [
  { label: 'Mon', value: 'MO' },
  { label: 'Tue', value: 'TU' },
  { label: 'Wed', value: 'WE' },
  { label: 'Thu', value: 'TH' },
  { label: 'Fri', value: 'FR' },
  { label: 'Sat', value: 'SA' },
  { label: 'Sun', value: 'SU' },
];

interface CreateSlotFormProps {
  onSlotCreated?: () => void; // optional callback
}

const CreateSlotForm: React.FC<CreateSlotFormProps> = ({ onSlotCreated }) => {
  const form = useForm<slotData>({
    defaultValues: {
      isRecurring: false,
      weekDays: [],
      fromDate: '',
      toDate: '',
      startDateTime: '',
      endDateTime: '',
      startTime: '',
      endTime: '',
      duration: null,
    },
    resolver: zodResolver(slotSchema),
  });

  const { control, watch, handleSubmit, reset } = form;

  const isRecurring = watch('isRecurring');

  const onSubmit = async (data: slotData) => {
    try {
      if (isRecurring) {
        data.startDateTime = '';
        data.endDateTime = '';
        await psychologistApi.createRecurringSlot({
          fromDate: data.fromDate!,
          toDate: data.toDate!,
          weekDays: data.weekDays!,
          startTime: data.startTime!,
          endTime: data.endTime!,
          duration: data.duration!,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
        reset();
      } else {
        data.fromDate = '';
        data.toDate = '';
        data.weekDays = [];
        data.startTime = '';
        data.endTime = '';
        data.duration = null;
        await psychologistApi.createSingleSlot({
          startDateTime: data.startDateTime!,
          endDateTime: data.endDateTime!,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
        reset();
      }
      onSlotCreated?.();
      toast.success('Slot created successfully');
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <div className=" py-12 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-white shadow-lg rounded-3xl border border-gray-100 animate-fadeIn">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-8 text-center tracking-tight">
          Create New Slot
        </h2>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={control}
              name="isRecurring"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="h-5 w-5 border-2 border-gray-300 rounded-md text-blue-600 focus:ring-blue-500 transition-colors duration-200"
                    />
                  </FormControl>
                  <FormLabel className="text-base font-semibold text-gray-700 !mt-0">Recurring Slot</FormLabel>
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
                      <FormLabel className="text-sm font-semibold text-gray-700">From Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full justify-between text-left font-normal bg-white border-gray-200 hover:bg-gray-50 transition-all duration-300 rounded-lg text-gray-700"
                            >
                              {field.value ? (
                                format(parseISO(field.value), 'PPP')
                              ) : (
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
                            onSelect={date => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
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
                      <FormLabel className="text-sm font-semibold text-gray-700">To Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full justify-between text-left font-normal bg-white border-gray-200 hover:bg-gray-50 transition-all duration-300 rounded-lg text-gray-700"
                            >
                              {field.value ? (
                                format(parseISO(field.value), 'PPP')
                              ) : (
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
                            onSelect={date => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                            autoFocus
                            className="rounded-xl"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-red-500 text-sm mt-1" />
                    </FormItem>
                  )}
                />

                {/* Weekdays */}
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700">Select Weekdays</FormLabel>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
                    {weekDays.map(day => (
                      <FormField
                        key={day.value}
                        control={control}
                        name="weekDays"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(day.value)}
                                onCheckedChange={checked => {
                                  const prev = field.value || [];
                                  field.onChange(checked ? [...prev, day.value] : prev.filter(v => v !== day.value));
                                }}
                                className="h-5 w-5 border-2 border-gray-300 rounded-md text-blue-600 focus:ring-blue-500 transition-colors duration-200"
                              />
                            </FormControl>
                            <FormLabel className="text-sm text-gray-600 font-medium">{day.label}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage className="text-red-500 text-sm mt-2" />
                </FormItem>

                {/* Time Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">Start Time</FormLabel>
                        <FormControl className="border-gray-200">
                          <CustomTimePicker
                            value={field.value}
                            onChange={field.onChange}
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
                        <FormLabel className="text-sm font-semibold text-gray-700">End Time</FormLabel>
                        <FormControl className="border-gray-200">
                          <CustomTimePicker
                            value={field.value}
                            onChange={field.onChange}
                            className="w-full border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-lg"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Duration */}
                <FormField
                  control={control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ''}
                          onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                          className="w-full border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-lg transition-all duration-300"
                          placeholder="e.g., 60"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm mt-1" />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <>
                {/* Single Slot DateTime Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="startDateTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">Start Date & Time</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            {...field}
                            value={field.value || ''}
                            className="w-full border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-lg transition-all duration-300"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="endDateTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">End Date & Time</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            {...field}
                            value={field.value || ''}
                            className="w-full border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-lg transition-all duration-300"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            >
              Create Slot
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateSlotForm;
