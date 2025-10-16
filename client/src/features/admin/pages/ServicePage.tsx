import AddServiceForm from '@/features/admin/components/AddServiceForm';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import ServiceTable from '@/features/admin/components/ServiceTable';

const ServicePage = () => {
  return (
    <div className="flex h-screen w-full bg-admin-bg-secondary text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <AddServiceForm />
        <ServiceTable />
      </div>
    </div>
  );
};

export default ServicePage;
