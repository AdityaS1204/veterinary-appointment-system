import express from 'express';
import { prisma } from '../index';
import { appointmentSchema, updateAppointmentSchema, validateRequest } from '../validation/appointment';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = express.Router();

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Private (Patient)
router.post('/', authenticate, authorize('PATIENT'), validateRequest(appointmentSchema), async (req: AuthRequest, res) => {
  try {
    const { phone, ...appointmentFields } = req.body;
    
    // Update user's phone if provided
    if (phone) {
      await prisma.user.update({
        where: { id: req.user!.id },
        data: { phone: phone.trim() }
      });
    }

    // Find a doctor with the requested specialty
    let assignedDoctor = null;
    if (req.body.doctorSpecialty) {
      assignedDoctor = await prisma.user.findFirst({
        where: {
          role: 'DOCTOR',
          // Note: We don't have a specialty field in User model yet
          // For now, we'll assign any available doctor
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
    }

    const appointmentData = {
      ...appointmentFields,
      patientId: req.user!.id,
      doctorId: assignedDoctor?.id || null,
      date: new Date(req.body.date),
    };

    const appointment = await prisma.appointment.create({
      data: appointmentData,
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: { appointment },
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// @route   GET /api/appointments
// @desc    Get appointments (filtered by role)
// @access  Private
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    let whereClause: any = {};

    if (userRole === 'PATIENT') {
      whereClause.patientId = userId;
    } else if (userRole === 'DOCTOR') {
      // Doctors can see all appointments from all patients
      // No additional filtering needed - they see everything
    }

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where: whereClause,
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          doctor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          prescription: {
            include: {
              medications: true,
            },
          },
          review: true,
        },
        orderBy: {
          date: 'asc',
        },
        skip,
        take: Number(limit),
      }),
      prisma.appointment.count({ where: whereClause }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        appointments,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// @route   GET /api/appointments/:id
// @desc    Get single appointment
// @access  Private
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    let whereClause: any = {
      id,
    };

    if (userRole === 'PATIENT') {
      whereClause.patientId = userId;
    } else if (userRole === 'DOCTOR') {
      whereClause.doctorId = userId;
    }

    const appointment = await prisma.appointment.findFirst({
      where: whereClause,
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        prescription: {
          include: {
            medications: true,
          },
        },
        review: true,
      },
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { appointment },
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update appointment
// @access  Private (Doctor)
router.put('/:id', authenticate, authorize('DOCTOR'), validateRequest(updateAppointmentSchema), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user!.id;

    // Check if appointment exists
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        id,
      },
    });

    if (!existingAppointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // If appointment doesn't have a doctor assigned, assign the current doctor
    const updateData = {
      ...req.body,
      ...(req.body.status && { status: req.body.status }),
      ...(req.body.doctorNotes && { doctorNotes: req.body.doctorNotes }),
      ...(req.body.priority && { priority: req.body.priority }),
      // Assign doctor if not already assigned
      ...(existingAppointment.doctorId === null && { doctorId }),
    };

    const appointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        prescription: {
          include: {
            medications: true,
          },
        },
        review: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      data: { appointment },
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// @route   POST /api/appointments/:id/assign
// @desc    Assign doctor to appointment
// @access  Private (Doctor)
router.post('/:id/assign', authenticate, authorize('DOCTOR'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user!.id;

    // Check if appointment exists and is not already assigned
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        id,
        doctorId: null, // Only unassigned appointments
      },
    });

    if (!existingAppointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found or already assigned to a doctor',
      });
    }

    // Assign the doctor to the appointment
    const appointment = await prisma.appointment.update({
      where: { id },
      data: { 
        doctorId,
        status: 'CONFIRMED' // Auto-confirm when doctor assigns themselves
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        prescription: {
          include: {
            medications: true,
          },
        },
        review: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Appointment assigned successfully',
      data: { appointment },
    });
  } catch (error) {
    console.error('Assign appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Cancel appointment
// @access  Private
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    let whereClause: any = {
      id,
    };

    if (userRole === 'PATIENT') {
      whereClause.patientId = userId;
    } else if (userRole === 'DOCTOR') {
      whereClause.doctorId = userId;
    }

    const existingAppointment = await prisma.appointment.findFirst({
      where: whereClause,
    });

    if (!existingAppointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found or you do not have permission to cancel it',
      });
    }

    // Update status to cancelled instead of deleting
    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: { appointment },
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// @route   GET /api/appointments/stats/dashboard
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats/dashboard', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    let whereClause: any = {};

    if (userRole === 'PATIENT') {
      whereClause.patientId = userId;
    } else if (userRole === 'DOCTOR') {
      whereClause.doctorId = userId;
    }

    const [
      totalAppointments,
      pendingAppointments,
      confirmedAppointments,
      completedAppointments,
      cancelledAppointments,
      todayAppointments,
    ] = await Promise.all([
      prisma.appointment.count({ where: whereClause }),
      prisma.appointment.count({ where: { ...whereClause, status: 'PENDING' } }),
      prisma.appointment.count({ where: { ...whereClause, status: 'CONFIRMED' } }),
      prisma.appointment.count({ where: { ...whereClause, status: 'COMPLETED' } }),
      prisma.appointment.count({ where: { ...whereClause, status: 'CANCELLED' } }),
      prisma.appointment.count({
        where: {
          ...whereClause,
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalAppointments,
        pending: pendingAppointments,
        confirmed: confirmedAppointments,
        completed: completedAppointments,
        cancelled: cancelledAppointments,
        today: todayAppointments,
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;
