import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Stethoscope, 
  Scissors, 
  Activity, 
  Eye, 
  Heart,
  TestTube,
  ClipboardCheck,
  Shield,
  Pill,
  Calendar,
  Search
} from "lucide-react";
import doctorBgImage from "@/assets/doctor-bg.jpg";

const departments = [
  {
    id: "dermatology",
    title: "Dermatology",
    heading: "Dermatology Department",
    subheading: "Skin and Coat problems are common but treatable with expert care. Our Dermatology Department helps pets stay itch-free and comfortable.",
    services: [
      {
        icon: Search,
        title: "Allergy Testing",
        description: "Identifying causes of itching, rashes, or hair loss."
      },
      {
        icon: Shield,
        title: "Skin Treatments", 
        description: "Care for bacterial, fungal and parasite-related infections."
      },
      {
        icon: Stethoscope,
        title: "Ear Care",
        description: "Treatment for ear mites, infections, and chronic conditions."
      },
      {
        icon: Activity,
        title: "Coat Health",
        description: "Solutions to improve shine, reduce dandruff, and prevent shedding."
      }
    ]
  },
  {
    id: "surgical",
    title: "Surgical",
    heading: "Surgical Department",
    subheading: "On their way to better health, pets may sometimes need surgeries for treatment or recovery. Our Surgery Department handles everything from routine operations to advanced emergency procedures.",
    services: [
      {
        icon: ClipboardCheck,
        title: "Primary Care",
        description: "Regular health checkups before and after surgery to ensure your pet's safety."
      },
      {
        icon: TestTube,
        title: "Lab Test",
        description: "Blood work, X-rays, and scans done before surgery for accurate diagnosis."
      },
      {
        icon: Search,
        title: "Symptom Check",
        description: "Evaluation of injuries, fractures, or internal issues for accurate diagnosis."
      },
      {
        icon: Heart,
        title: "Recovery Care",
        description: "Post-surgical monitoring and pain management for faster healing."
      }
    ]
  },
  {
    id: "dental",
    title: "Dental",
    heading: "Dental Department",
    subheading: "Oral health is an important part of your pet's overall well-being. Our Dental Department ensures healthy teeth and gums through expert care.",
    services: [
      {
        icon: ClipboardCheck,
        title: "Dental Checkups",
        description: "Routine examination and cleaning to prevent dental diseases."
      },
      {
        icon: Scissors,
        title: "Teeth Extraction",
        description: "Safe and painless removal of damaged or infected teeth."
      },
      {
        icon: Activity,
        title: "Oral Surgery",
        description: "Treatment for advanced oral problems and gum disorders."
      },
      {
        icon: Calendar,
        title: "Home Care Guidance",
        description: "Advice on brushing, diet, and long-term oral hygiene."
      }
    ]
  },
  {
    id: "ophthalmology",
    title: "Ophthalmology",
    heading: "Ophthalmology Department",
    subheading: "Good vision is essential for your pet's quality of life. Our Ophthalmology Department handles a wide range of eye conditions.",
    services: [
      {
        icon: Eye,
        title: "Eye Exams",
        description: "Routine checkups to detect early eye problems."
      },
      {
        icon: Scissors,
        title: "Cataract Surgery",
        description: "Restoring vision through safe and advanced procedures."
      },
      {
        icon: Shield,
        title: "Infection Treatment",
        description: "Care for conjunctivitis, corneal ulcers, and eye injuries."
      },
      {
        icon: Activity,
        title: "Vision Support",
        description: "Long-term treatment plans for chronic eye disorders."
      }
    ]
  },
  {
    id: "cardiology",
    title: "Cardiology",
    heading: "Cardiology Department",
    subheading: "Heart conditions in pets require specialized attention. Our Cardiology Department provides advanced diagnostics and treatments for heart-related issues.",
    services: [
      {
        icon: Heart,
        title: "Heart Checkups",
        description: "Screening for murmurs, irregular rhythms, and early signs of diseases."
      },
      {
        icon: TestTube,
        title: "ECG & Lab Tests",
        description: "Accurate testing for detailed cardiac evaluation."
      },
      {
        icon: Search,
        title: "Symptom Check",
        description: "Observation of breathing, fatigue, or coughing patterns."
      },
      {
        icon: Pill,
        title: "Special Treatments",
        description: "Tailored medication and care plans for long-term heart health."
      }
    ]
  }
];

const DepartmentsSection = () => {
  return (
    <section id="departments" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Clinic Departments
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our clinic offers a wide range of veterinary departments to provide complete healthcare for pets. 
            From routine checkups to advanced treatments, we ensure every pet receives specialized care tailored to their needs.
          </p>
        </div>

        <Tabs defaultValue="dermatology" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-12 bg-background border border-border">
            {departments.map((dept) => (
              <TabsTrigger 
                key={dept.id}
                value={dept.id}
                className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {dept.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {departments.map((dept) => (
            <TabsContent key={dept.id} value={dept.id}>
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-foreground">
                      {dept.heading}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {dept.subheading}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {dept.services.map((service, index) => (
                      <Card key={index} className="p-6 bg-background border-0 shadow-soft hover:shadow-medium transition-all">
                        <CardContent className="p-0">
                          <div className="mb-4">
                            <service.icon className="h-8 w-8 text-primary" />
                          </div>
                          <h4 className="text-lg font-bold text-foreground mb-2">
                            {service.title}
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {service.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <img 
                    src={doctorBgImage}
                    alt={`${dept.title} department`}
                    className="w-full h-[500px] object-cover rounded-2xl shadow-strong"
                  />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default DepartmentsSection;