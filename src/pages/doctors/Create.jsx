import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Create Doctor</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">

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
       
            <Button className="w-full cursor-pointer" variant="default" type="submit">
              Create Doctor
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
