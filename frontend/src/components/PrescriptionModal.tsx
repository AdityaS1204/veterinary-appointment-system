import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, X, Pill, FileText } from 'lucide-react';

const prescriptionSchema = z.object({
  diagnosis: z.string().min(5, 'Please enter diagnosis'),
  medications: z.array(z.object({
    name: z.string().min(1, 'Medication name is required'),
    dosage: z.string().min(1, 'Dosage is required'),
    frequency: z.string().min(1, 'Frequency is required'),
    duration: z.string().min(1, 'Duration is required'),
    instructions: z.string().optional(),
  })).min(1, 'At least one medication is required'),
  followUpInstructions: z.string().min(10, 'Please provide follow-up instructions'),
  nextAppointment: z.string().optional(),
});

type PrescriptionFormData = z.infer<typeof prescriptionSchema>;

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  petName: string;
  ownerName: string;
  onSubmitPrescription: (prescription: PrescriptionFormData & { appointmentId: string }) => void;
}

const PrescriptionModal: React.FC<PrescriptionModalProps> = ({ 
  isOpen, 
  onClose, 
  appointmentId, 
  petName, 
  ownerName,
  onSubmitPrescription 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'medications'
  });

  const onSubmit = async (data: PrescriptionFormData) => {
    setIsSubmitting(true);
    try {
      const prescriptionData = {
        ...data,
        appointmentId
      };
      
      onSubmitPrescription(prescriptionData);
      reset();
      onClose();
    } catch (error) {
      console.error('Error submitting prescription:', error);
      alert('Failed to submit prescription. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center">
              <Pill className="h-5 w-5 mr-2 text-primary" />
              Prescription & Treatment Plan
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Pet:</strong> {petName} | <strong>Owner:</strong> {ownerName}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Diagnosis */}
          <div>
            <Label htmlFor="diagnosis">Diagnosis *</Label>
            <Textarea
              id="diagnosis"
              {...register('diagnosis')}
              className="mt-1"
              placeholder="Enter the diagnosis..."
              rows={3}
            />
            {errors.diagnosis && (
              <p className="text-sm text-red-600 mt-1">{errors.diagnosis.message}</p>
            )}
          </div>

          {/* Medications */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base font-medium">Medications *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: '', dosage: '', frequency: '', duration: '', instructions: '' })}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Medication
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-sm">Medication {index + 1}</h4>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`medications.${index}.name`}>Medication Name *</Label>
                        <Input
                          {...register(`medications.${index}.name`)}
                          placeholder="e.g., Amoxicillin"
                          className="mt-1"
                        />
                        {errors.medications?.[index]?.name && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.medications[index]?.name?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`medications.${index}.dosage`}>Dosage *</Label>
                        <Input
                          {...register(`medications.${index}.dosage`)}
                          placeholder="e.g., 250mg"
                          className="mt-1"
                        />
                        {errors.medications?.[index]?.dosage && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.medications[index]?.dosage?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`medications.${index}.frequency`}>Frequency *</Label>
                        <Input
                          {...register(`medications.${index}.frequency`)}
                          placeholder="e.g., Twice daily"
                          className="mt-1"
                        />
                        {errors.medications?.[index]?.frequency && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.medications[index]?.frequency?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`medications.${index}.duration`}>Duration *</Label>
                        <Input
                          {...register(`medications.${index}.duration`)}
                          placeholder="e.g., 7 days"
                          className="mt-1"
                        />
                        {errors.medications?.[index]?.duration && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.medications[index]?.duration?.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4">
                      <Label htmlFor={`medications.${index}.instructions`}>Special Instructions</Label>
                      <Textarea
                        {...register(`medications.${index}.instructions`)}
                        placeholder="Any special instructions for this medication..."
                        rows={2}
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {errors.medications && (
              <p className="text-sm text-red-600 mt-1">{errors.medications.message}</p>
            )}
          </div>

          {/* Follow-up Instructions */}
          <div>
            <Label htmlFor="followUpInstructions">Follow-up Instructions *</Label>
            <Textarea
              id="followUpInstructions"
              {...register('followUpInstructions')}
              className="mt-1"
              placeholder="Provide detailed follow-up care instructions..."
              rows={4}
            />
            {errors.followUpInstructions && (
              <p className="text-sm text-red-600 mt-1">{errors.followUpInstructions.message}</p>
            )}
          </div>

          {/* Next Appointment */}
          <div>
            <Label htmlFor="nextAppointment">Next Appointment (Optional)</Label>
            <Input
              id="nextAppointment"
              type="date"
              {...register('nextAppointment')}
              className="mt-1"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Prescription'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PrescriptionModal;
