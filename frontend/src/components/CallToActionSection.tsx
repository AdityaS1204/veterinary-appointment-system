import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import bg3Image from "@/assets/bg-3.jpg";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AppointmentModal from "./AppointmentModal";
import { useState } from "react";

const CallToActionSection = () => {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    if (user) {
      setIsAppointmentModalOpen(true);
    } else {
      navigate('/login');
    }
  };

  return (
    <section 
      className="relative py-20 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bg3Image})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent"></div>
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight">
            We Provide Free Health Care Consultation
          </h2>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
            Your Health is Our Top Priority with Comprehensive, Affordable medical.
          </p>
          <Button 
            variant="accent" 
            size="lg" 
            className="text-base bg-orange-500 hover:bg-orange-600 px-8 py-6"
            onClick={handleBookAppointment}
          >
            <Calendar className="mr-2 h-5 w-5" />
            Book Appointment
          </Button>
        </div>
      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
      />
    </section>
  );
};

export default CallToActionSection;