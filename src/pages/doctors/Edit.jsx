import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import axios from "@/config/api";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
 
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

export default function Edit() {
  const navigate = useNavigate();
    const { token } = useAuth();
  
    // react-hook-form methods (rename to avoid colliding with local form state)
    const rhf = useForm({
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
    // local controlled form state used by inputs & submit
    const [form, setForm] = useState({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      specialisation: "",
    });
    console.log("useAuth token:", token);
  const { id } = useParams();
 
  useEffect(() => {
    const fetchDoctor = async () => {
      const options = {
        method: "GET",
        url: `/doctors/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      if (!token) {
            console.error("No token found");
            toast.error("Please log in to create a doctor");
            navigate('/doctors', { state: { from: '/doctors/create' } });
            return;
        }
 
      try {
        let response = await axios.request(options);
        let doctor = response.data;
        console.log(doctor);
 
        setForm({
          first_name: doctor.first_name,
          last_name: doctor.last_name,
          email: doctor.email,
          phone: doctor.phone,
          specialisation: doctor.specialisation,
        });
 
      } catch (err) {
        console.log(err);
      }
    };
 
    fetchDoctor();
  }, []);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    rhf.setValue(name, value, { shouldValidate: true });
  };
 
  const updateDoctor = async () => {
    const options = {
      method: "PATCH",
      url: `/doctors/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: form,
    };
    try {
      let response = await axios.request(options);
      console.log(response.data);
      toast.success("Doctor successfully edited");
      navigate("/doctors", {
        state: {
          type: "success",
          message: "Doctor successfully edited",
        },
      });
    } catch (err) {
      console.log(err);
      toast.error("Failed to update doctor");
    }
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    updateDoctor();
  };
 
  return (
    <div className="mx-auto max-w-2xl bg-black p-1 rounded-lg shadow-md">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Update Doctor</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="First Name"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
              />
              {rhf.formState.errors.first_name && (
                <p className="text-xs text-red-500 mt-1">
                  {rhf.formState.errors.first_name.message}
                </p>
              )}
            </div>
            <div>
              <Input
                type="text"
                placeholder="Last Name"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
              />
              {rhf.formState.errors.last_name && (
                <p className="text-xs text-red-500 mt-1">
                  {rhf.formState.errors.last_name.message}
                </p>
              )}
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              {rhf.formState.errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {rhf.formState.errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Input
                type="text"
                placeholder="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
              {rhf.formState.errors.phone && (
                <p className="text-xs text-red-500 mt-1">
                  {rhf.formState.errors.phone.message}
                </p>
              )}
            </div>
            <Controller
              name="specialisation"
              control={rhf.control}
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
              Update Doctor
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}