import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import axios from "@/config/api";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  appointment_date: z.string().min(1, "Date is required"),
  doctor_id: z.coerce.number().int().positive("Doctor ID must be a number"),
  patient_id: z.coerce.number().int().positive("Patient ID must be a number"),
});

export default function Edit() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appointment_date: "",
      doctor_id: "",
      patient_id: "",
    },
  });

  const [date, setDate] = useState(new Date());
  const { token } = useAuth();
  const { id } = useParams();

  useEffect(() => {
    if (!id || !token) return;
    const fetchAppointment = async () => {
      try {
        const response = await axios.request({
          method: "GET",
          url: `/appointments/${id}`,
          headers: { Authorization: `Bearer ${token}` },
        });
        const appointment = response.data;
        reset({
          appointment_date: appointment.appointment_date || "",
          doctor_id: appointment.doctor_id?.toString?.() || "",
          patient_id: appointment.patient_id?.toString?.() || "",
        });
        if (appointment.appointment_date) {
          setDate(new Date(appointment.appointment_date));
        }
      } catch (err) {
        console.error("fetch appointment error:", err.response?.data || err);
        toast.error("Failed to load appointment");
      }
    };
    fetchAppointment();
  }, [id, token, reset]);

  const navigate = useNavigate();

  const updateAppointment = async (data) => {
    if (!token) {
      toast.error("Please log in to update an appointment");
      navigate("/login", { state: { from: `/appointments/${id}/edit` } });
      return;
    }

    const now = new Date().toISOString();
    const payload = {
      ...data,
      created_at: data.created_at || now,
      updated_at: now,
    };

    try {
      await axios.request({
        method: "PATCH",
        url: `/appointments/${id}`,
        headers: { Authorization: `Bearer ${token}` },
        data: payload,
      });
      toast.success("Appointment updated successfully");
      navigate("/appointments");
    } catch (err) {
      console.error("update error:", err.response?.data || err);
      if (err.response?.status === 422) {
        const details = err.response.data?.errors || err.response.data?.message || err.response.data;
        toast.error(`Validation failed: ${JSON.stringify(details)}`);
      } else {
        const msg = err.response?.data?.message || "Update failed";
        toast.error(msg);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Update appointment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(updateAppointment)}>
            <Popover>
              <PopoverTrigger asChild>
                <Input
                  type="text"
                  placeholder="Select date"
                  readOnly
                  value={watch("appointment_date")}
                  disabled={isSubmitting}
                  aria-invalid={errors.appointment_date ? "true" : "false"}
                  className={errors.appointment_date ? "border-red-500" : ""}
                />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <div style={{ padding: 8 }}>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                      setDate(d || new Date());
                      const iso = d ? d.toISOString().slice(0, 10) : "";
                      setValue("appointment_date", iso, { shouldValidate: true });
                    }}
                    className="rounded-lg border"
                  />
                </div>
              </PopoverContent>
            </Popover>
            {errors.appointment_date && (
              <p className="text-sm text-red-500 mt-1">{errors.appointment_date.message}</p>
            )}

            <Controller
              name="doctor_id"
              control={control}
              render={({ field }) => (
                <>
                  <Input
                    className={`mt-2 ${errors.doctor_id ? "border-red-500" : ""}`}
                    type="text"
                    placeholder="Doctor ID"
                    {...field}
                    disabled={isSubmitting}
                    aria-invalid={errors.doctor_id ? "true" : "false"}
                  />
                  {errors.doctor_id && (
                    <p className="text-sm text-red-500 mt-1">{errors.doctor_id.message}</p>
                  )}
                </>
              )}
            />

            <Controller
              name="patient_id"
              control={control}
              render={({ field }) => (
                <>
                  <Input
                    className={`mt-2 ${errors.patient_id ? "border-red-500" : ""}`}
                    type="text"
                    placeholder="Patient ID"
                    {...field}
                    disabled={isSubmitting}
                    aria-invalid={errors.patient_id ? "true" : "false"}
                  />
                  {errors.patient_id && (
                    <p className="text-sm text-red-500 mt-1">{errors.patient_id.message}</p>
                  )}
                </>
              )}
            />

            <Button
              className="w-full mt-4 cursor-pointer"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}