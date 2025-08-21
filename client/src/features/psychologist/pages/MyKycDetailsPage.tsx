import Header from '../../../components/psychologist/Header';
import Sidebar from '../../../components/psychologist/Sidebar';
import KycDetails from '../components/KycDetails';

const MyKycDetailsPage = () => {
  return (
    <div className="relative flex h-screen w-full bg-transparent text-primaryText">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header/>
        <KycDetails />
      </div>
    </div>
  );
};

export default MyKycDetailsPage;
