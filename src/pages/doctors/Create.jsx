import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/config/api";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";

import * as React from "react";

import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required"),
  phone: z.string().min(1, "Phone number is required"),
  specialisation: z.enum([
    "Podiatrist",
    "Dermatologist",
    "Pediatrician",
    "Psychiatrist",
    "General Practitioner",
  ]),
});

export default function Create() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      specialisation: "",
    },
    mode: "onChange",
  });
  console.log("useAuth token:", token);

  const onSubmit = async (data) => {
    const playload = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      specialisation: data.specialisation,
    };
    try {
      await axios.post("/doctors", playload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/doctors", {
        state: {
          type: "success",
          message: `Doctor "${data.first_name} ${data.last_name}" created successfully`,
        },
      });
    } catch (error) {
      console.error("Error creating doctor:", error);
    }
  };

  // debug: show token value so you can confirm auth state
  // React.useEffect(() => {
  //     if (token === undefined) return; // still initializing
  //     if (!token) {
  //         toast.error("You must be logged in to create appointments");
  //     }
  // }, [token]);

  // const handleChange = (e) => {
  //     setForm({
  //         ...form,
  //         [e.target.name] : e.target.value
  //     });
  // };

  // const createappointment = async (data) => {
  //     // guard — redirect to login if token disappears
  //     if (!token) {
  //         console.error("No token found");
  //         toast.error("Please log in to create an appointment");
  //         navigate('/patients', { state: { from: '/appointments/create' } });
  //         return;
  //     }

  //     const options = {
  //         method: "POST",
  //         url: `/appointments`,
  //         headers: {
  //             Authorization: `Bearer ${token}`,
  //             "Content-Type": "application/json"
  //         },
  //         data: data
  //     };

  //     try {
  //         setSubmitting(true);
  //         let response = await axios.request(options);
  //         console.log("Create success:", response.data);
  //         navigate('/appointments', { state: {
  //             type: 'success',
  //             message: `appointment "${response.data.name || response.data.title || response.data.first_name || 'created'}" created successfully`
  //         }});
  //     } catch (err) {
  //         console.error("Create error:", err);
  //         if (err.response) {
  //             console.error("Response status:", err.response.status);
  //             console.error("Response data:", err.response.data);
  //             if (err.response.status === 422) {
  //                 const serverData = err.response.data;
  //                 const details = serverData?.errors || serverData?.message || serverData;
  //                 alert(`Validation failed: ${JSON.stringify(details)}`);
  //             } else {
  //                 const msg = err.response.data?.message || JSON.stringify(err.response.data);
  //                 alert(`Create failed: ${msg}`);
  //             }
  //         } else {
  //             alert("Network error or no response from server.");
  //         }
  //     } finally {
  //         setSubmitting(false);
  //     }

  // };

  // const handleSubmit = (e) => {
  //     e.preventDefault();
  //     // basic client-side validation to avoid obvious 422s
  //     if (!form.appointment_date.trim()) {
  //         alert("Please provide appointment date.");
  //         return;
  //     }
  //     const doctorId = Number(form.doctor_id);
  //     const patientId = Number(form.patient_id);
  //     if (!form.doctor_id.trim() || Number.isNaN(doctorId)) {
  //         alert("Please provide a valid numeric Doctor ID.");
  //         return;
  //     }
  //     if (!form.patient_id.trim() || Number.isNaN(patientId)) {
  //         alert("Please provide a valid numeric Patient ID.");
  //         return;
  //     }

  //     // stamp created_at and updated_at with current ISO timestamp
  //     const now = new Date().toISOString();
  //     const submitData = {
  //         ...form,
  //         doctor_id: doctorId,
  //         patient_id: patientId,
  //         created_at: now,
  //         updated_at: now
  //     };
  //     console.log("Submitting payload:", submitData);
  //     createappointment(submitData);
  // };

  return (
    <>
      <h1>Create a new appointment</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-sm">

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">First Name</label>
          <Input
            type="text"
            placeholder="First Name"
            {...form.register("first_name")}
          />
          {form.formState.errors.first_name && (
            <p className="text-xs text-red-500">
              {form.formState.errors.first_name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Last Name</label>
          <Input
            type="text"
            placeholder="Last Name"
            {...form.register("last_name")}
          />
          {form.formState.errors.last_name && (
            <p className="text-xs text-red-500">
              {form.formState.errors.last_name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Email</label>
          <Input
            type="text"
            placeholder="email"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-xs text-red-500">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Phone</label>
          <Input
            type="text"
            placeholder="Phone"
            {...form.register("phone")}
          />
          {form.formState.errors.phone && (
            <p className="text-xs text-red-500">
              {form.formState.errors.phone.message}
            </p>
          )}
        </div>

        <Controller
              name="specialisation"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Specialisation</FieldLabel>
                  <Select
                    name={field.name}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Choose specialisation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Podiatrist">Podiatrist</SelectItem>
                      <SelectItem value="Dermatologist">Dermatologist</SelectItem>
                      <SelectItem value="Pediatrician">Pediatrician</SelectItem>
                      <SelectItem value="Psychiatrist">Psychiatrist</SelectItem>
                      <SelectItem value="General Practitioner">
                        General Practitioner
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    Select your specialisation
                  </FieldDescription>
                </Field>
              )}
            />
       
        <Button className="mt-4 cursor-pointer" variant="outline" type="submit">
          Submit
        </Button>
      </form>
    </>
  );
}
