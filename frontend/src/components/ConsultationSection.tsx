import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Award, UserCheck, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AppointmentModal from "./AppointmentModal";
import { useState } from "react";


const stats = [
  {
    icon: Award,
    number: "15",
    label: "Years of Experience",
    color: "text-blue-600"
  },
  {
    icon: Heart,
    number: "2,500",
    label: "Happy Patients",
    color: "text-red-600"
  },
  {
    icon: UserCheck,
    number: "24",
    label: "Number of Doctors",
    color: "text-green-600"
  },
  {
    icon: Users,
    number: "120",
    label: "Number of Staff",
    color: "text-purple-600"
  }
];

const ConsultationSection = () => {
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
    <section id="consultation" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-24">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Book Your Consultation
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Schedule an appointment with our experienced veterinarians. 
            We provide comprehensive care for all types of pets with personalized treatment plans.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Appointment Booking Section */}
          <div>
            <Card className="p-8 bg-background border-0 shadow-strong">
              <CardHeader className="p-0 mb-8">
                <CardTitle className="text-2xl text-foreground">
                  Schedule Appointment
                </CardTitle>
                <p className="text-muted-foreground">
                  Book your pet's consultation with our experienced veterinarians.
                </p>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="text-center py-8">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Ready to Book?
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Click the button below to open our appointment booking form.
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleBookAppointment}
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Book Appointment Now
                  </Button>
                  
                  {!user && (
                    <p className="text-sm text-muted-foreground mt-4">
                      You'll be redirected to login if you're not signed in
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl  font-bold text-foreground mb-4">
                Why Choose Our Clinic?
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                With years of experience and a dedicated team of professionals, 
                we provide the highest quality veterinary care for your beloved pets.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="p-6 text-center bg-background border-0 shadow-soft hover:shadow-medium transition-all">
                  <CardContent className="p-0">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-muted rounded-full">
                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                    </div>
                    <h4 className="text-3xl font-bold text-foreground mb-2">
                      {stat.number}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="p-6 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0">
              <CardContent className="p-0">
                <h4 className="text-xl font-bold mb-2">Emergency Care Available</h4>
                <p className="text-primary-foreground/90 mb-4">
                  We provide 24/7 emergency services for urgent pet care needs.
                </p>
                <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
                  Call Emergency: +91 98765 43210
                </Button>
              </CardContent>
            </Card>
          </div>
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

export default ConsultationSection;
