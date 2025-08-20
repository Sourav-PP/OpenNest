import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parse, format } from 'date-fns';

interface CustomTimePickerProps {
  value: string | null | undefined; // expected in 24hr format: "HH:mm"
  onChange: (value: string | null) => void;
  className?: string; // Added to allow external styling
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({ value, onChange, className }) => {
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
    <div className={`relative ${className}`}>
      <DatePicker
        selected={parsedDate}
        onChange={handleChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="Time"
        dateFormat="h:mm aa"
        placeholderText="Select time"
        className="w-full border !border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-50 transition-all duration-300"
        wrapperClassName="w-full"
        popperClassName="z-50 bg-white border border-gray-200 rounded-lg shadow-lg"
      />
    </div>
  );
};

export default CustomTimePicker;