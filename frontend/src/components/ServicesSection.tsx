import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Stethoscope, Pill, Activity, Baby, Eye } from "lucide-react";

const services = [
  {
    icon: Heart,
    title: "Cardiology",
    description: "Expert heart care and cardiovascular treatments with advanced technology and compassionate care.",
  },
  {
    icon: Stethoscope,
    title: "General Medicine", 
    description: "Comprehensive primary care services for adults and families with preventive health focus.",
  },
  {
    icon: Pill,
    title: "Pharmacy",
    description: "Full-service pharmacy with prescription medications, health consultations and wellness products.",
  },
  {
    icon: Activity,
    title: "Emergency Care",
    description: "24/7 emergency medical services with rapid response and state-of-the-art emergency facilities.",
  },
  {
    icon: Baby,
    title: "Pediatrics",
    description: "Specialized medical care for infants, children, and adolescents with child-friendly environment.",
  },
  {
    icon: Eye,
    title: "Ophthalmology",
    description: "Complete eye care services including vision correction, eye surgery and preventive treatments.",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Our Medical Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide comprehensive healthcare services with the latest medical technology 
            and experienced healthcare professionals dedicated to your wellbeing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-2 bg-gradient-card border-0">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-gradient-primary rounded-full w-fit group-hover:scale-110 transition-transform">
                  <service.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;