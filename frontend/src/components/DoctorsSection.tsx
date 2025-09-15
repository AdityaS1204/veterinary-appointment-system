import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Calendar } from "lucide-react";
import doctor1 from "@/assets/doctor-1.jpg";
import doctor2 from "@/assets/doctor-2.jpg";
import doctor3 from "@/assets/doctor-3.jpg";
import doctor4 from "@/assets/doctor-4.jpg";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AppointmentModal from "./AppointmentModal";
import { useState } from "react";

const doctors = [
  {
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    experience: "15 years",
    rating: 4.9,
    image: doctor1,
    description: "Specialized in cardiovascular diseases and heart surgery with extensive experience in complex procedures.",
  },
  {
    name: "Dr. Michael Chen",
    specialty: "Neurologist", 
    experience: "12 years",
    rating: 4.8,
    image: doctor2,
    description: "Expert in neurological disorders with focus on innovative treatments and patient care excellence.",
  },
  {
    name: "Dr. James Wilson",
    specialty: "Pediatrician",
    experience: "10 years", 
    rating: 4.9,
    image: doctor3,
    description: "Dedicated to children's health with gentle care approach and expertise in developmental pediatrics.",
  },
  {
    name: "Dr. Emily Davis",
    specialty: "Surgeon",
    experience: "18 years",
    rating: 5.0,
    image: doctor4,
    description: "Leading surgeon with expertise in minimally invasive procedures and advanced surgical techniques.",
  },
];

const DoctorsSection = () => {
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
    <section id="doctors" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Our Qualified Doctors
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet our team of experienced and dedicated healthcare professionals 
            committed to providing you with the highest quality medical care.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doctor, index) => (
            <Card key={index} className="group bg-background border-0 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      {doctor.rating}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="text-center space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {doctor.name}
                    </h3>
                    <p className="text-primary font-medium">{doctor.specialty}</p>
                    <p className="text-sm text-muted-foreground">{doctor.experience} Experience</p>
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {doctor.description}
                  </p>
                  
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary"
                    onClick={handleBookAppointment}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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

export default DoctorsSection;