import express from 'express';
import { prisma } from '../index';
import { reviewSchema, validateRequest } from '../validation/review';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = express.Router();

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private (Patient)
router.post('/', authenticate, authorize('PATIENT'), validateRequest(reviewSchema), async (req: AuthRequest, res) => {
  try {
    const { appointmentId, rating, comment } = req.body;
    const patientId = req.user!.id;
    
    console.log('Review submission request:', {
      appointmentId,
      rating,
      comment,
      patientId
    });

    // Check if appointment exists and belongs to this patient
    const appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        patientId,
        status: 'COMPLETED',
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    console.log('Found appointment:', appointment);

    if (!appointment) {
      console.log('Appointment not found or not completed');
      return res.status(404).json({
        success: false,
        message: 'Appointment not found, not completed, or you do not have permission to review it',
      });
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: { appointmentId },
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Review already exists for this appointment',
      });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        appointmentId,
        patientId,
        rating,
        comment,
      },
      include: {
        appointment: {
          include: {
            patient: {
              select: {
                id: true,
                name: true,
                email: true,
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
        patient: {
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
      message: 'Review created successfully',
      data: { review },
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// @route   GET /api/reviews
// @desc    Get reviews (filtered by role)
// @access  Private
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 10, doctorId } = req.query;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    let whereClause: any = {};

    if (userRole === 'PATIENT') {
      whereClause.patientId = userId;
    } else if (userRole === 'DOCTOR') {
      whereClause.appointment = {
        doctorId: userId,
      };
    }

    // If doctorId is provided, filter by that doctor
    if (doctorId) {
      whereClause.appointment = {
        ...whereClause.appointment,
        doctorId: doctorId as string,
      };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: whereClause,
        include: {
          appointment: {
            include: {
              patient: {
                select: {
                  id: true,
                  name: true,
                  email: true,
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
          patient: {
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
      prisma.review.count({ where: whereClause }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// @route   GET /api/reviews/:id
// @desc    Get single review
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
      whereClause.appointment = {
        doctorId: userId,
      };
    }

    const review = await prisma.review.findFirst({
      where: whereClause,
      include: {
        appointment: {
          include: {
            patient: {
              select: {
                id: true,
                name: true,
                email: true,
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
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { review },
    });
  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update review
// @access  Private (Patient)
router.put('/:id', authenticate, authorize('PATIENT'), validateRequest(reviewSchema), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const patientId = req.user!.id;
    const { rating, comment } = req.body;

    // Check if review exists and belongs to this patient
    const existingReview = await prisma.review.findFirst({
      where: {
        id,
        patientId,
      },
    });

    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you do not have permission to update it',
      });
    }

    // Update review
    const review = await prisma.review.update({
      where: { id },
      data: {
        rating,
        comment,
      },
      include: {
        appointment: {
          include: {
            patient: {
              select: {
                id: true,
                name: true,
                email: true,
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
        patient: {
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
      message: 'Review updated successfully',
      data: { review },
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete review
// @access  Private (Patient)
router.delete('/:id', authenticate, authorize('PATIENT'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const patientId = req.user!.id;

    // Check if review exists and belongs to this patient
    const existingReview = await prisma.review.findFirst({
      where: {
        id,
        patientId,
      },
    });

    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you do not have permission to delete it',
      });
    }

    await prisma.review.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// @route   GET /api/reviews/stats/doctor/:doctorId
// @desc    Get review statistics for a doctor
// @access  Private
router.get('/stats/doctor/:doctorId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { doctorId } = req.params;

    const [
      totalReviews,
      averageRating,
      ratingDistribution,
    ] = await Promise.all([
      prisma.review.count({
        where: {
          appointment: {
            doctorId,
          },
        },
      }),
      prisma.review.aggregate({
        where: {
          appointment: {
            doctorId,
          },
        },
        _avg: {
          rating: true,
        },
      }),
      prisma.review.groupBy({
        by: ['rating'],
        where: {
          appointment: {
            doctorId,
          },
        },
        _count: {
          rating: true,
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalReviews,
        averageRating: averageRating._avg.rating || 0,
        ratingDistribution: ratingDistribution.map(item => ({
          rating: item.rating,
          count: item._count.rating,
        })),
      },
    });
  } catch (error) {
    console.error('Get review stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;
