import express from 'express';
import { prisma } from '../index';
import { prescriptionSchema, validateRequest } from '../validation/prescription';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = express.Router();

// @route   POST /api/prescriptions
// @desc    Create a new prescription
// @access  Private (Doctor)
router.post('/', authenticate, authorize('DOCTOR'), validateRequest(prescriptionSchema), async (req: AuthRequest, res) => {
  try {
    const { appointmentId, diagnosis, medications, followUpInstructions, nextAppointment } = req.body;
    const doctorId = req.user!.id;

    // Check if appointment exists and belongs to this doctor
    const appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        doctorId,
        status: 'COMPLETED',
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found, not completed, or you do not have permission to create prescription for it',
      });
    }

    // Check if prescription already exists
    const existingPrescription = await prisma.prescription.findUnique({
      where: { appointmentId },
    });

    if (existingPrescription) {
      return res.status(400).json({
        success: false,
        message: 'Prescription already exists for this appointment',
      });
    }

    // Create prescription with medications
    const prescription = await prisma.prescription.create({
      data: {
        appointmentId,
        doctorId,
        diagnosis,
        followUpInstructions,
        nextAppointment: nextAppointment ? new Date(nextAppointment) : null,
        medications: {
          create: medications.map((med: any) => ({
            name: med.name,
            dosage: med.dosage,
            frequency: med.frequency,
            duration: med.duration,
            instructions: med.instructions || null,
          })),
        },
      },
      include: {
        appointment: {
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
        },
        medications: true,
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
      message: 'Prescription created successfully',
      data: { prescription },
    });
  } catch (error) {
    console.error('Create prescription error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// @route   GET /api/prescriptions
// @desc    Get prescriptions (filtered by role)
// @access  Private
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    let whereClause: any = {};

    if (userRole === 'PATIENT') {
      whereClause.appointment = {
        patientId: userId,
      };
    } else if (userRole === 'DOCTOR') {
      whereClause.doctorId = userId;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [prescriptions, total] = await Promise.all([
      prisma.prescription.findMany({
        where: whereClause,
        include: {
          appointment: {
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
          },
          medications: true,
          doctor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: Number(limit),
      }),
      prisma.prescription.count({ where: whereClause }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        prescriptions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get prescriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// @route   GET /api/prescriptions/:id
// @desc    Get single prescription
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
      whereClause.appointment = {
        patientId: userId,
      };
    } else if (userRole === 'DOCTOR') {
      whereClause.doctorId = userId;
    }

    const prescription = await prisma.prescription.findFirst({
      where: whereClause,
      include: {
        appointment: {
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
        },
        medications: true,
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { prescription },
    });
  } catch (error) {
    console.error('Get prescription error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// @route   PUT /api/prescriptions/:id
// @desc    Update prescription
// @access  Private (Doctor)
router.put('/:id', authenticate, authorize('DOCTOR'), validateRequest(prescriptionSchema), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user!.id;
    const { diagnosis, medications, followUpInstructions, nextAppointment } = req.body;

    // Check if prescription exists and belongs to this doctor
    const existingPrescription = await prisma.prescription.findFirst({
      where: {
        id,
        doctorId,
      },
    });

    if (!existingPrescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found or you do not have permission to update it',
      });
    }

    // Update prescription
    const prescription = await prisma.prescription.update({
      where: { id },
      data: {
        diagnosis,
        followUpInstructions,
        nextAppointment: nextAppointment ? new Date(nextAppointment) : null,
        medications: {
          deleteMany: {}, // Delete existing medications
          create: medications.map((med: any) => ({
            name: med.name,
            dosage: med.dosage,
            frequency: med.frequency,
            duration: med.duration,
            instructions: med.instructions || null,
          })),
        },
      },
      include: {
        appointment: {
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
        },
        medications: true,
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
      message: 'Prescription updated successfully',
      data: { prescription },
    });
  } catch (error) {
    console.error('Update prescription error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// @route   DELETE /api/prescriptions/:id
// @desc    Delete prescription
// @access  Private (Doctor)
router.delete('/:id', authenticate, authorize('DOCTOR'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user!.id;

    // Check if prescription exists and belongs to this doctor
    const existingPrescription = await prisma.prescription.findFirst({
      where: {
        id,
        doctorId,
      },
    });

    if (!existingPrescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found or you do not have permission to delete it',
      });
    }

    await prisma.prescription.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Prescription deleted successfully',
    });
  } catch (error) {
    console.error('Delete prescription error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;
