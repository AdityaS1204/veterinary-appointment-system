import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Award, Clock, Heart, Stethoscope, Shield, TestTube, Pill } from "lucide-react";
import aboutImage from "@/assets/about-vet.jpg";

const services = [
  {
    icon: Stethoscope,
    title: "Pet Health Check",
    description: "Routine health checkups and consultations for dogs, cats, and other pets.",
  },
  {
    icon: Shield,
    title: "Vaccinations & Preventive Care",
    description: "Timely vaccinations and preventive treatments to keep your pets safe from diseases.",
  },
  {
    icon: TestTube,
    title: "Pet Diagnostics",
    description: "Advanced lab tests, X-rays, and scans to detect and treat illness quickly.",
  },
  {
    icon: Pill,
    title: "Nutrition & Wellness",
    description: "Diet plans, supplements, and lifestyle guidance to keep pets active and healthy.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img 
              src={aboutImage} 
              alt="Veterinarian with pet"
              className="w-full h-[600px] object-fit rounded-2xl shadow-strong"
            />
            <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-medium">
              <div className="text-2xl font-bold">15+</div>
              <div className="text-sm">Years of Excellence</div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg text-primary font-medium">About Dr.Care</h3>
              <h2 className="text-4xl font-bold text-foreground">
                Compassionate veterinary care for your pets' health and happiness.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We provide complete medical support, preventive care, and emergency treatment 
                to ensure your pets live a long, healthy, and joyful life.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <Card key={index} className="p-6 bg-gradient-card border-0 hover:shadow-soft transition-all">
                  <div className="mb-4">
                    <service.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="text-lg font-bold text-foreground mb-2">
                    {service.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </Card>
              ))}
            </div>

            
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;