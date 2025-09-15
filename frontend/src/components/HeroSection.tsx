import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Play, Calendar, Shield, Award } from "lucide-react";
import heroBgImage from "@/assets/hero-bg.jpg";
import bg2Image from "@/assets/bg-2.jpg";
import Autoplay from "embla-carousel-autoplay";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AppointmentModal from "./AppointmentModal";
import { useState } from "react";

const HeroSection = () => {
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

  const slides = [
    {
      background: heroBgImage,
      heading: "We Care About Your Pet Health",
      subheading: "Your pet health is our top priority with comprehensive, affordable medical",
      buttonText: "Book Appointment",
      buttonIcon: Calendar
    },
    {
      background: bg2Image,
      heading: "Helping Your Stay Happy One",
      subheading: "Everyday we bring hope and smile to patients we serve",
      buttonText: "View Our Work",
      buttonIcon: Play,
      scrollTo: "#testimonials"
    }
  ];

  return (
    <section id="home" className="relative min-h-[80vh]">
      <Carousel
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="w-full h-full"
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div 
                className="relative min-h-[80vh] bg-cover bg-center bg-no-repeat flex items-center"
                style={{ backgroundImage: `url(${slide.background})` }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent"></div>
                
                <div className="relative z-10 container mx-auto px-4 py-20">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <h2 className="text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
                          {slide.heading}
                        </h2>
                        <p className="text-lg text-primary-foreground/90 max-w-lg">
                          {slide.subheading}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button 
                          variant="accent" 
                          size="lg" 
                          className="text-base px-8 py-6 bg-orange-500 hover:bg-orange-600"
                          onClick={() => {
                            if (slide.buttonText === "Book Appointment") {
                              handleBookAppointment();
                            } else if (slide.scrollTo) {
                              document.querySelector(slide.scrollTo)?.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                        >
                          <slide.buttonIcon className="mr-2 h-5 w-5" />
                          {slide.buttonText}
                        </Button>
                       
                      </div>

                      <div className="grid grid-cols-3 gap-6 pt-8">
                        <div className="text-center">
                          <div className="bg-background/10 backdrop-blur-sm rounded-lg p-4 mb-2">
                            <Shield className="h-8 w-8 text-accent-light mx-auto" />
                          </div>
                          <h4 className="text-primary-foreground font-semibold">Safe & Secure</h4>
                          <p className="text-primary-foreground/80 text-sm">100% Safe</p>
                        </div>
                        <div className="text-center">
                          <div className="bg-background/10 backdrop-blur-sm rounded-lg p-4 mb-2">
                            <Award className="h-8 w-8 text-accent-light mx-auto" />
                          </div>
                          <h4 className="text-primary-foreground font-semibold">Top Vets</h4>
                          <p className="text-primary-foreground/80 text-sm">Expert Care</p>
                        </div>
                        <div className="text-center">
                          <div className="bg-background/10 backdrop-blur-sm rounded-lg p-4 mb-2">
                            <Calendar className="h-8 w-8 text-accent-light mx-auto" />
                          </div>
                          <h4 className="text-primary-foreground font-semibold">24/7 Support</h4>
                          <p className="text-primary-foreground/80 text-sm">Always Here</p>
                        </div>
                      </div>
                    </div>

                    <div className="hidden lg:block">
                      {/* Additional content space for the right side if needed */}
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
      />
    </section>
  );
};

export default HeroSection;