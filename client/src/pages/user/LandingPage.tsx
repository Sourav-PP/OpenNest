import Navbar from '../../components/user/Navbar'
import HeroSection from '../../components/user/HeroSection'
import ServiceSection from '../../components/user/ServiceSection'
import DescriptionSection from '../../components/user/DescriptionSection'
import TherapySection from '../../components/user/TherapySection'
import TestimonialSection from '../../components/user/TestimonialSection'
import Footer from '../../components/user/Footer'

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
  )
}

export default LandingPage
