import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppointmentModal from "./AppointmentModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    if (user) {
      setIsAppointmentModalOpen(true);
    } else {
      navigate('/login');
    }
  };

  const handleDashboardClick = () => {
    if (user?.role === 'DOCTOR') {
      navigate('/doctor-dashboard');
    } else {
      navigate('/patient-dashboard');
    }
  };

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      {/* Main Navigation */}
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Dr.<span className="text-primary">Care</span>
            </h1>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <a href="#home" className="text-foreground hover:text-primary transition-smooth">Home</a>
          <a href="#about" className="text-foreground hover:text-primary transition-smooth">About</a>
          <a href="#departments" className="text-foreground hover:text-primary transition-smooth">Departments</a>
          <a href="#doctors" className="text-foreground hover:text-primary transition-smooth">Doctors</a>
          <a href="#pricing" className="text-foreground hover:text-primary transition-smooth">Pricing</a>
          <a href="#contact" className="text-foreground hover:text-primary transition-smooth">Contact</a>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button 
                variant="medical" 
                className="hidden md:inline-flex"
                onClick={handleBookAppointment}
              >
                Book Appointment
              </Button>
              <Button 
                variant="outline" 
                className="hidden md:inline-flex"
                onClick={handleDashboardClick}
              >
                <User className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={logout}
                className="hidden md:inline-flex"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="medical" 
                className="hidden md:inline-flex"
                onClick={handleBookAppointment}
              >
                Book Appointment
              </Button>
              <Link to="/login">
                <Button variant="medical" className="hidden md:inline-flex bg-orange-500 hover:bg-orange-600">
                  Sign In
                </Button>
              </Link>
            </>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            <a href="#home" className="block text-foreground hover:text-primary transition-smooth">Home</a>
            <a href="#about" className="block text-foreground hover:text-primary transition-smooth">About</a>
            <a href="#departments" className="block text-foreground hover:text-primary transition-smooth">Departments</a>
            <a href="#doctors" className="block text-foreground hover:text-primary transition-smooth">Doctors</a>
            <a href="#pricing" className="block text-foreground hover:text-primary transition-smooth">Pricing</a>
            <a href="#contact" className="block text-foreground hover:text-primary transition-smooth">Contact</a>
            
            {user ? (
              <>
                <Button variant="medical" className="w-full mt-4" onClick={handleBookAppointment}>
                  Book Appointment
                </Button>
                <Button variant="outline" className="w-full" onClick={handleDashboardClick}>
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button variant="ghost" className="w-full" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="medical" className="w-full mt-4" onClick={handleBookAppointment}>
                  Book Appointment
                </Button>
                <Link to="/login" className="block">
                  <Button variant="medical" className="w-full bg-orange-500 hover:bg-orange-600">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}

      {/* Appointment Modal */}
      <AppointmentModal 
        isOpen={isAppointmentModalOpen} 
        onClose={() => setIsAppointmentModalOpen(false)} 
      />
    </header>
  );
};

export default Header;