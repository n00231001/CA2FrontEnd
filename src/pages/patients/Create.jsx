import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import axios from "@/config/api";
import { useNavigate } from 'react-router';
import { useAuth } from "@/hooks/useAuth";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"

// toast for user feedback
import { toast } from "sonner";

const formSchema = z.object({
  date_of_birth: z.string().min(1, "Date of birth is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
});

export default function Create() {
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        setValue,
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

    const [date, setDate] = React.useState(new Date())
    const navigate = useNavigate();
    const { token } = useAuth();
    
    console.log('useAuth token:', token);
    
    React.useEffect(() => {
        if (token === undefined) return;
        if (!token) {
            toast.error("You must be logged in to create a patient");
        }
    }, [token]);
    
    const createPatient = async (data) => {
        if (!token) {
            console.error("No token found");
            toast.error("Please log in to create a patient");
            navigate('/patients', { state: { from: '/patients/create' } });
            return;
        }

        const options = {
            method: "POST",
            url: `/patients`,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            data: data
        };

        try {
            let response = await axios.request(options);
            console.log("Create success:", response.data);
            navigate('/patients', { state: { 
                type: 'success',
                message: `patient "${response.data.name || response.data.first_name || 'created'}" created successfully` 
            }});
        } catch (err) {
            console.error("Create error:", err);
            if (err.response) {
                console.error("Response status:", err.response.status);
                console.error("Response data:", err.response.data);
                if (err.response.status === 422) {
                    const serverData = err.response.data;
                    const details = serverData?.errors || serverData?.message || serverData;
                    toast.error(`Validation failed: ${JSON.stringify(details)}`);
                } else {
                    const msg = err.response.data?.message || JSON.stringify(err.response.data);
                    toast.error(`Create failed: ${msg}`);
                }
            } else {
                toast.error("Network error or no response from server.");
            }
        }
    };

    const onSubmit = (data) => {
        console.log("Submitting payload:", data);
        const now = new Date().toISOString();
        const submitData = {
            ...data,
            created_at: now,
            updated_at: now
        };
        createPatient(submitData);
    };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create a new patient</CardTitle>
        </CardHeader>
        <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Date picker as a dropdown popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Input
                  type="text"
                  placeholder="Select date of birth"
                  readOnly
                  value={watch('date_of_birth')}
                  aria-invalid={errors.date_of_birth ? "true" : "false"}
                  className={errors.date_of_birth ? "border-red-500" : ""}
                />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <div style={{ padding: 8 }}>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                      setDate(d);
                      const iso = d ? d.toISOString().slice(0, 10) : "";
                      setValue('date_of_birth', iso);
                    }}
                    className="rounded-lg border"
                  />
                </div>
              </PopoverContent>
            </Popover>
            {errors.date_of_birth && (
                <p className="text-sm text-red-500 mt-1">{errors.date_of_birth.message}</p>
            )}

            <Controller
                name="first_name"
                control={control}
                render={({ field }) => (
                    <>
                        <Input 
                            className={`mt-2 ${errors.first_name ? "border-red-500" : ""}`}
                            type="text"
                            placeholder="First name"
                            {...field}
                            aria-invalid={errors.first_name ? "true" : "false"}
                        />{errors.first_name && (
                            <p className="text-sm text-red-500 mt-1">{errors.first_name.message}</p>
                        )}
                        
                    </>
                )}
            />

            <Controller
                name="last_name"
                control={control}
                render={({ field }) => (
                    <>
                        <Input 
                            className={`mt-2 ${errors.last_name ? "border-red-500" : ""}`}
                            type="text"
                            placeholder="Last name"
                            {...field}
                            aria-invalid={errors.last_name ? "true" : "false"}
                        />
                        {errors.last_name && (
                            <p className="text-sm text-red-500 mt-1">{errors.last_name.message}</p>
                        )}
                    </>
                )}
            />

            <Controller
                name="email"
                control={control}
                render={({ field }) => (
                    <>
                        <Input 
                            className={`mt-2 ${errors.email ? "border-red-500" : ""}`}
                            type="email"
                            placeholder="Email"
                            {...field}
                            aria-invalid={errors.email ? "true" : "false"}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                        )}
                    </>
                )}
            />

            <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                    <>
                        <Input 
                            className={`mt-2 ${errors.phone ? "border-red-500" : ""}`}
                            type="text"
                            placeholder="Phone"
                            {...field}
                            aria-invalid={errors.phone ? "true" : "false"}
                        />
                        {errors.phone && (
                            <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                        )}
                    </>
                )}
            />

            <Controller
                name="address"
                control={control}
                render={({ field }) => (
                    <>
                        <Input 
                            className={`mt-2 ${errors.address ? "border-red-500" : ""}`}
                            type="text"
                            placeholder="Address"
                            {...field}
                            aria-invalid={errors.address ? "true" : "false"}
                        />
                        {errors.address && (
                            <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
                        )}
                    </>
                )}
            />
            
            <Button 
                className="w-full mt-4 cursor-pointer" 
                type="submit"
                disabled={isSubmitting}
            >{isSubmitting ? "Submitting..." : "Submit"}</Button>
        </form>
        </CardContent>
      </Card>
    </div>
  );
}