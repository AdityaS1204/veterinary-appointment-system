const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // Authentication
  async signup(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: 'DOCTOR' | 'PATIENT';
  }) {
    const response = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.data?.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.data?.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async logout() {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    });
    this.setToken(null);
    return response;
  }

  // Appointments
  async createAppointment(appointmentData: {
    petName: string;
    animalType: string;
    breed: string;
    petAge: string;
    reason: string;
    doctorSpecialty: string;
    date: string;
    time: string;
    additionalNotes?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  }) {
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  async getAppointments(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/appointments?${queryString}` : '/appointments';
    
    return this.request(endpoint);
  }

  async getAppointment(id: string) {
    return this.request(`/appointments/${id}`);
  }

  async updateAppointment(id: string, updateData: {
    status?: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    doctorNotes?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  }) {
    return this.request(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async assignAppointment(id: string) {
    return this.request(`/appointments/${id}/assign`, {
      method: 'POST',
    });
  }

  async cancelAppointment(id: string) {
    return this.request(`/appointments/${id}`, {
      method: 'DELETE',
    });
  }

  async getAppointmentStats() {
    return this.request('/appointments/stats/dashboard');
  }

  // Prescriptions
  async createPrescription(prescriptionData: {
    appointmentId: string;
    diagnosis: string;
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions?: string;
    }>;
    followUpInstructions: string;
    nextAppointment?: string;
  }) {
    return this.request('/prescriptions', {
      method: 'POST',
      body: JSON.stringify(prescriptionData),
    });
  }

  async getPrescriptions(params?: {
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/prescriptions?${queryString}` : '/prescriptions';
    
    return this.request(endpoint);
  }

  async getPrescription(id: string) {
    return this.request(`/prescriptions/${id}`);
  }

  async updatePrescription(id: string, updateData: {
    diagnosis: string;
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions?: string;
    }>;
    followUpInstructions: string;
    nextAppointment?: string;
  }) {
    return this.request(`/prescriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deletePrescription(id: string) {
    return this.request(`/prescriptions/${id}`, {
      method: 'DELETE',
    });
  }

  // Reviews
  async createReview(reviewData: {
    appointmentId: string;
    rating: number;
    comment: string;
  }) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async getReviews(params?: {
    page?: number;
    limit?: number;
    doctorId?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.doctorId) queryParams.append('doctorId', params.doctorId);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/reviews?${queryString}` : '/reviews';
    
    return this.request(endpoint);
  }

  async getReview(id: string) {
    return this.request(`/reviews/${id}`);
  }

  async updateReview(id: string, updateData: {
    rating: number;
    comment: string;
  }) {
    return this.request(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteReview(id: string) {
    return this.request(`/reviews/${id}`, {
      method: 'DELETE',
    });
  }

  async getDoctorReviewStats(doctorId: string) {
    return this.request(`/reviews/stats/doctor/${doctorId}`);
  }

  // Users
  async getDoctors(params?: {
    page?: number;
    limit?: number;
    specialty?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.specialty) queryParams.append('specialty', params.specialty);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/users/doctors?${queryString}` : '/users/doctors';
    
    return this.request(endpoint);
  }

  async getPatients(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/users/patients?${queryString}` : '/users/patients';
    
    return this.request(endpoint);
  }

  async getUser(id: string) {
    return this.request(`/users/${id}`);
  }

  async updateUser(id: string, updateData: {
    name?: string;
    phone?: string;
  }) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async updatePassword(id: string, passwordData: {
    currentPassword: string;
    newPassword: string;
  }) {
    return this.request(`/users/${id}/password`, {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }
}

// Create and export a singleton instance
export const apiService = new ApiService(API_BASE_URL);
export default apiService;
