import { useEffect, useState } from 'react';
import { userApi } from '@/server/api/user';
import type { IPsychologistDto } from '@/types/dtos/psychologist';
import { handleApiError } from '@/lib/utils/handleApiError';
import { toast } from 'react-toastify';

interface UsePsychologistsProps {
  page: number;
  limit: number;
  search: string;
  gender: 'Male' | 'Female' | 'all';
  sort: 'asc' | 'desc';
  expertise: string;
}

export function usePsychologists({
  page,
  limit,
  search,
  gender,
  sort,
  expertise,
}: UsePsychologistsProps) {

  const [psychologists, setPsychologists] = useState<IPsychologistDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await userApi.getAllPsychologists({
          page, search, gender, sort, expertise: expertise !== 'all' ? expertise : undefined, limit
        });

        if(!res.data) {
          toast.error('something went wrong');
          return;
        }

        setPsychologists(res.data.psychologists);
        setTotalCount(res.data.totalCount ?? 0);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, search, gender, limit, sort, expertise]);

  return { psychologists, totalCount, loading};
}
