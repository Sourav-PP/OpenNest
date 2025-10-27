import { useEffect, useState } from 'react';
import { adminApi } from '@/services/api/admin';
import { toast } from 'react-toastify';
import { handleApiError } from '@/lib/utils/handleApiError';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { RevenueFilter, type RevenueFilterType } from '@/constants/types/SortFilter';
import type { IBookingTrendDto } from '@/types/dtos/consultation';
import { generalMessages } from '@/messages/GeneralMessages';
import { endOfWeek, format, startOfWeek } from 'date-fns';

const AdminDashboardBookingTrendGraph = () => {
  const [filter, setFilter] = useState<RevenueFilterType>(RevenueFilter.DAILY);
  const [data, setData] = useState<IBookingTrendDto[]>([]);

  const formatWeekRange = (value: string) => {
    const [year, week] = value.split('-').map(Number);
    const start = startOfWeek(new Date(year, 0, (week - 1) * 7 + 1));
    const end = endOfWeek(start);
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`;
  };

  const fetchBookingTrendStats = async (filterValue: RevenueFilterType) => {
    try {
      const res = await adminApi.getBookingTrend(filterValue);
      if (!res.data) {
        toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR);
        return;
      }
      setData(res.data);
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    fetchBookingTrendStats(filter);
  }, [filter]);

  return (
    <Card className="bg-admin-bg-secondary rounded-xl p-4 sm:p-6 border-none">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 p-0 space-y-4 sm:space-y-0">
        {/* Title */}
        <h2 className="text-lg sm:text-xl font-semibold text-white">Booking Trend Overview</h2>

        {/* Filter */}
        <Select value={filter} onValueChange={(val: any) => setFilter(val)}>
          <SelectTrigger className="w-full sm:w-32 bg-gray-800 text-white border-gray-700 text-sm sm:text-base">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={RevenueFilter.DAILY}>Daily</SelectItem>
            <SelectItem value={RevenueFilter.WEEKLY}>Weekly</SelectItem>
            <SelectItem value={RevenueFilter.MONTHLY}>Monthly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="space-y-2">
            <div>
              <p className="text-xs sm:text-sm text-gray-400 mb-1">Total Bookings</p>
              <p className="text-lg sm:text-2xl font-bold text-white">
                {data.reduce((sum: number, item: any) => sum + (item.totalBookings || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs sm:text-sm text-gray-400 mb-1">Period</p>
            <p className="text-white font-medium text-sm sm:text-base">{filter}</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={250} className="min-h-[200px] sm:min-h-[300px]">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis
              dataKey="date"
              stroke="#ccc"
              tick={{ fill: '#ccc', fontSize: 'clamp(10px, 1.5vw, 12px)' }}
              tickFormatter={value => {
                if (filter === RevenueFilter.WEEKLY) return formatWeekRange(value);
                const date = new Date(value);
                return isNaN(date.getTime())
                  ? ''
                  : date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: filter === RevenueFilter.DAILY ? undefined : '2-digit',
                  });
              }}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#ccc"
              tick={{ fill: '#ccc', fontSize: 'clamp(10px, 1.5vw, 12px)' }}
              tickFormatter={value => `${value}`}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: 'clamp(12px, 1.5vw, 14px)',
              }}
              labelFormatter={(value) => {
                if (filter === RevenueFilter.WEEKLY) return formatWeekRange(value);
                const date = new Date(value);
                return isNaN(date.getTime())
                  ? ''
                  : date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: filter === RevenueFilter.MONTHLY ? '2-digit' : undefined,
                  });
              }}
              formatter={(value: number) => [`${value.toLocaleString()} bookings`, '']}
            />
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{ color: '#fff', fontSize: 'clamp(12px, 1.5vw, 14px)' }}
            />

            {/* booked or completed*/}
            <Line
              type="monotone"
              dataKey="completedOrBooked"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 1, r: 3 }}
              name="completed / upcoming"
              activeDot={{ r: 5, stroke: '#10b981', strokeWidth: 1 }}
            />

            {/* cancelled */}
            <Line
              type="monotone"
              dataKey="cancelled"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: '#ef4444', strokeWidth: 1, r: 3 }}
              name="cancelled"
              activeDot={{ r: 5, stroke: '#ef4444', strokeWidth: 1 }}
            />

          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AdminDashboardBookingTrendGraph;
