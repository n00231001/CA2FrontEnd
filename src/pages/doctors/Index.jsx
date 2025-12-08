import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";
import { useParams } from "react-router";

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

import { toast } from "sonner";

export default function Index() {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  
  // simple set of 5 colors for the avatar
  const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];
  // no single avatarColor here — compute per-doctor below

  useEffect(() => {
    const fetchDoctors = async () => {
      const options = {
        method: "GET",
        url: "/doctors",
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setDoctors(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDoctors();
  }, []);

  const onDeleteCallback = (id) => {
    toast.success("Doctor deleted successfully");
    setDoctors(doctors.filter(doctor => doctor.id !== id));
  
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Button
          asChild
          variant='outline'
          className='mb-4 mr-auto block'
        >
          <Link size='sm' to={`/doctors/create`}>Create New Doctor</Link>
        </Button>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.length === 0 && <p>No doctors available.</p>}
        {doctors.map((doctor) => {
          const idx = Number(doctor.id) || 0;
          const avatarColor = COLORS[Math.abs(idx) % COLORS.length];
          const initials = (doctor.first_name || "").split(" ").map(n => n[0]).join("").slice(0,3).toUpperCase();
          return (
            <Card key={doctor.id} className="p-4">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold"
                    style={{ backgroundColor: avatarColor, color: '#fff' }}
                  >
                    {initials || "?"}
                  </div>
                  <div>
                    <CardTitle>{doctor.first_name} {doctor.last_name}</CardTitle>
                    <CardDescription>{doctor.specialization || "No specialization"}</CardDescription>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground">Email: {doctor.email}</p>
                  <p className="text-sm text-muted-foreground">Phone: {doctor.phone}</p>
                </div>
              </CardHeader>
              <CardFooter className="flex justify-between gap-2 mt-4">
                <div className="flex gap-2">
                  <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger><Button variant="outline" size="icon" onClick={() => navigate(`/doctors/${doctor.id}`)}><Eye /></Button></TooltipTrigger>
                    <TooltipContent>
                      <p>View Doctor Details</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger><Button variant="outline" size="icon" onClick={() => navigate(`/doctors/${doctor.id}/edit`)}><Pencil /></Button></TooltipTrigger>
                    <TooltipContent>
                      <p>Edit Doctor Details</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger><DeleteBtn onDeleteCallback={onDeleteCallback} resource="doctors" id={doctor.id} /></TooltipTrigger>
                    <TooltipContent>
                      <p>Delete Doctor</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                  
                  
                </div>
                
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </>
  );
}
