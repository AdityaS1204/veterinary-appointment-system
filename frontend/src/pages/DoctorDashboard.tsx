import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppointmentModal from '@/components/AppointmentModal';
import PrescriptionModal from '@/components/PrescriptionModal';
import apiService from '@/services/api';
import { 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Search,
  Filter,
  LogOut,
  Stethoscope,
  Plus,
  FileText,
  Star,
  Clock,
  Award,
  UserCheck,
  Heart,
  Pill,
  Edit,
  Save,
  XCircle
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

// Review Statistics Component
const ReviewStats: React.FC = () => {
  const { user } = useAuth();
  const [reviewStats, setReviewStats] = useState<{
    totalReviews: number;
    averageRating: number;
  } | null>(null);

  useEffect(() => {
    const loadReviewStats = async () => {
      try {
        const response = await apiService.getReviews({ doctorId: user?.id });
        if (response.success && response.data?.reviews) {
          const reviews = response.data.reviews;
          const totalReviews = reviews.length;
          const averageRating = totalReviews > 0 
            ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / totalReviews
            : 0;
          
          setReviewStats({ totalReviews, averageRating });
        }
      } catch (error) {
        console.error('Failed to load review stats:', error);
      }
    };

    if (user?.id) {
      loadReviewStats();
    }
  }, [user?.id]);

  if (!reviewStats) {
    return (
      <div className="flex items-center">
        <Star className="h-8 w-8 text-yellow-600" />
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">Average Rating</p>
          <p className="text-2xl font-bold text-gray-900">-</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <Star className="h-8 w-8 text-yellow-600" />
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">Average Rating</p>
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold text-gray-900">
            {reviewStats.averageRating.toFixed(1)}
          </p>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.round(reviewStats.averageRating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-500">({reviewStats.totalReviews} reviews)</p>
      </div>
    </div>
  );
};

// Reviews Section Component
const ReviewsSection: React.FC<{ refreshTrigger?: number }> = ({ refreshTrigger }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getReviews({ doctorId: user?.id });
      if (response.success && response.data?.reviews) {
        setReviews(response.data.reviews);
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadReviews();
    }
  }, [user?.id, refreshTrigger]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No reviews yet</p>
        <p className="text-sm text-gray-400">Reviews will appear here once patients rate their appointments</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-medium text-gray-900">
                {review.appointment?.patient?.name || 'Anonymous'}
              </h4>
              <p className="text-sm text-gray-600">
                {review.appointment?.petName} • {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
            {renderStars(review.rating)}
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            {review.comment}
          </p>
        </Card>
      ))}
    </div>
  );
};

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [selectedAppointmentForPrescription, setSelectedAppointmentForPrescription] = useState<Appointment | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');
  const [refreshReviews, setRefreshReviews] = useState(0);

  // Load appointments from API
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const response = await apiService.getAppointments();
        if (response.success && response.data?.appointments) {
          setAppointments(response.data.appointments);
          setFilteredAppointments(response.data.appointments);
        }
      } catch (error) {
        console.error('Failed to load appointments:', error);
      }
    };

    loadAppointments();
  }, []);

  // Filter appointments based on search term and status
  useEffect(() => {
    let filtered = appointments;

    if (searchTerm) {
      filtered = filtered.filter(appointment =>
        appointment.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.animalType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === statusFilter);
    }

    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, statusFilter]);

  const updateAppointmentStatus = async (appointmentId: string, newStatus: Appointment['status']) => {
    try {
      const response = await apiService.updateAppointment(appointmentId, { status: newStatus });
      if (response.success) {
        // Reload appointments to get updated data
        const appointmentsResponse = await apiService.getAppointments();
        if (appointmentsResponse.success && appointmentsResponse.data?.appointments) {
          setAppointments(appointmentsResponse.data.appointments);
          setFilteredAppointments(appointmentsResponse.data.appointments);
        }
      }
    } catch (error) {
      console.error('Failed to update appointment status:', error);
    }
  };

  const updateDoctorNotes = async (appointmentId: string, notes: string) => {
    try {
      const response = await apiService.updateAppointment(appointmentId, { doctorNotes: notes });
      if (response.success) {
        // Reload appointments to get updated data
        const appointmentsResponse = await apiService.getAppointments();
        if (appointmentsResponse.success && appointmentsResponse.data?.appointments) {
          setAppointments(appointmentsResponse.data.appointments);
          setFilteredAppointments(appointmentsResponse.data.appointments);
        }
        setEditingNotes(null);
        setTempNotes('');
      }
    } catch (error) {
      console.error('Failed to update doctor notes:', error);
    }
  };

  const handlePrescriptionSubmit = async (prescriptionData: any) => {
    try {
      const response = await apiService.createPrescription(prescriptionData);
      if (response.success) {
        // Reload appointments to get updated data
        const appointmentsResponse = await apiService.getAppointments();
        if (appointmentsResponse.success && appointmentsResponse.data?.appointments) {
          setAppointments(appointmentsResponse.data.appointments);
          setFilteredAppointments(appointmentsResponse.data.appointments);
        }
      }
    } catch (error) {
      console.error('Failed to create prescription:', error);
    }
  };

  const assignAppointment = async (appointmentId: string) => {
    try {
      const response = await apiService.assignAppointment(appointmentId);
      if (response.success) {
        // Reload appointments to get updated data
        const appointmentsResponse = await apiService.getAppointments();
        if (appointmentsResponse.success && appointmentsResponse.data?.appointments) {
          setAppointments(appointmentsResponse.data.appointments);
          setFilteredAppointments(appointmentsResponse.data.appointments);
        }
      }
    } catch (error) {
      console.error('Failed to assign appointment:', error);
    }
  };

  const openPrescriptionModal = (appointment: Appointment) => {
    setSelectedAppointmentForPrescription(appointment);
    setIsPrescriptionModalOpen(true);
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

  const getPriorityColor = (priority: Appointment['priority']) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusCounts = () => {
    return {
      todayAppointments: appointments.filter(a => a.status === 'CONFIRMED' || a.status === 'PENDING').length,
      pendingReview: appointments.filter(a => a.status === 'PENDING').length,
      completedToday: appointments.filter(a => a.status === 'COMPLETED').length,
      totalPatients: appointments.length,
    };
  };

  const stats = getStatusCounts();

  const todayAppointments = appointments.filter(appointment => 
    appointment.status === 'CONFIRMED' || appointment.status === 'PENDING'
  );

  const highPriorityAppointments = appointments.filter(appointment => 
    appointment.priority === 'HIGH' && appointment.status !== 'COMPLETED'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-lg">
                <Stethoscope className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, Dr. {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button onClick={logout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Doctor Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <ReviewStats />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed Today</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedToday}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserCheck className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Patients</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* High Priority Alerts */}
        {highPriorityAppointments.length > 0 && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center text-red-800">
                <Heart className="h-5 w-5 mr-2" />
                High Priority Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {highPriorityAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                    <div>
                      <p className="font-medium text-red-800">{appointment.petName} - {appointment.reason}</p>
                      <p className="text-sm text-red-600">Owner: {appointment.ownerName} • {appointment.date} at {appointment.time}</p>
                    </div>
                    <Badge className="bg-red-100 text-red-800">High Priority</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Today's Schedule */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayAppointments.length > 0 ? (
              <div className="space-y-3">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600">{appointment.time}</p>
                        <Badge className={getPriorityColor(appointment.priority)}>
                          {appointment.priority}
                        </Badge>
                      </div>
                      <div>
                        <p className="font-medium">{appointment.petName} ({appointment.animalType})</p>
                        <p className="text-sm text-gray-600">{appointment.ownerName} • {appointment.reason}</p>
                        <p className="text-xs text-gray-500">{appointment.doctorSpecialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                      {appointment.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                        >
                          Confirm
                        </Button>
                      )}
                      {appointment.status === 'confirmed' && (
                        <Button
                          size="sm"
                          onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No appointments scheduled for today</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by pet name, owner, or animal type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* All Appointments Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pet Info</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Doctor Notes</TableHead>
                    <TableHead>Prescription</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{appointment.petName}</p>
                          <p className="text-sm text-gray-600">
                            {appointment.animalType} • {appointment.breed}
                          </p>
                          <p className="text-sm text-gray-600">Age: {appointment.petAge}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{appointment.patient?.name || 'N/A'}</p>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1" />
                            {appointment.patient?.phone || 'N/A'}
                          </div>
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1" />
                            {appointment.patient?.email || 'N/A'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{new Date(appointment.date).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600">{appointment.time}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm max-w-xs truncate">{appointment.reason}</p>
                        {appointment.additionalNotes && (
                          <p className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                            Note: {appointment.additionalNotes}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{appointment.doctorSpecialty}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(appointment.priority)}>
                          {appointment.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {editingNotes === appointment.id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={tempNotes}
                              onChange={(e) => setTempNotes(e.target.value)}
                              placeholder="Add doctor notes..."
                              rows={2}
                              className="text-sm"
                            />
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                onClick={() => updateDoctorNotes(appointment.id, tempNotes)}
                              >
                                <Save className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingNotes(null);
                                  setTempNotes('');
                                }}
                              >
                                <XCircle className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            {appointment.doctorNotes ? (
                              <p className="text-sm text-gray-600 max-w-xs">{appointment.doctorNotes}</p>
                            ) : (
                              <p className="text-sm text-gray-400">No notes</p>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingNotes(appointment.id);
                                setTempNotes(appointment.doctorNotes || '');
                              }}
                              className="mt-1"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {appointment.prescription ? (
                          <div className="flex items-center text-green-600">
                            <Pill className="h-4 w-4 mr-1" />
                            <span className="text-sm">Prescribed</span>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openPrescriptionModal(appointment)}
                          >
                            <Pill className="h-3 w-3 mr-1" />
                            Add Rx
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {/* Show Assign button for unassigned appointments */}
                          {!appointment.doctor && appointment.status === 'PENDING' && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => assignAppointment(appointment.id)}
                            >
                              Assign to Me
                            </Button>
                          )}
                          
                          {/* Show status update buttons for assigned appointments */}
                          {appointment.doctor && appointment.status === 'PENDING' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateAppointmentStatus(appointment.id, 'CONFIRMED')}
                              >
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateAppointmentStatus(appointment.id, 'CANCELLED')}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          {appointment.status === 'CONFIRMED' && (
                            <Button
                              size="sm"
                              onClick={() => updateAppointmentStatus(appointment.id, 'COMPLETED')}
                            >
                              Complete
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Patient Reviews
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRefreshReviews(prev => prev + 1);
                }}
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ReviewsSection refreshTrigger={refreshReviews} />
          </CardContent>
        </Card>
      </div>

      {/* Appointment Modal */}
      <AppointmentModal 
        isOpen={isAppointmentModalOpen} 
        onClose={() => setIsAppointmentModalOpen(false)} 
      />

      {/* Prescription Modal */}
      {selectedAppointmentForPrescription && (
        <PrescriptionModal
          isOpen={isPrescriptionModalOpen}
          onClose={() => {
            setIsPrescriptionModalOpen(false);
            setSelectedAppointmentForPrescription(null);
          }}
          appointmentId={selectedAppointmentForPrescription.id}
          petName={selectedAppointmentForPrescription.petName}
          ownerName={selectedAppointmentForPrescription.patient?.name || 'N/A'}
          onSubmitPrescription={handlePrescriptionSubmit}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;