import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";
import { useAuth } from "@/hooks/useAuth";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import AnimatedContent from "@/components/AnimatedContent";
import { toast } from "sonner";

export default function Index() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

  const unixToLocalDateString = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
    return date.toLocaleDateString(); // Format the date to a readable string
  };

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

  const doctorIds = Array.from(
    new Set(appointments.map((a) => String(a.doctor_id || "")).filter(Boolean))
  ).sort((a, b) => Number(a) - Number(b));

  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === "all") return true;
    return String(appointment.doctor_id) === filter;
  });

  return (
    <>
      <Button asChild variant="outline" className="mb-4 mr-auto block">
        <Link to={`/appointments/create`}>Create New appointment</Link>
      </Button>
      {/* filter buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["all", ...doctorIds].map((item) => (
          <Button
            key={item}
            variant={filter === item ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(item)}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </Button>
        ))}
      </div>

      <div className="relative w-full">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAppointments.length === 0 && <p>No appointments available.</p>}
          {filteredAppointments.map((appointment, index) => {
            const idx = Number(appointment.id) || 0;
            const avatarColor = COLORS[Math.abs(idx) % COLORS.length];
            const dateStr = unixToLocalDateString(appointment.appointment_date);
            const createdStr = appointment.createdAt ? new Date(appointment.createdAt).toLocaleString() : '—';
            const updatedStr = appointment.updatedAt ? new Date(appointment.updatedAt).toLocaleString() : '—';

            return (
              <AnimatedContent
                key={appointment.id}
                distance={150}
                direction="vertical"
                reverse={false}
                duration={1.0}
                ease="power3.out"
                initialOpacity={0.2}
                animateOpacity
                scale={1.02}
                threshold={0.2}
                delay={0.12 * index}
              >
                <Card className="p-4 backdrop-blur supports-[backdrop-filter]:bg-background/70">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold"
                        style={{ backgroundColor: avatarColor, color: '#fff' }}
                      >
                        {dateStr.split('/')[0] || '?'}
                      </div>
                      <div>
                        <CardTitle>Appointment #{appointment.id}</CardTitle>
                        <CardDescription>{dateStr}</CardDescription>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      <p className="text-sm text-muted-foreground">Doctor ID: {appointment.doctor_id}</p>
                      <p className="text-sm text-muted-foreground">Patient ID: {appointment.patient_id}</p>
                      <p className="text-sm text-muted-foreground">Created: {createdStr}</p>
                      <p className="text-sm text-muted-foreground">Updated: {updatedStr}</p>
                    </div>
                  </CardHeader>
                  <CardFooter className="mt-4 flex justify-between gap-2">
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => navigate(`/appointments/${appointment.id}`)}>
                              <Eye />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Appointment</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => navigate(`/appointments/${appointment.id}/edit`)}>
                              <Pencil />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit Appointment</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DeleteBtn onDeleteCallback={onDeleteCallback} resource="appointments" id={appointment.id} />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete Appointment</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardFooter>
                </Card>
              </AnimatedContent>
            );
          })}
        </div>
      </div>
    </>
  );
}