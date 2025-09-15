import Joi from 'joi';

export const reviewSchema = Joi.object({
  appointmentId: Joi.string().required().messages({
    'any.required': 'Appointment ID is required',
    'string.empty': 'Appointment ID cannot be empty',
  }),
  rating: Joi.number().integer().min(1).max(5).required().messages({
    'number.min': 'Rating must be at least 1',
    'number.max': 'Rating cannot exceed 5',
    'any.required': 'Rating is required',
  }),
  comment: Joi.string().min(10).max(500).required().messages({
    'string.min': 'Comment must be at least 10 characters long',
    'string.max': 'Comment cannot exceed 500 characters',
    'any.required': 'Comment is required',
  }),
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
