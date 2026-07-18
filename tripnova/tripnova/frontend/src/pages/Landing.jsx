import LandingNavbar from '../components/landing/LandingNavbar.jsx';
import Hero from '../components/landing/Hero.jsx';
import DestinationsSection from '../components/landing/DestinationsSection.jsx';
import FeaturesSection from '../components/landing/FeaturesSection.jsx';
import HowItWorksSection from '../components/landing/HowItWorksSection.jsx';
import TestimonialsSection from '../components/landing/TestimonialsSection.jsx';
import FAQSection from '../components/landing/FAQSection.jsx';
import Footer from '../components/landing/Footer.jsx';

export default function Landing() {
  return (
    <div className="min-h-screen">
      <LandingNavbar />
      <Hero />
      <DestinationsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
