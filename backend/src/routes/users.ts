import express from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../index';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/users/doctors
// @desc    Get all doctors
// @access  Private
router.get('/doctors', authenticate, async (req: AuthRequest, res) => {
  try {
    const { specialty, page = 1, limit = 10 } = req.query;

    let whereClause: any = {
      role: 'DOCTOR',
    };

    // Note: In a real application, you might want to add a specialty field to the User model
    // For now, we'll just return all doctors

    const skip = (Number(page) - 1) * Number(limit);

    const [doctors, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          createdAt: true,
        },
        orderBy: {
          name: 'asc',
        },
        skip,
        take: Number(limit),
      }),
      prisma.user.count({ where: whereClause }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        doctors,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// @route   GET /api/users/patients
// @desc    Get all patients (Doctor only)
// @access  Private (Doctor)
router.get('/patients', authenticate, authorize('DOCTOR'), async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    let whereClause: any = {
      role: 'PATIENT',
    };

    if (search) {
      whereClause.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [patients, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          createdAt: true,
        },
        orderBy: {
          name: 'asc',
        },
        skip,
        take: Number(limit),
      }),
      prisma.user.count({ where: whereClause }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        patients,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user!.id;
    const currentUserRole = req.user!.role;

    // Users can only view their own profile, or doctors can view patient profiles
    if (id !== currentUserId && currentUserRole !== 'DOCTOR') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own profile.',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user!.id;
    const { name, phone } = req.body;

    // Users can only update their own profile
    if (id !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own profile.',
      });
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        phone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// @route   PUT /api/users/:id/password
// @desc    Update user password
// @access  Private
router.put('/:id/password', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user!.id;
    const { currentPassword, newPassword } = req.body;

    // Users can only update their own password
    if (id !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own password.',
      });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    // Get current user with password
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await prisma.user.update({
      where: { id },
      data: {
        password: hashedNewPassword,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user account
// @access  Private
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user!.id;

    // Users can only delete their own account
    if (id !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own account.',
      });
    }

    // Check if user has any appointments
    const appointmentCount = await prisma.appointment.count({
      where: {
        OR: [
          { patientId: id },
          { doctorId: id },
        ],
      },
    });

    if (appointmentCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete account. You have existing appointments. Please contact support.',
      });
    }

    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;
