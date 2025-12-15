import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import axios from "@/config/api";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/* ---------------------------- Schema ---------------------------- */

const formSchema = z.object({
  date_of_birth: z.string().min(1, "Date of birth is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
});

/* ---------------------------- Component ---------------------------- */

export default function Edit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [calendarDate, setCalendarDate] = useState(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date_of_birth: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  /* ---------------------------- Fetch patient ---------------------------- */

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(`/patients/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const patient = response.data;

        reset({
          first_name: patient.first_name,
          last_name: patient.last_name,
          email: patient.email,
          phone: patient.phone,
          address: patient.address,
          date_of_birth: patient.date_of_birth || "",
        });

        if (patient.date_of_birth) {
          setCalendarDate(new Date(patient.date_of_birth));
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load patient");
      }
    };

    fetchPatient();
  }, [id, token, reset]);

  /* ---------------------------- Submit ---------------------------- */

  const updatePatient = async (data) => {
    setLoading(true);

    try {
      await axios.patch(`/patients/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Patient updated successfully");
      navigate("/patients");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------- JSX ---------------------------- */

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Update Patient</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(updatePatient)}>
            {/* Date of Birth */}
            <Popover>
              <PopoverTrigger asChild>
                <Input
                  readOnly
                  placeholder="Select date of birth"
                  value={watch("date_of_birth")}
                  disabled={loading || isSubmitting}
                  aria-invalid={!!errors.date_of_birth}
                  className={errors.date_of_birth ? "border-red-500" : ""}
                />
              </PopoverTrigger>

              <PopoverContent className="w-auto p-2">
                <Calendar
                  mode="single"
                  selected={calendarDate}
                  onSelect={(date) => {
                    setCalendarDate(date);
                    const value = date
                      ? date.toISOString().slice(0, 10)
                      : "";
                    setValue("date_of_birth", value, {
                      shouldValidate: true,
                    });
                  }}
                />
              </PopoverContent>
            </Popover>

            {errors.date_of_birth && (
              <p className="text-sm text-red-500 mt-1">
                {errors.date_of_birth.message}
              </p>
            )}

            {/* Text Fields */}
            {[
              { name: "first_name", placeholder: "First name" },
              { name: "last_name", placeholder: "Last name" },
              { name: "email", placeholder: "Email", type: "email" },
              { name: "phone", placeholder: "Phone" },
              { name: "address", placeholder: "Address" },
            ].map(({ name, placeholder, type = "text" }) => (
              <Controller
                key={name}
                name={name}
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      type={type}
                      placeholder={placeholder}
                      className={`mt-2 ${
                        fieldState.error ? "border-red-500" : ""
                      }`}
                      disabled={loading || isSubmitting}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.error && (
                      <p className="text-sm text-red-500 mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                )}
              />
            ))}

            <Button
              className="w-full mt-4"
              type="submit"
              disabled={loading || isSubmitting}
            >
              {loading || isSubmitting ? "Updating..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
