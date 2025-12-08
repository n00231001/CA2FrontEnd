import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/config/api";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

export default function Edit() {
  const [date, setDate] = React.useState(new Date());
  const [form, setForm] = useState({
    appointment_date: "",
    doctor_id: "",
    patient_id: "",
    
  });

  const { token } = useAuth();
  const { id } = useParams();

  useEffect(() => {
    if (!id || !token) return;
    const fetchappointment = async () => {
      try {
        const response = await axios.request({
          method: "GET",
          url: `/appointments/${id}`,
          headers: { Authorization: `Bearer ${token}` },
        });
        const appointment = response.data;
        console.log("fetched appointment:", appointment);
        // map API fields exactly to your form fields
        setForm({
          appointment_date: appointment.appointment_date || "",
          doctor_id: appointment.doctor_id?.toString?.() || "",
          patient_id: appointment.patient_id?.toString?.() || "",
          phone: appointment.phone || "",
        });
      } catch (err) {
        console.error("fetch appointment error:", err.response?.data || err);
      }
    };
    fetchappointment();
  }, [id, token]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const updateappointment = async (payload) => {
    try {
      const response = await axios.request({
        method: "PATCH",
        url: `/appointments/${id}`,
        headers: { Authorization: `Bearer ${token}` },
        data: payload,
      });
      console.log("update success:", response.data);
      navigate("/appointments");
    } catch (err) {
      console.error("update error:", err.response?.data || err);
      // show server validation details if present
      if (err.response?.data) alert(`Update failed: ${JSON.stringify(err.response.data)}`);
    }
  };

   const handleSubmit = (e) => {
     e.preventDefault();
    // convert ID strings to numbers if API expects numbers
    const doctorId = Number(form.doctor_id);
    const patientId = Number(form.patient_id);
    if (form.doctor_id && Number.isNaN(doctorId)) return alert("Doctor ID must be a number");
    if (form.patient_id && Number.isNaN(patientId)) return alert("Patient ID must be a number");
    const payload = {
      ...form,
      doctor_id: doctorId,
      patient_id: patientId,
    };
    updateappointment(payload);
   };

  return (
    <>
      <h1>Update appointment</h1>
      <form onSubmit={handleSubmit}>
        {/* Date picker as a dropdown popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Input
              type="text"
              placeholder="Select date"
              name="appointment_date"
              readOnly
              value={form.appointment_date}
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
                  setForm((prev) => ({ ...prev, appointment_date: iso }));
                }}
                className="rounded-lg border"
              />
            </div>
          </PopoverContent>
        </Popover>
        <Input
          className="mt-2"
          type="text"
          placeholder="Doctor ID"
          name="doctor_id"
          value={form.doctor_id}
          onChange={handleChange}
        />
        <Input
          className="mt-2"
          type="text"
          placeholder="patient ID"
          name="patient_id"
          value={form.patient_id}
          onChange={handleChange}
        />
        
        <Button className="mt-4 cursor-pointer" variant="outline" type="submit">
          Submit
        </Button>
      </form>
    </>
  );
}