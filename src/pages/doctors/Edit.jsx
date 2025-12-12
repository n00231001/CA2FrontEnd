import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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
      navigate("/doctors");
    } catch (err) {
      console.log(err);
    }
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    updateDoctor();
  };
 
  return (
    <>
      <h1>Update Doctor</h1>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="First Name"
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
        />
        <Input
          className="mt-2"
          type="text"
          placeholder="Last Name"
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
        />
        <Input
          className="mt-2"
          type="email"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <Input
          className="mt-2"
          type="text"
          placeholder="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />
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
        <Button className="mt-4 cursor-pointer" variant="outline" type="submit">
          Submit
        </Button>
      </form>
    </>
  );
}