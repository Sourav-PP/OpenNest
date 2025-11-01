import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AnimatedTitle from '@/components/animation/AnimatedTitle';
import ReusableTable from '@/components/user/ReusableTable';
import { psychologistApi } from '@/services/api/psychologist';
import { generalMessages } from '@/messages/GeneralMessages';
import { handleApiError } from '@/lib/utils/handleApiError';
import { Star } from 'lucide-react';
import type { ITopConsultationDto } from '@/types/dtos/consultation';
import { formatDateOnly } from '@/lib/utils/dateTimeFormatter';
import { getCloudinaryUrlSafe, imageColumn, textColumn } from '@/components/user/TableColumns';
import type { Column } from '@/types/dtos/table';

const TopRatedConsultationsTable = () => {
  const [consultation, setConsultation] = useState<ITopConsultationDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        setLoading(true);
        const res = await psychologistApi.getTopConsultations(5);

        if (!res.data) {
          toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR);
          return;
        }

        setConsultation(res.data);
      } catch (err) {
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, []);

  const topConsultationColumns: Column<ITopConsultationDto>[] = [
    {
      header: 'SI',
      render: (_: ITopConsultationDto, index: number) => index + 1,
      className: 'ps-4',
    },

    imageColumn<ITopConsultationDto>(
      'Image',
      c => getCloudinaryUrlSafe(c.patient.profileImage),
      'px-6 py-4'
    ),

    textColumn<ITopConsultationDto>('Name', c => c.patient.name, 'px-6 py-4'),

    textColumn<ITopConsultationDto>(
      'Email',
      c => formatDateOnly(c.consultation.startDateTime),
      'px-6 py-4'
    ),

    textColumn<ITopConsultationDto>(
      'Total Consultations',
      c => formatDateOnly(c.consultation.endDateTime),
      'px-6 py-4'
    ),

    {
      header: 'Rating',
      render: c => (
        <div className="flex items-center justify-center gap-1 font-semibold border-none">
          <span>{c.rating?.toFixed(1) ?? '—'}</span>
          <Star fill="#FACC15" stroke="none" size={16} />
        </div>
      ),
      className: 'text-center',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="relative h-10 w-10 animate-spin" style={{ animationDuration: '1.2s' }}>
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="absolute h-2 w-2 bg-gray-300 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${index * 45}deg) translateY(-18px)`,
              }}
            ></div>
          ))}
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <AnimatedTitle>
        <h2 className="text-3xl sm:text-4xl font-bold text-primaryText mb-6 tracking-tight text-start">
          Top Rated Consultations
        </h2>
      </AnimatedTitle>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <ReusableTable
          data={consultation}
          columns={topConsultationColumns}
          emptyMessage="No users found."
          className="overflow-x-auto rounded-lg"
        />
      </div>
    </div>
  );
};

export default TopRatedConsultationsTable;
