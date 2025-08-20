// hooks/useServices.ts
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { serviceApi } from '@/server/api/service';
import { handleApiError } from '@/lib/utils/handleApiError';

export type Service = {
  id: string;
  name: string;
  description: string;
  bannerImage: string;
};

export const useServices = (search: string) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await serviceApi.getAll({ page: currentPage, limit: itemsPerPage, search: search });
      if (!res.data) {
        toast.error('Something went wrong');
        return;
      }
      const mapped = res.data.services.map((service: Service) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        bannerImage: service.bannerImage,
      }));
      setServices(mapped);
      setTotalCount(res.data.totalCount ?? 0);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const totalPage = Math.ceil(totalCount / itemsPerPage);

  return { services, loading, currentPage, setCurrentPage, totalPage, totalCount, refetch: fetchServices };
};
