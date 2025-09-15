import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Patient",
    rating: 5,
    content: "The care I received at Dr.Care was exceptional. The staff was professional, caring, and made me feel comfortable throughout my treatment. Highly recommend!",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",
  },
  {
    name: "John Thompson", 
    role: "Patient",
    rating: 5,
    content: "Dr.Care Medical Center exceeded my expectations. The doctors are knowledgeable, the facilities are modern, and the service is outstanding. Five stars!",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
  },
  {
    name: "Emily Rodriguez",
    role: "Patient", 
    rating: 5,
    content: "I've been coming here for years and the quality of care has always been top-notch. The doctors take time to listen and provide excellent treatment.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-gradient-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            What Our Patients Say About Us
          </h2>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our patients have to say 
            about their experience with Dr.Care Medical Center.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-background/10 backdrop-blur-sm border-primary-foreground/20 text-primary-foreground hover:bg-background/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                  ))}
                </div>
                
                <p className="text-primary-foreground/90 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-primary-foreground/80">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-4 bg-background/10 backdrop-blur-sm rounded-full px-8 py-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-light">4.9</div>
              <div className="text-sm">Average Rating</div>
            </div>
            <div className="w-px h-12 bg-primary-foreground/30"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-light">1000+</div>
              <div className="text-sm">Happy Patients</div>
            </div>
            <div className="w-px h-12 bg-primary-foreground/30"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-light">95%</div>
              <div className="text-sm">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;