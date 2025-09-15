import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import CallToActionSection from "@/components/CallToActionSection";
import DepartmentsSection from "@/components/DepartmentsSection";
import DoctorsSection from "@/components/DoctorsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ConsultationSection from "@/components/ConsultationSection";
import PricingSection from "@/components/PricingSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <CallToActionSection />
      <DepartmentsSection />
      <DoctorsSection />
      <TestimonialsSection />
      <ConsultationSection />
      <PricingSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;