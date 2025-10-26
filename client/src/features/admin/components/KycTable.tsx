import { useEffect, useState } from 'react';
import type { IAdminKycDto } from '@/types/api/admin';
import { adminApi } from '@/services/api/admin';
import { handleApiError } from '@/lib/utils/handleApiError';
import ReusableTable from '@/components/admin/ReusableTable';
import CustomPagination from '@/components/admin/CustomPagination';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import Filters from '@/components/admin/Filters';
import { SortFilter, type SortFilterType } from '@/constants/types/SortFilter';
import { KycStatusColors, KycStatusFilter, type KycStatusFilterType, type KycStatusType } from '@/constants/types/Kyc';
import { adminFrontendRoutes } from '@/constants/frontendRoutes/adminFrontendRoutes';
import { actionColumn, getCloudinaryUrlSafe, imageColumn, textColumn } from '@/components/user/TableColumns';
import type { Column } from '@/types/dtos/table';

const ITEM_PER_PAGE = 10;

const getStatusVariant = (status: KycStatusType) => {
  return KycStatusColors[status] || 'bg-gray-600/50 text-gray-300';
};

const kycColumns: Column<IAdminKycDto>[] = [
  imageColumn<IAdminKycDto>('Image', item => getCloudinaryUrlSafe(item.profileImage), 'px-6 py-4'),

  textColumn<IAdminKycDto>('Name', item => item.psychologistName, 'px-6 py-4'),

  textColumn<IAdminKycDto>('Email', item => item.psychologistEmail, 'px-6 py-4'),

  textColumn<IAdminKycDto>('Qualification', item => item.qualification, 'px-6 py-4'),

  {
    header: 'Status',
    render: (item: IAdminKycDto) => (
      <Badge className={`${getStatusVariant(item.status)} px-3 py-1 rounded-full`}>
        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
      </Badge>
    ),
    className: 'px-6 py-4',
  },

  actionColumn<IAdminKycDto>(
    'Action',
    item => {}, 
    item => (
      <Link to={adminFrontendRoutes.kycDetails(item.psychologistId)}>
        <button className="bg-admin-extra-light px-4 py-1 rounded-full text-white hover:bg-gray-600">View</button>
      </Link>
    ),
    'px-6 py-4'
  ),
];

const kycFilterConfig = [
  {
    type: 'search' as const,
    key: 'search',
    placeholder: 'Search by name or email',
  },
  {
    type: 'select' as const,
    key: 'sort',
    placeholder: 'Sort by',
    options: [
      { label: 'Newest First', value: SortFilter.Desc },
      { label: 'Oldest First', value: SortFilter.Asc },
    ],
  },
  {
    type: 'select' as const,
    key: 'status',
    placeholder: 'Filter by status',
    options: [
      { label: 'All Status', value: KycStatusFilter.ALL },
      { label: 'Pending', value: KycStatusFilter.PENDING },
      { label: 'Rejected', value: KycStatusFilter.REJECTED },
      { label: 'Approved', value: KycStatusFilter.APPROVED },
    ],
  },
];

const KycTable = () => {
  const [kyc, setKyc] = useState<IAdminKycDto[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<{
    search: string;
    status: KycStatusFilterType;
    sort: SortFilterType;
  }>({
    search: '',
    status: KycStatusFilter.ALL,
    sort: SortFilter.Desc,
  });

  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(delay);
  }, [filters.search]);

  useEffect(() => {
    const fetchKyc = async () => {
      try {
        setLoading(true);
        const data = await adminApi.getAllKycDetails({
          search: debouncedSearch,
          sort: filters.sort,
          status: filters.status || undefined,
          limit: ITEM_PER_PAGE,
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
  }, [currentPage, debouncedSearch, filters.sort, filters.status]);

  const totalPages = Math.ceil(totalCount / ITEM_PER_PAGE);

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
      <Filters
        config={kycFilterConfig}
        values={filters}
        onChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
        resetPage={() => setCurrentPage(1)}
      />
      <ReusableTable
        data={kyc}
        columns={kycColumns}
        emptyMessage="No KYC submissions found."
        className="bg-admin-bg-secondary rounded-xl shadow-lg overflow-hidden"
      />
      <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default KycTable;
