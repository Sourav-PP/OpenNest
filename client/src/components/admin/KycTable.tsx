import { adminApi } from '@/server/api/admin';
import type { IAdminKycDto } from '@/types/api/admin';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '../ui/input';
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
        console.log('kyc data: ', data);
        setKyc(data.kycs);
        setTotalCount(data.totalCount);
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        toast.error(error.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchKyc();
  }, [currentPage, debouncedSearch, sort, status]);

  console.log('sort: ', sort);
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const getStatusVariant = (kycStatus: IAdminKycDto['kycStatus']) => {
    switch (kycStatus) {
    case 'pending':
      return 'bg-yellow-500 text-yellow-900';
    case 'approved':
      return 'bg-green-500 text-green-900';
    case 'rejected':
      return 'bg-red-500 text-red-900';
    default:
      return 'bg-gray-500 text-gray-900';
    }
  };

  if (loading) return (
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
          ></div>
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 mb-10 bg-admin-bg-secondary text-white">
      <h2 className="text-2xl font-semibold mb-6">KYC Submissions</h2>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <Input 
          placeholder="Search for Users" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="max-w-sm bg-admin-bg-box text-white border-gray-700"
        />
        <div className="flex gap-4">
          <Select value={sort} onValueChange={(value) => {
            setSort(value as 'asc' | 'desc');
          }}>
            <SelectTrigger className="bg-admin-bg-box text-white border-gray-700">
              <SelectValue placeholder="SORT BY" />
            </SelectTrigger>
            <SelectContent className="bg-admin-bg-box text-white border-gray-700">
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(value) => {
            setStatus(value as 'pending' | 'approved' | 'rejected' | 'all');
          }}>
            <SelectTrigger className="bg-admin-bg-box text-white border-gray-700">
              <SelectValue placeholder="FILTER BY" />
            </SelectTrigger>
            <SelectContent className="bg-admin-bg-box text-white border-gray-700">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table className="bg-gray-800">
        <TableHeader>
          <TableRow className="border-gray-700 bg-admin-bg-primary">
            <TableHead className="text-white">ID</TableHead>
            <TableHead className="text-white">Name</TableHead>
            <TableHead className="text-white">Email</TableHead>
            <TableHead className="text-white">Status</TableHead>
            <TableHead className="text-white">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {kyc.map((item, i) => (
            <TableRow key={item.id} className={i % 2 === 0 ? 'bg-admin-bg-secondary border-b-admin-bg-box' : 'bg-admin-bg-box'}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.psychologistName}</TableCell>
              <TableCell>{item.psychologistEmail}</TableCell>
              <TableCell>
                <Badge className={`${getStatusVariant(item.kycStatus)} px-3 py-1 rounded-full`}>
                  {item.kycStatus.charAt(0).toUpperCase() + item.kycStatus.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <Link to={`/admin/kyc/${item.psychologistId}`}>
                  <Button 
                    variant="secondary" 
                    className="bg-slate-800 text-white hover:bg-gray-600"
                  >
                                    View
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end mt-4 gap-2">
        <Button 
          variant="outline" 
          className="bg-gray-800 text-white border-gray-700"
          disabled={currentPage === 1} 
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
                    &lt;
        </Button>
        <Button 
          variant="outline" 
          className="bg-gray-800 text-white border-gray-700"
          disabled={currentPage === totalPages} 
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
                    &gt;
        </Button>
      </div>
    </div>
  );
};

export default KycTable;
