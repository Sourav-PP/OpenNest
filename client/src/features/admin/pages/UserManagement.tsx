import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
// import UserTable from '../../components/admin/UserTable';
import UserTable from '@/features/admin/components/UserTable';

const UserManagement = () => {
  return (
    <div className="flex h-screen w-full bg-admin-bg-secondary text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <UserTable />
      </div>
    </div>
  );
};

export default UserManagement;
