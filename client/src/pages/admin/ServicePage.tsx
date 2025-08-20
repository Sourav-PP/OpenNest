import AddServiceForm from '../../components/admin/AddServiceForm';
import Header from '../../components/admin/Header';
import Sidebar from '../../components/admin/Sidebar';
import ServiceTable from '@/components/admin/tables/ServiceTable';

const ServicePage = () => {
  return (
    <div className="flex h-screen w-full bg-admin-bg-secondary text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header/>
        <AddServiceForm/>
        <ServiceTable/>
      </div>
    </div>
  );
};

export default ServicePage;
