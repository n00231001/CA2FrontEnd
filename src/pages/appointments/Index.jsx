import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";
import { useAuth } from "@/hooks/useAuth";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

export default function Index() {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchappointments = async () => {
      const options = {
        method: "GET",
        url: "/appointments",
        headers: {},
      };

      if (token) {
        options.headers.Authorization = `Bearer ${token}`;
      }

      try {
        const response = await axios.request(options);
        console.log(response.data);
        setAppointments(response.data);
      } catch (err) {
        console.error("Fetch appointments error:", err);
        toast.error("Failed to load appointments");
      }
    };

    fetchappointments();
  }, [token]);

  const onDeleteCallback = (id) => {
    toast.success("Appointment deleted successfully");
    setAppointments(appointments.filter((appointment) => appointment.id !== id));
  };

  return (
    <>
      <Button asChild variant="outline" className="mb-4 mr-auto block">
        <Link to={`/appointments/create`}>Create New appointment</Link>
      </Button>

      <Table>
        <TableCaption>A list of your recent appointments.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>{appointment.appointment_date}</TableCell>
              <TableCell>{appointment.doctor_id}</TableCell>
              <TableCell>{appointment.patient_id}</TableCell>
              <TableCell>{appointment.createdAt}</TableCell>
              <TableCell>{appointment.updatedAt}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    className="cursor-pointer hover:border-blue-500"
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/appointments/${appointment.id}`)}
                  >
                    <Eye />
                  </Button>
                  <Button
                    className="cursor-pointer hover:border-blue-500"
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/appointments/${appointment.id}/edit`)}
                  >
                    <Pencil />
                  </Button>
                  <DeleteBtn onDeleteCallback={onDeleteCallback} resource="appointments" id={appointment.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}