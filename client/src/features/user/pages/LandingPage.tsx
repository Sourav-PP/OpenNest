import Navbar from '@/components/user/Navbar';
import HeroSection from '../components/HeroSection';
import ServiceSection from '../components/ServiceSection';
import DescriptionSection from '../components/DescriptionSection';
import TherapySection from '../components/TherapySection';
import TestimonialSection from '../components/TestimonialSection';
import Footer from '@/components/user/Footer';


const LandingPage = () => {
  return (
    <>
      <Navbar />
      <HeroSection />  
      <DescriptionSection />
      <ServiceSection /> 
      <TherapySection />
      <TestimonialSection />
      <Footer />
    </>
  );
};

export default LandingPage;
