import { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from '@/config/api';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Field, FieldLabel, FieldDescription } from '@/components/ui/field';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

const DIAGNOSED_OPTIONS = [
    'Hypertension',
    'Diabetes',
    'Asthma',
    'Allergy',
    'Infection'
];

const schema = z.object({
    patient_id: z
        .string()
        .min(1, 'Patient ID is required')
        .refine((v) => !isNaN(Number(v)), 'Patient ID must be a number'),
    diagnosis_date: z.date({ required_error: 'Diagnosis date is required' }),
    condition: z.string().min(2, 'Condition is required'),
    diagnosed_with: z.enum(DIAGNOSED_OPTIONS, {
        errorMap: () => ({ message: 'Please choose a diagnosis type' })
    })
});

export default function Create() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            patient_id: '',
            diagnosis_date: undefined,
            condition: '',
            diagnosed_with: ''
        }
    });

    const onSubmit = async (values) => {
        if (!token) {
            toast.error('Not authenticated. Please log in.');
            return;
        }

        const payload = {
            patient_id: Number(values.patient_id),
            diagnosis_date: Math.floor(values.diagnosis_date.getTime() / 1000),
            condition: values.condition,
            diagnosed_with: values.diagnosed_with
        };

        try {
            setSubmitting(true);
            const response = await axios.post('/diagnoses', payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success('Diagnosis created successfully');
            navigate('/diagnoses', {
                state: {
                    type: 'success',
                    message: `Diagnosis for patient ${payload.patient_id} created`
                }
            });
        } catch (err) {
            if (err?.response?.status === 422) {
                const details = err.response.data?.errors || err.response.data;
                toast.error(`Validation failed: ${JSON.stringify(details)}`);
            } else {
                const message = err?.response?.data?.message || 'Create failed';
                toast.error(message);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const selectedDate = watch('diagnosis_date');

    return (
        <div className="mx-auto max-w-xl">
            <Card>
                <CardHeader>
                    <CardTitle>Create Diagnosis</CardTitle>
                </CardHeader>
                <CardContent>
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Input placeholder="Patient ID" {...register('patient_id')} />
                            {errors.patient_id && (
                                <p className="mt-1 text-sm text-red-500">{errors.patient_id.message}</p>
                            )}
                        </div>

                        <div>
                            <Controller
                                name="diagnosis_date"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full justify-start">
                                                    {field.value ? format(field.value, 'PPP') : 'Select diagnosis date'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={(date) => field.onChange(date)}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </>
                                )}
                            />
                            {errors.diagnosis_date && (
                                <p className="mt-1 text-sm text-red-500">{errors.diagnosis_date.message}</p>
                            )}
                        </div>

                        <div>
                            <Input placeholder="Condition" {...register('condition')} />
                            {errors.condition && (
                                <p className="mt-1 text-sm text-red-500">{errors.condition.message}</p>
                            )}
                        </div>
                        

                        <CardFooter className="px-0">
                            <Button type="submit" variant="outline" className="w-full" disabled={submitting}>
                                {submitting ? 'Submitting...' : 'Submit'}
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}