import Header from '../../../components/psychologist/Header';
import Sidebar from '../../../components/psychologist/Sidebar';
import PsychologistReviews from '../components/PsychologistReviews';

const PsychologistReviewsPage = () => {
  return (
    <div className="relative flex h-screen w-full bg-transparent text-primaryText">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <PsychologistReviews />
      </div>
    </div>
  );
};

export default PsychologistReviewsPage;
