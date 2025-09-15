import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-lg">D</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Dr.Care</h1>
                <p className="text-xs text-primary-foreground/80">Medical Center</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              Providing exceptional healthcare services with compassionate care. 
              Your health and wellbeing are our top priorities.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-accent hover:text-accent-foreground">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-accent hover:text-accent-foreground">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-accent hover:text-accent-foreground">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-accent hover:text-accent-foreground">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#home" className="text-primary-foreground/80 hover:text-accent-light transition-colors">Home</a></li>
              <li><a href="#about" className="text-primary-foreground/80 hover:text-accent-light transition-colors">About Us</a></li>
              <li><a href="#services" className="text-primary-foreground/80 hover:text-accent-light transition-colors">Services</a></li>
              <li><a href="#doctors" className="text-primary-foreground/80 hover:text-accent-light transition-colors">Doctors</a></li>
              <li><a href="#departments" className="text-primary-foreground/80 hover:text-accent-light transition-colors">Departments</a></li>
              <li><a href="#contact" className="text-primary-foreground/80 hover:text-accent-light transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-primary-foreground/80 hover:text-accent-light transition-colors">Cardiology</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-accent-light transition-colors">General Medicine</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-accent-light transition-colors">Emergency Care</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-accent-light transition-colors">Pediatrics</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-accent-light transition-colors">Surgery</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-accent-light transition-colors">Pharmacy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent-light mt-0.5" />
                <div>
                  <p className="text-primary-foreground/80">123 Medical Center Drive</p>
                  <p className="text-primary-foreground/80">New York, NY 10001</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent-light" />
                <p className="text-primary-foreground/80">+1 (555) 123-4567</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent-light" />
                <p className="text-primary-foreground/80">info@drcare.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/20">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-foreground/80 text-sm">
            © 2024 Dr.Care Medical Center. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-primary-foreground/80 hover:text-accent-light text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-primary-foreground/80 hover:text-accent-light text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-primary-foreground/80 hover:text-accent-light text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;