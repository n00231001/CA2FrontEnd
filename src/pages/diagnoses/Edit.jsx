import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/config/api";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Field, FieldLabel, FieldDescription } from '@/components/ui/field';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
 
const CONDITION_OPTIONS = [
  'Hypertension',
  'Diabetes',
  'Asthma',
  'Allergy',
  'Infection'
];

export default function Edit() {
  const [form, setForm] = useState({
    patient_id: "",
    condition: "",
    diagnosis_date: "",
    createdAt: "",
    updatedAt: "",
  });
 
  const { token } = useAuth();
  const { id } = useParams();
 
  useEffect(() => {
    const fetchappointment = async () => {
      const options = {
        method: "GET",
        url: `/diagnoses/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
 
      try {
        let response = await axios.request(options);
        let appointment = response.data;
        console.log(appointment);
 
        setForm({
          patient_id: appointment.patient_id,
          condition: appointment.condition,
          diagnosis_date: appointment.diagnosis_date,
          createdAt: appointment.createdAt,
          updatedAt: appointment.updatedAt,
        });
 
      } catch (err) {
        console.log(err);
      }
    };
 
    fetchappointment();
  }, []);
 
  const navigate = useNavigate();
 
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
 
  const updateappointment = async () => {
    const options = {
      method: "PATCH",
      url: `/diagnoses/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: form,
    };
 
    try {
      let response = await axios.request(options);
      console.log(response.data);
      navigate("/diagnoses");
    } catch (err) {
      console.log(err);
    }
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    updateappointment();
  };
 
  return (
    <>
      <h1>Update appointment</h1>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Patirtent ID"
          name="patient_id"
          value={form.patient_id}
          onChange={handleChange}
        />
        <Field>
          <FieldLabel>Condition</FieldLabel>
          <Select value={form.condition} onValueChange={(val) => setForm({ ...form, condition: val })}>
            <SelectTrigger>
              <SelectValue placeholder="Choose condition" />
            </SelectTrigger>
            <SelectContent>
              {CONDITION_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldDescription>Select the patient condition</FieldDescription>
        </Field>
        <Input
          className="mt-2"
          type="diagnosis_date"
          placeholder="diagnosis_date"
          name="diagnosis_date"
          value={form.diagnosis_date}
          onChange={handleChange}
        />
        <Input
          className="mt-2"
          type="text"
          placeholder="createdAt"
          name="createdAt"
          value={form.createdAt}
          onChange={handleChange}
        />
        <Input
          className="mt-2"
          type="text"
          placeholder="updatedAt"
          name="updatedAt"
          value={form.updatedAt}
          onChange={handleChange}
        />
        <Button className="mt-4 cursor-pointer" variant="outline" type="submit">
          Submit
        </Button>
      </form>
    </>
  );
}