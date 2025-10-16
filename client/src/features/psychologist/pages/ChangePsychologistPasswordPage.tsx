import Header from '@/components/psychologist/Header';
import Sidebar from '@/components/psychologist/Sidebar';
import ChangePsychologistPassword from '../components/ChangePsychologistPassword';

const ChangePsychologistPasswordPage = () => {
  return (
    <div className="relative flex h-screen w-full bg-transparent text-primaryText">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <ChangePsychologistPassword />
      </div>
    </div>
  );
};

export default ChangePsychologistPasswordPage;
