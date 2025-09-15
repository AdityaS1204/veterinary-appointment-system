import Joi from 'joi';

export const prescriptionSchema = Joi.object({
  diagnosis: Joi.string().min(5).max(1000).required().messages({
    'string.min': 'Diagnosis must be at least 5 characters long',
    'string.max': 'Diagnosis cannot exceed 1000 characters',
    'any.required': 'Diagnosis is required',
  }),
  medications: Joi.array().items(
    Joi.object({
      name: Joi.string().min(1).max(100).required().messages({
        'string.min': 'Medication name is required',
        'string.max': 'Medication name cannot exceed 100 characters',
        'any.required': 'Medication name is required',
      }),
      dosage: Joi.string().min(1).max(50).required().messages({
        'string.min': 'Dosage is required',
        'string.max': 'Dosage cannot exceed 50 characters',
        'any.required': 'Dosage is required',
      }),
      frequency: Joi.string().min(1).max(50).required().messages({
        'string.min': 'Frequency is required',
        'string.max': 'Frequency cannot exceed 50 characters',
        'any.required': 'Frequency is required',
      }),
      duration: Joi.string().min(1).max(50).required().messages({
        'string.min': 'Duration is required',
        'string.max': 'Duration cannot exceed 50 characters',
        'any.required': 'Duration is required',
      }),
      instructions: Joi.string().max(200).optional().allow(''),
    })
  ).min(1).required().messages({
    'array.min': 'At least one medication is required',
    'any.required': 'Medications are required',
  }),
  followUpInstructions: Joi.string().min(10).max(1000).required().messages({
    'string.min': 'Follow-up instructions must be at least 10 characters long',
    'string.max': 'Follow-up instructions cannot exceed 1000 characters',
    'any.required': 'Follow-up instructions are required',
  }),
  nextAppointment: Joi.date().min('now').optional(),
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
