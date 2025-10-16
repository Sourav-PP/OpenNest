import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import PayoutHistoryTable from '../components/PayoutHistoryTable';

const PayoutHistoryPage = () => {
  return (
    <div className="flex h-screen w-full bg-admin-bg-secondary text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <PayoutHistoryTable />
      </div>
    </div>
  );
};

export default PayoutHistoryPage;
