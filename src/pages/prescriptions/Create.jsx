import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import axios from "@/config/api";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";

import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { toast } from "sonner";

const formSchema = z.object({
  patient_id: z.coerce.number().min(1, "Patient ID is required"),
  doctor_id: z.coerce.number().min(1, "Doctor ID is required"),
  diagnosis_id: z.coerce.number().min(1, "Diagnosis ID is required"),
  medication: z.string().min(1, "Medication is required"),
  dosage: z.string().min(1, "Dosage is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
});

export default function CreatePrescription() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient_id: "",
      doctor_id: "",
      diagnosis_id: "",
      medication: "",
      dosage: "",
      start_date: "",
      end_date: "",
    },
  });

  React.useEffect(() => {
    if (!token) {
      toast.error("You must be logged in to create a prescription");
      navigate("/login");
    }
  }, [token, navigate]);

  const createPrescription = async (data) => {
    try {
      const response = await axios.request({
        method: "POST",
        url: "/prescriptions",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data,
      });

      toast.success("Prescription created successfully");
      navigate("/prescriptions");
    } catch (err) {
      console.error("Create prescription error:", err);
      const msg = err.response?.data?.message || "Failed to create prescription";
      toast.error(msg);
    }
  };

  const onSubmit = (data) => {
    createPrescription(data);
  };

  const renderDatePicker = (name, label) => (
    <div className="mt-2">
      <Popover>
        <PopoverTrigger asChild>
          <Input
            readOnly
            placeholder={label}
            value={watch(name)}
            className={errors[name] ? "border-red-500" : ""}
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <Calendar
            mode="single"
            onSelect={(d) => {
              const iso = d ? d.toISOString().slice(0, 10) : "";
              setValue(name, iso);
            }}
          />
        </PopoverContent>
      </Popover>
      {errors[name] && (
        <p className="text-sm text-red-500 mt-1">{errors[name].message}</p>
      )}
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Prescription</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller name="patient_id" control={control} render={({ field }) => (
              <Input {...field} type="number" placeholder="Patient ID" className="mt-2" />
            )} />
            {errors.patient_id && <p className="text-sm text-red-500">{errors.patient_id.message}</p>}

            <Controller name="doctor_id" control={control} render={({ field }) => (
              <Input {...field} type="number" placeholder="Doctor ID" className="mt-2" />
            )} />
            {errors.doctor_id && <p className="text-sm text-red-500">{errors.doctor_id.message}</p>}

            <Controller name="diagnosis_id" control={control} render={({ field }) => (
              <Input {...field} type="number" placeholder="Diagnosis ID" className="mt-2" />
            )} />
            {errors.diagnosis_id && <p className="text-sm text-red-500">{errors.diagnosis_id.message}</p>}

            <Controller name="medication" control={control} render={({ field }) => (
              <Input {...field} placeholder="Medication" className="mt-2" />
            )} />
            {errors.medication && <p className="text-sm text-red-500">{errors.medication.message}</p>}

            <Controller name="dosage" control={control} render={({ field }) => (
              <Input {...field} placeholder="Dosage" className="mt-2" />
            )} />
            {errors.dosage && <p className="text-sm text-red-500">{errors.dosage.message}</p>}

            {renderDatePicker("start_date", "Start Date")}
            {renderDatePicker("end_date", "End Date")}

            <Button className="w-full mt-4" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Create Prescription"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
