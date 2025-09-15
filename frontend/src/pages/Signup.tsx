import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { UserPlus, Eye, EyeOff, Heart, Shield, Users, Stethoscope } from 'lucide-react';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['DOCTOR', 'PATIENT'], {
    required_error: 'Please select a role',
  }),
  phone: z.string().min(10, 'Please enter a valid phone number').optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const selectedRole = watch('role') as 'DOCTOR' | 'PATIENT';

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    try {
      const result = await signup({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        phone: data.phone
      });

      if (result.success) {
        // Redirect based on role
        if (data.role === 'DOCTOR') {
          navigate('/doctor-dashboard');
        } else {
          navigate('/patient-dashboard');
        }
      } else {
        alert('Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred during signup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Signup Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center my-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 ring-1 rounded-full">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    Dr.<span className="text-primary">Care</span>
                  </h1>
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">
              Join our veterinary care platform
            </p>
          </div>

          {/* Signup Form */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Role Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">I am a:</Label>
                  <RadioGroup
                    onValueChange={(value) => setValue('role', value as 'DOCTOR' | 'PATIENT')}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="PATIENT" id="PATIENT" />
                      <Label htmlFor="patient" className="text-sm font-medium text-gray-700">Pet Owner</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="DOCTOR" id="DOCTOR" />
                      <Label htmlFor="doctor" className="text-sm font-medium text-gray-700">Doctor</Label>
                    </div>
                  </RadioGroup>
                  {errors.role && (
                    <p className="text-sm text-red-600">{errors.role.message}</p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="Enter your full name"
                    className="mt-2 h-12 border-gray-300 focus:border-primary focus:ring-primary"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="Enter your email"
                    className="mt-2 h-12 border-gray-300 focus:border-primary focus:ring-primary"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    placeholder="Enter your phone number"
                    className="mt-2 h-12 border-gray-300 focus:border-primary focus:ring-primary"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password *
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      placeholder="Enter your password"
                      className="h-12 border-gray-300 focus:border-primary focus:ring-primary pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm Password *
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirmPassword')}
                      placeholder="Confirm your password"
                      className="h-12 border-gray-300 focus:border-primary focus:ring-primary pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-1"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{' '}
                    <a href="#" className="text-primary hover:text-primary/80">
                      Terms and Conditions
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-primary hover:text-primary/80">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Section - Image/Content */}
      <div className="hidden lg:flex lg:flex-1 relative">
        {/* Background Image - Different from login page */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        </div>
        
        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-6">
              Join Our Veterinary Family
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Whether you're a pet owner or a veterinary professional, 
              join our community dedicated to exceptional pet care.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="p-3 bg-white/20 rounded-full mr-4">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">For Pet Owners</h3>
                  <p className="text-white/80">Track appointments, view medical records, and book services</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="p-3 bg-white/20 rounded-full mr-4">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">For Veterinarians</h3>
                  <p className="text-white/80">Manage appointments, patient records, and provide care</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="p-3 bg-white/20 rounded-full mr-4">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Community Support</h3>
                  <p className="text-white/80">Connect with other pet lovers and veterinary professionals</p>
                </div>
              </div>
            </div>

            {/* Role-specific benefits */}
            {selectedRole && (
              <div className="mt-8 p-6 bg-white/10 rounded-lg backdrop-blur-sm">
                <h4 className="font-semibold text-lg mb-3">
                  {selectedRole === 'DOCTOR' ? 'Doctor Benefits:' : 'Pet Owner Benefits:'}
                </h4>
                <ul className="space-y-2 text-sm text-white/90">
                  {selectedRole === 'DOCTOR' ? (
                    <>
                      <li>• Manage patient appointments and records</li>
                      <li>• Access to medical history and notes</li>
                      <li>• Schedule management tools</li>
                      <li>• Professional networking opportunities</li>
                    </>
                  ) : (
                    <>
                      <li>• Easy appointment booking and management</li>
                      <li>• Access to pet medical records</li>
                      <li>• Reminder notifications for checkups</li>
                      <li>• 24/7 emergency contact support</li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;