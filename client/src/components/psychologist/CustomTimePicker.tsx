import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parse, format } from 'date-fns';

interface CustomTimePickerProps {
  value: string | null | undefined; // expected in 24hr format: "HH:mm"
  onChange: (value: string | null) => void;
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({ value, onChange }) => {
  const parsedDate = value ? parse(value, 'HH:mm', new Date()) : null;

  const handleChange = (date: Date | null) => {
    if (!date) {
      onChange(null);
    } else {
      const time24 = format(date, 'HH:mm');
      onChange(time24);
    }
  };

  return (
    <DatePicker
      selected={parsedDate}
      onChange={handleChange}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={15}
      timeCaption="Time"
      dateFormat="h:mm aa"
      placeholderText="Select time"
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default CustomTimePicker;
