import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppointmentModal from '@/components/AppointmentModal';
import ReviewModal from '@/components/ReviewModal';
import apiService from '@/services/api';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  LogOut,
  Heart,
  Plus,
  FileText,
  Star,
  Pill,
  MessageSquare
} from 'lucide-react';

interface Appointment {
  id: string;
  petName: string;
  animalType: string;
  breed: string;
  petAge: string;
  reason: string;
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  additionalNotes?: string;
  doctorNotes?: string;
  doctorSpecialty?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  updatedAt: string;
  patient?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  doctor?: {
    id: string;
    name: string;
    email: string;
  };
  prescription?: {
    id: string;
    diagnosis: string;
    followUpInstructions: string;
    nextAppointment?: string;
    medications: Array<{
      id: string;
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions?: string;
    }>;
  };
  review?: {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
  };
}

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedAppointmentForReview, setSelectedAppointmentForReview] = useState<Appointment | null>(null);

  // Load appointments from API
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const response = await apiService.getAppointments();
        if (response.success && response.data?.appointments) {
          setAppointments(response.data.appointments);
        }
      } catch (error) {
        console.error('Failed to load appointments:', error);
      }
    };

    loadAppointments();
  }, []);

  const handleReviewSubmit = async (reviewData: any) => {
    try {
      console.log('Submitting review data:', reviewData);
      const response = await apiService.createReview(reviewData);
      console.log('Review submission response:', response);
      
      if (response.success) {
        // Show success message
        alert('Review submitted successfully! Thank you for your feedback.');
        
        // Reload appointments to get updated data
        const appointmentsResponse = await apiService.getAppointments();
        if (appointmentsResponse.success && appointmentsResponse.data?.appointments) {
          setAppointments(appointmentsResponse.data.appointments);
        }
      } else {
        alert(response.message || 'Failed to submit review. Please try again.');
      }
    } catch (error: any) {
      console.error('Failed to submit review:', error);
      alert(error.message || 'Failed to submit review. Please try again.');
    }
  };

  const openReviewModal = (appointment: Appointment) => {
    console.log('Opening review modal for appointment:', appointment);
    setSelectedAppointmentForReview(appointment);
    setIsReviewModalOpen(true);
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusCounts = () => {
    return {
      total: appointments.length,
      pending: appointments.filter(a => a.status === 'PENDING').length,
      confirmed: appointments.filter(a => a.status === 'CONFIRMED').length,
      completed: appointments.filter(a => a.status === 'COMPLETED').length,
      cancelled: appointments.filter(a => a.status === 'CANCELLED').length,
    };
  };

  const stats = getStatusCounts();

  const upcomingAppointments = appointments.filter(appointment => 
    appointment.status === 'PENDING' || appointment.status === 'CONFIRMED'
  );

  const completedAppointments = appointments.filter(appointment => 
    appointment.status === 'COMPLETED'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-lg">
                <Heart className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Pet Care</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsAppointmentModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
              <Button onClick={logout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Confirmed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Cancelled</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pet</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                        <div>
                          <p className="font-medium">{appointment.petName}</p>
                          <p className="text-sm text-gray-600">
                            {appointment.animalType} • {appointment.breed}
                          </p>
                          <p className="text-xs text-gray-500">Age: {appointment.petAge}</p>
                        </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{new Date(appointment.date).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-600">{appointment.time}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{appointment.doctor?.name || 'TBD'}</p>
                            <p className="text-sm text-gray-600">{appointment.doctorSpecialty}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{appointment.reason}</p>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {appointment.doctorNotes && (
                            <p className="text-sm text-gray-600 max-w-xs">
                              {appointment.doctorNotes}
                            </p>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No upcoming appointments</p>
                <Button 
                  className="mt-4"
                  onClick={() => setIsAppointmentModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Book New Appointment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completed Appointments with Reviews */}
        {completedAppointments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Recent Visits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {completedAppointments.map((appointment) => (
                  <Card key={appointment.id} className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Appointment Info */}
                      <div className="lg:col-span-2">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{appointment.petName}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                            </p>
                            <p className="text-sm text-gray-600">
                              {appointment.doctor?.name || 'TBD'} • {appointment.doctorSpecialty}
                            </p>
                          </div>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-sm text-gray-700">Reason for Visit:</h4>
                            <p className="text-sm text-gray-600">{appointment.reason}</p>
                          </div>

                          {appointment.doctorNotes && (
                            <div>
                              <h4 className="font-medium text-sm text-gray-700">Doctor Notes:</h4>
                              <p className="text-sm text-gray-600">{appointment.doctorNotes}</p>
                            </div>
                          )}

                          {appointment.prescription && (
                            <div>
                              <h4 className="font-medium text-sm text-gray-700 flex items-center">
                                <Pill className="h-4 w-4 mr-1" />
                                Prescription:
                              </h4>
                              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm font-medium text-blue-800 mb-2">
                                  Diagnosis: {appointment.prescription.diagnosis}
                                </p>
                                <div className="space-y-2">
                                  {appointment.prescription.medications.map((med, index) => (
                                    <div key={index} className="text-sm text-blue-700">
                                      <strong>{med.name}</strong> - {med.dosage}, {med.frequency} for {med.duration}
                                      {med.instructions && (
                                        <p className="text-xs text-blue-600 mt-1">Note: {med.instructions}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                <p className="text-sm text-blue-700 mt-2">
                                  <strong>Follow-up:</strong> {appointment.prescription.followUpInstructions}
                                </p>
                                {appointment.prescription.nextAppointment && (
                                  <p className="text-sm text-blue-700 mt-1">
                                    <strong>Next Appointment:</strong> {appointment.prescription.nextAppointment}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Review Section */}
                      <div className="lg:col-span-1">
                        {appointment.review ? (
                          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <h4 className="font-medium text-sm text-green-800 mb-2 flex items-center">
                              <Star className="h-4 w-4 mr-1 fill-current" />
                              Your Review
                            </h4>
                            <div className="flex items-center mb-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= appointment.review!.rating
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="ml-2 text-sm text-green-700">
                                {appointment.review.rating}/5
                              </span>
                            </div>
                            <p className="text-sm text-green-700 mb-2">
                              "{appointment.review.comment}"
                            </p>
                            <p className="text-xs text-green-600">
                              Reviewed on {new Date(appointment.review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ) : (
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <h4 className="font-medium text-sm text-gray-700 mb-2">
                              Rate Your Experience
                            </h4>
                            <p className="text-sm text-gray-600 mb-3">
                              How was your visit with {appointment.doctor?.name || 'the doctor'}?
                            </p>
                            <Button
                              size="sm"
                              onClick={() => openReviewModal(appointment)}
                              className="w-full"
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Write Review
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Appointment Modal */}
      <AppointmentModal 
        isOpen={isAppointmentModalOpen} 
        onClose={() => setIsAppointmentModalOpen(false)} 
      />

      {/* Review Modal */}
      {selectedAppointmentForReview && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setSelectedAppointmentForReview(null);
          }}
          appointmentId={selectedAppointmentForReview.id}
          petName={selectedAppointmentForReview.petName}
          doctorName={selectedAppointmentForReview.doctor?.name || 'Doctor'}
          onSubmitReview={handleReviewSubmit}
        />
      )}
    </div>
  );
};

export default PatientDashboard;