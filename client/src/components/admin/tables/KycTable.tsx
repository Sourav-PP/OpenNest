import { useEffect, useState } from 'react';
import type { IAdminKycDto } from '@/types/api/admin';
import { adminApi } from '@/server/api/admin';
import { handleApiError } from '@/lib/utils/handleApiError';
import KycFilters from './KycFilters';
import ReusableTable from './ReusableTable';
import CustomPagination from './CustomPagination';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const KycTable = () => {
  const [kyc, setKyc] = useState<IAdminKycDto[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected' | 'all'>('all');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    const fetchKyc = async () => {
      try {
        setLoading(true);
        const data = await adminApi.getAllKycDetails({
          search: debouncedSearch,
          sort: sort,
          status: status,
          limit: itemsPerPage,
          page: currentPage,
        });
        setKyc(data.kycs);
        setTotalCount(data.totalCount);
      } catch (err) {
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchKyc();
  }, [currentPage, debouncedSearch, sort, status]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const getStatusVariant = (status: IAdminKycDto['status']) => {
    switch (status) {
    case 'pending':
      return 'bg-yellow-900/50 text-yellow-500';
    case 'approved':
      return 'bg-green-900/50 text-green-500';
    case 'rejected':
      return 'bg-red-900/50 text-red-500';
    default:
      return 'bg-gray-900/50 text-gray-500';
    }
  };

  const columns = [
    {
      header: 'ID',
      render: (item: IAdminKycDto) => item.id,
      className: 'px-6 py-4',
    },
    {
      header: 'Name',
      render: (item: IAdminKycDto) => item.psychologistName,
      className: 'px-6 py-4',
    },
    {
      header: 'Email',
      render: (item: IAdminKycDto) => item.psychologistEmail,
      className: 'px-6 py-4',
    },
    {
      header: 'Status',
      render: (item: IAdminKycDto) => (
        <Badge className={`${getStatusVariant(item.status)} px-3 py-1 rounded-full`}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Badge>
      ),
      className: 'px-6 py-4',
    },
    {
      header: 'Action',
      render: (item: IAdminKycDto) => (
        <Link to={`/admin/kyc/${item.psychologistId}`}>
          <button
            className="bg-admin-extra-light px-4 py-1 rounded-full text-white hover:bg-gray-600"
          >
            view
          </button>
        </Link>
      ),
      className: 'px-6 py-4',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-admin-bg-secondary">
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
            />
          ))}
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 mb-10 bg-admin-bg-secondary text-white">
      <h2 className="text-2xl font-semibold mb-6">KYC Submissions</h2>
      <KycFilters
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
        status={status}
        setStatus={setStatus}
        setCurrentPage={setCurrentPage}
      />
      <ReusableTable
        data={kyc}
        columns={columns}
        emptyMessage="No KYC submissions found."
        className="bg-admin-bg-secondary rounded-xl shadow-lg overflow-hidden"
      />
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default KycTable;
