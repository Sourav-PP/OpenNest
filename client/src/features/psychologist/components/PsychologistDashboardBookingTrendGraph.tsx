import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { handleApiError } from '@/lib/utils/handleApiError';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { RevenueFilter, type RevenueFilterType } from '@/constants/types/SortFilter';
import type { IPsychologistBookingTrend } from '@/types/dtos/consultation';
import { generalMessages } from '@/messages/GeneralMessages';
import { psychologistApi } from '@/services/api/psychologist';
import { endOfWeek, format, startOfWeek } from 'date-fns';

const PsychologistDashboardBookingTrendGraph = () => {
  const [filter, setFilter] = useState<RevenueFilterType>(RevenueFilter.DAILY);
  const [data, setData] = useState<IPsychologistBookingTrend[]>([]);

  const formatWeekRange = (value: string) => {
    const [year, week] = value.split('-').map(Number);
    const start = startOfWeek(new Date(year, 0, (week - 1) * 7 + 1));
    const end = endOfWeek(start);
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`;
  };

  const fetchRevenueStats = async (filterValue: RevenueFilterType) => {
    try {
      const res = await psychologistApi.getBookingTrend(filterValue);
    
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
    fetchRevenueStats(filter);
  }, [filter]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <Card className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 p-0 space-y-4 sm:space-y-0">
          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-start">Booking trend</h2>

          {/* Filter */}
          <Select value={filter} onValueChange={(val: any) => setFilter(val)}>
            <SelectTrigger className="w-full sm:w-32 bg-gray-50 text-gray-900 border-gray-300 text-sm sm:text-base focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200">
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
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Total Completed consultations</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {data.reduce((sum: number, item: any) => sum + (item.completed || 0), 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Total cancelled consultations</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {data.reduce((sum: number, item: any) => sum + (item.cancelled || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs sm:text-sm text-gray-500 mb-1">Period</p>
              <p className="text-gray-700 font-medium text-sm sm:text-base">{filter}</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={250} className="min-h-[200px] sm:min-h-[300px]">
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                tick={{ fill: '#6b7280', fontSize: 'clamp(10px, 1.5vw, 12px)' }}
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
                stroke="#6b7280"
                tick={{ fill: '#6b7280', fontSize: 'clamp(10px, 1.5vw, 12px)' }}
                tickFormatter={value => `${value}`}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  color: '#1f2937',
                  fontSize: 'clamp(12px, 1.5vw, 14px)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: number) => [`${value.toLocaleString()} consultations`, '']}
              />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ color: '#374151', fontSize: 'clamp(12px, 1.5vw, 14px)' }}
              />

              {/* completed */}
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 1, r: 3 }}
                name="completed"
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
    </div>
  );
};

export default PsychologistDashboardBookingTrendGraph;
