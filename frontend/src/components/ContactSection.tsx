import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const contactSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactSection = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Here you would make an API call to your backend
      console.log("Contact form data:", data);
      // Example API call:
      // await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      alert("Message sent successfully! We'll get back to you soon.");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };
  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Contact Us
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get in touch with us for appointments, inquiries, or emergency care. 
            We're here to help you 24/7.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-card border-0 shadow-soft">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <div className="p-2 bg-primary rounded-lg">
                    <Phone className="h-5 w-5 text-primary-foreground" />
                  </div>
                  Phone Numbers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-2">
                <p className="text-muted-foreground">Main: +91 98765 43210</p>
                <p className="text-muted-foreground">Emergency: +91 98765 43211</p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-gradient-card border-0 shadow-soft">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <div className="p-2 bg-accent rounded-lg">
                    <Mail className="h-5 w-5 text-accent-foreground" />
                  </div>
                  Email Address
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-2">
                <p className="text-muted-foreground">info@petcareclinic.com</p>
                <p className="text-muted-foreground">appointments@petcareclinic.com</p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-gradient-card border-0 shadow-soft">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <div className="p-2 bg-primary rounded-lg">
                    <MapPin className="h-5 w-5 text-primary-foreground" />
                  </div>
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground">
                  123 Pet Care Avenue<br />
                  Sector 15, Gurgaon<br />
                  Haryana 122001, India
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-gradient-card border-0 shadow-soft">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <div className="p-2 bg-accent rounded-lg">
                    <Clock className="h-5 w-5 text-accent-foreground" />
                  </div>
                  Working Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-2">
                <p className="text-muted-foreground">Mon - Fri: 8:00 AM - 8:00 PM</p>
                <p className="text-muted-foreground">Saturday: 9:00 AM - 5:00 PM</p>
                <p className="text-muted-foreground">Sunday: Emergency Only</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8 bg-gradient-card border-0 shadow-medium">
              <CardHeader className="p-0 mb-8">
                <CardTitle className="text-2xl text-foreground">
                  Send us a Message
                </CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </CardHeader>
              
              <CardContent className="p-0">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input 
                        id="firstName"
                        {...register("firstName")}
                        placeholder="Enter your first name"
                        className="mt-1 bg-background border-border focus:border-primary"
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input 
                        id="lastName"
                        {...register("lastName")}
                        placeholder="Enter your last name"
                        className="mt-1 bg-background border-border focus:border-primary"
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input 
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="Enter your email"
                        className="mt-1 bg-background border-border focus:border-primary"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input 
                        id="phone"
                        type="tel"
                        {...register("phone")}
                        placeholder="Enter your phone number"
                        className="mt-1 bg-background border-border focus:border-primary"
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input 
                      id="subject"
                      {...register("subject")}
                      placeholder="Enter subject"
                      className="mt-1 bg-background border-border focus:border-primary"
                    />
                    {errors.subject && (
                      <p className="text-sm text-red-600 mt-1">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea 
                      id="message"
                      {...register("message")}
                      placeholder="Enter your message"
                      rows={6}
                      className="mt-1 bg-background border-border focus:border-primary resize-none"
                    />
                    {errors.message && (
                      <p className="text-sm text-red-600 mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    variant="medical" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;