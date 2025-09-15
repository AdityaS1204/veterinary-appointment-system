import Joi from 'joi';

export const appointmentSchema = Joi.object({
  phone: Joi.string().min(10).max(15).required().messages({
    'string.min': 'Phone number must be at least 10 digits',
    'string.max': 'Phone number cannot exceed 15 digits',
    'any.required': 'Phone number is required',
  }),
  petName: Joi.string().min(1).max(50).required().messages({
    'string.min': 'Pet name is required',
    'string.max': 'Pet name cannot exceed 50 characters',
    'any.required': 'Pet name is required',
  }),
  animalType: Joi.string().min(1).required().messages({
    'any.required': 'Animal type is required',
  }),
  breed: Joi.string().min(1).max(50).required().messages({
    'string.min': 'Breed is required',
    'string.max': 'Breed cannot exceed 50 characters',
    'any.required': 'Breed is required',
  }),
  petAge: Joi.string().min(1).max(20).required().messages({
    'string.min': 'Pet age is required',
    'string.max': 'Pet age cannot exceed 20 characters',
    'any.required': 'Pet age is required',
  }),
  reason: Joi.string().min(10).max(500).required().messages({
    'string.min': 'Reason must be at least 10 characters long',
    'string.max': 'Reason cannot exceed 500 characters',
    'any.required': 'Reason for appointment is required',
  }),
  doctorSpecialty: Joi.string().min(1).required().messages({
    'any.required': 'Doctor specialty is required',
  }),
  date: Joi.date().min('now').required().messages({
    'date.min': 'Appointment date must be in the future',
    'any.required': 'Appointment date is required',
  }),
  time: Joi.string().required().messages({
    'any.required': 'Appointment time is required',
  }),
  additionalNotes: Joi.string().max(500).optional().allow(''),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH').default('MEDIUM'),
});

export const updateAppointmentSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED').optional(),
  doctorNotes: Joi.string().max(1000).optional().allow(''),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH').optional(),
});

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    next();
  };
};
