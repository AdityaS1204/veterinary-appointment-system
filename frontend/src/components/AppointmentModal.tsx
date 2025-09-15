import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, X, Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';
import apiService from '@/services/api';

const appointmentSchema = z.object({
  phone: z.string().min(10, 'Please enter a valid phone number'),
  animalType: z.string().min(1, 'Please select animal type'),
  breed: z.string().min(1, 'Please enter breed'),
  petName: z.string().min(1, 'Please enter pet name'),
  petAge: z.string().min(1, 'Please enter pet age'),
  reason: z.string().min(10, 'Please provide reason for appointment'),
  doctorSpecialty: z.string().min(1, 'Please select doctor specialty'),
  date: z.date({
    required_error: 'Please select appointment date',
  }),
  time: z.string().min(1, 'Please select appointment time'),
  additionalNotes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

const animalTypes = [
  'Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Guinea Pig', 
  'Fish', 'Turtle', 'Snake', 'Other'
];

const doctorSpecialties = [
  'General Practice',
  'Dermatology',
  'Surgery',
  'Dental Care',
  'Ophthalmology',
  'Cardiology',
  'Emergency Medicine',
  'Internal Medicine',
  'Orthopedics',
  'Neurology',
  'Oncology',
  'Behavioral Medicine'
];

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM'
];

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  const selectedDate = watch('date');

  const onSubmit = async (data: AppointmentFormData) => {
    setIsSubmitting(true);
    try {
      const appointmentData = {
        ...data,
        date: data.date.toISOString(),
      };
      
      const response = await apiService.createAppointment(appointmentData);
      
      if (response.success) {
        alert('Appointment booked successfully! We\'ll contact you soon.');
        reset();
        onClose();
      } else {
        alert(response.message || 'Failed to book appointment. Please try again.');
      }
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      alert(error.message || 'Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold flex items-center">
              <Stethoscope className="h-6 w-6 mr-2 text-primary" />
              Book Appointment
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Pet Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Pet Information</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="animalType">Animal Type *</Label>
                <Select onValueChange={(value) => setValue('animalType', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select animal type" />
                  </SelectTrigger>
                  <SelectContent>
                    {animalTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.animalType && (
                  <p className="text-sm text-red-600 mt-1">{errors.animalType.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="breed">Breed *</Label>
                <Input
                  id="breed"
                  {...register('breed')}
                  className="mt-1"
                  placeholder="Enter breed"
                />
                {errors.breed && (
                  <p className="text-sm text-red-600 mt-1">{errors.breed.message}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="petName">Pet Name *</Label>
                <Input
                  id="petName"
                  {...register('petName')}
                  className="mt-1"
                  placeholder="Enter pet name"
                />
                {errors.petName && (
                  <p className="text-sm text-red-600 mt-1">{errors.petName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="petAge">Pet Age *</Label>
                <Input
                  id="petAge"
                  {...register('petAge')}
                  className="mt-1"
                  placeholder="e.g., 2 years, 6 months"
                />
                {errors.petAge && (
                  <p className="text-sm text-red-600 mt-1">{errors.petAge.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Contact Information</h4>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                className="mt-1"
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Doctor Specialty Selection */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Doctor Specialty</h4>
            <div>
              <Label htmlFor="doctorSpecialty">Preferred Doctor Specialty *</Label>
              <Select onValueChange={(value) => setValue('doctorSpecialty', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select doctor specialty" />
                </SelectTrigger>
                <SelectContent>
                  {doctorSpecialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.doctorSpecialty && (
                <p className="text-sm text-red-600 mt-1">{errors.doctorSpecialty.message}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Select the type of specialist you'd like to see for your pet's condition
              </p>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Appointment Details</h4>
            <div>
              <Label htmlFor="reason">Reason for Appointment *</Label>
              <Textarea
                id="reason"
                {...register('reason')}
                className="mt-1"
                placeholder="Describe the reason for the appointment..."
                rows={3}
              />
              {errors.reason && (
                <p className="text-sm text-red-600 mt-1">{errors.reason.message}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Appointment Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full mt-1 justify-start text-left font-normal',
                        !selectedDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => setValue('date', date!)}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <p className="text-sm text-red-600 mt-1">{errors.date.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="time">Preferred Time *</Label>
                <Select onValueChange={(value) => setValue('time', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.time && (
                  <p className="text-sm text-red-600 mt-1">{errors.time.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                {...register('additionalNotes')}
                className="mt-1"
                placeholder="Any additional information..."
                rows={2}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Booking...' : 'Book Appointment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;