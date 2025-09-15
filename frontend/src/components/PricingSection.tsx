import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Heart, Shield, Clock, Users } from "lucide-react";

const pricingPlans = [
  {
    id: "basic",
    name: "Basic Care",
    price: "₹299",
    period: "per visit",
    description: "Essential veterinary care for routine checkups and minor treatments",
    popular: false,
    features: [
      "General health checkup",
      "Basic vaccination",
      "Deworming treatment",
      "Basic grooming consultation",
      "Dietary advice",
      "Follow-up consultation (1 week)"
    ],
    icon: Heart,
    color: "border-blue-200 hover:border-blue-300",
    buttonColor: "bg-blue-600 hover:bg-blue-700"
  },
  {
    id: "premium",
    name: "Premium Care",
    price: "₹599",
    period: "per visit",
    description: "Comprehensive care with advanced diagnostics and specialized treatments",
    popular: true,
    features: [
      "Complete health examination",
      "All vaccinations included",
      "Blood tests & diagnostics",
      "Dental cleaning",
      "Parasite treatment",
      "Emergency consultation (24/7)",
      "Priority appointment booking",
      "Follow-up consultation (2 weeks)",
      "Health certificate"
    ],
    icon: Star,
    color: "border-primary hover:border-primary/80",
    buttonColor: "bg-primary hover:bg-primary/90"
  },
  {
    id: "elite",
    name: "Elite Care",
    price: "₹999",
    period: "per visit",
    description: "Premium veterinary care with advanced treatments and personalized service",
    popular: false,
    features: [
      "Comprehensive health assessment",
      "Advanced diagnostics (X-ray, Ultrasound)",
      "Specialized treatments",
      "Surgical procedures",
      "Post-surgery care",
      "24/7 emergency support",
      "Home visit service",
      "Monthly health reports",
      "Lifetime health tracking",
      "Priority emergency response"
    ],
    icon: Shield,
    color: "border-purple-200 hover:border-purple-300",
    buttonColor: "bg-purple-600 hover:bg-purple-700"
  }
];

const additionalServices = [
  {
    name: "Emergency Care",
    price: "₹1,500",
    description: "24/7 emergency veterinary services",
    icon: Clock
  },
  {
    name: "Home Visit",
    price: "₹800",
    description: "Veterinary consultation at your home",
    icon: Users
  },
  {
    name: "Surgery",
    price: "₹2,500+",
    description: "Minor to major surgical procedures",
    icon: Shield
  }
];

const PricingSection = () => {
  const handlePlanSelect = (planId: string) => {
    // Here you would handle the plan selection
    console.log(`Selected plan: ${planId}`);
    // Example: Redirect to booking page or open modal
  };

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Affordable Pet Care Plans
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Choose the perfect care plan for your pet's needs. All our plans include 
            professional veterinary care with transparent pricing and no hidden costs.
          </p>
        </div>

        {/* Main Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative p-8 bg-background border-2 ${plan.color} transition-all hover:shadow-strong ${
                plan.popular ? 'scale-105 shadow-medium' : 'shadow-soft'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center p-0 mb-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-muted rounded-full">
                    <plan.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  {plan.name}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">{plan.period}</span>
                </div>
                <p className="text-muted-foreground mt-2 text-sm">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="p-0">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${plan.buttonColor} text-white`}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  Choose {plan.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Services */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Additional Services
          </h3>
          <p className="text-muted-foreground">
            Specialized services available as needed
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {additionalServices.map((service, index) => (
            <Card key={index} className="p-6 bg-background border-0 shadow-soft hover:shadow-medium transition-all">
              <CardContent className="p-0 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-muted rounded-full">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  {service.name}
                </h4>
                <p className="text-2xl font-bold text-primary mb-2">
                  {service.price}
                </p>
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pricing Note */}
        <div className="mt-16 text-center">
          <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
            <CardContent className="p-0">
              <h4 className="text-lg font-semibold text-foreground mb-2">
                Transparent Pricing
              </h4>
              <p className="text-muted-foreground">
                All prices include GST. No hidden charges. Payment accepted via UPI, cards, and cash.
                We also accept pet insurance claims from major providers.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
