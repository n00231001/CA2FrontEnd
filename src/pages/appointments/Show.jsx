import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams } from 'react-router';
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Show() {
  const [appointment, setappointment] = useState([]);
  const { id } = useParams();
  const { token } = useAuth();

  // simple set of 5 colors for the avatar
  const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];
  const avatarColor = (() => {
    const n = Number(id);
    if (!Number.isNaN(n)) return COLORS[Math.abs(n) % COLORS.length];
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  })();

  useEffect(() => {
    const fetchappointment = async () => {
      const options = {
        method: "GET",
        url: `/appointments/${id}`,
        headers: {
            Authorization: `Bearer ${token}`
        }
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setappointment(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchappointment();
  }, [id, token]);

  // format appointment date for display (handles ISO strings and numeric timestamps)
  const formattedAppointmentDate = (() => {
    const v = appointment?.appointment_date;
    if (!v && v !== 0) return "—";
    const d = typeof v === "number" ? new Date(v) : new Date(String(v));
    if (isNaN(d.getTime())) return String(v);
    return d.toLocaleString();
  })();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Dr. {appointment.first_name} {appointment.last_name}</CardTitle>
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold"
          style={{ backgroundColor: avatarColor, color: '#fff' }}
        >
          {appointment.first_name?.split(" ").map(n => n[0]).join("")}
        </div>
        <CardDescription>
          <h1>appointment Details:</h1>
          <p>Appointment date: {formattedAppointmentDate}</p>
          <p>Doctor ID: {appointment.doctor_id}</p>
          <p>Patient ID: {appointment.patient_id}</p>
          <p>Created At: {appointment.created_at}</p>
          <p>Updated At: {appointment.updated_at}</p>
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex-col gap-2">
      </CardFooter>
    </Card>
  );
}
