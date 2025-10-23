import { useEffect, useState } from 'react';
import { adminApi } from '@/services/api/admin';
import { toast } from 'react-toastify';
import { handleApiError } from '@/lib/utils/handleApiError';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { RevenueFilter, type RevenueFilterType } from '@/constants/types/SortFilter';
import type { IRevenueStatDto } from '@/types/dtos/consultation';
import { generalMessages } from '@/messages/GeneralMessages';

const AdminDashboardRevenueGraph = () => {
  const [filter, setFilter] = useState<RevenueFilterType>(RevenueFilter.DAILY);
  const [data, setData] = useState<IRevenueStatDto[]>([]);

  const fetchRevenueStats = async (filterValue: RevenueFilterType) => {
    try {
      const res = await adminApi.getRevenueStats(filterValue);
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
    <Card className="bg-admin-bg-secondary rounded-xl p-4 sm:p-6 border-none">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 p-0 space-y-4 sm:space-y-0">
        {/* Title */}
        <h2 className="text-lg sm:text-xl font-semibold text-white">Revenue Overview</h2>

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
              <p className="text-xs sm:text-sm text-gray-400 mb-1">Total Revenue</p>
              <p className="text-lg sm:text-2xl font-bold text-white">
                ${data.reduce((sum: number, item: any) => sum + (item.adminProfit || 0), 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-400 mb-1">Total Psychologist Payout</p>
              <p className="text-lg sm:text-2xl font-bold text-white">
                ${data.reduce((sum: number, item: any) => sum + (item.psychologistPayout || 0), 0).toLocaleString()}
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
              tickFormatter={value => `$${value}`}
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
              formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
            />
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{ color: '#fff', fontSize: 'clamp(12px, 1.5vw, 14px)' }}
            />

            {/* Admin Profit */}
            <Line
              type="monotone"
              dataKey="adminProfit"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 1, r: 3 }}
              name="Admin Profit"
              activeDot={{ r: 5, stroke: '#10b981', strokeWidth: 1 }}
            />

            {/* Psychologist Payout */}
            <Line
              type="monotone"
              dataKey="psychologistPayout"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 1, r: 3 }}
              name="Psychologist Payout"
              activeDot={{ r: 5, stroke: '#3b82f6', strokeWidth: 1 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AdminDashboardRevenueGraph;
