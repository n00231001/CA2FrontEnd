import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";
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
import AnimatedContent from "@/components/AnimatedContent";

export default function Index() {
  const formatDate = (dateValue) => {
  if (!dateValue) return "N/A";
  const date = new Date(dateValue);
  return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleDateString();
};

  const [filter, setFilter] = useState("all");
  const [patients, setpatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  // simple set of 5 colors for the avatar
  const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

  useEffect(() => {
    const fetchpatients = async () => {
      const options = {
        method: "GET",
        url: "/patients",
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setpatients(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchpatients();
  }, []);

  const filteredpatients = patients.filter((patient) => {
    const term = searchTerm.toLowerCase();
    const spec = (patient.created_at || patient.created_at || "").toLowerCase();

    const matchesSearch =
      patient.first_name?.toLowerCase().includes(term) ||
      patient.last_name?.toLowerCase().includes(term) ||
      patient.email?.toLowerCase().includes(term) ||
      spec.includes(term);

    const matchesFilter = filter === "all" || spec === filter;

    return matchesSearch && matchesFilter;
  });

  const onDeleteCallback = (id) => {
    toast.success("patient deleted successfully");
    setpatients(patients.filter(patient => patient.id !== id));
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="flex items-center justify-between mb-4">
        <Button
          asChild
          variant='outline'
          className='mb-4 mr-auto block'
        >
          <Link size='sm' to={`/patients/create`}>Create New patient</Link>
        </Button>
      </div>

      <div className="relative w-full">
        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredpatients.length === 0 && <p>No patients available.</p>}
          {filteredpatients.map((patient, index) => {
            const idx = Number(patient.id) || 0;
            const avatarColor = COLORS[Math.abs(idx) % COLORS.length];
            const initials = (patient.first_name || "").split(" ").map(n => n[0]).join("").slice(0,3).toUpperCase();
            return (
              <AnimatedContent
                key={patient.id}
                distance={150}
                direction="vertical"
                reverse={false}
                duration={1.2}
                ease="bounce.out"
                initialOpacity={0.2}
                animateOpacity
                scale={1.1}
                threshold={0.2}
                delay={0.15 * index}
              >
                <Card className="p-4 backdrop-blur supports-[backdrop-filter]:bg-background/70">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold"
                        style={{ backgroundColor: avatarColor, color: '#fff' }}
                      >
                        {initials || "?"}
                      </div>
                      <div>
                        <CardTitle>{patient.first_name} {patient.last_name}</CardTitle>
                        <CardDescription>{patient.created_at || patient.created_at || "No specialization"}</CardDescription>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      <p className="text-sm text-muted-foreground">Email: {patient.email}</p>
                      <p className="text-sm text-muted-foreground">Phone: {patient.phone}</p>
                      
                      <p className="text-sm text-muted-foreground">
                        Date of birth: {formatDate(patient.date_of_birth)}
                      </p>

                      <p className="text-sm text-muted-foreground">address: {patient.address}</p>
                    </div>
                  </CardHeader>
                  <CardFooter className="mt-4 flex justify-between gap-2">
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => navigate(`/patients/${patient.id}`)}><Eye /></Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View patient Details</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => navigate(`/patients/${patient.id}/edit`)}><Pencil /></Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit patient Details</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DeleteBtn onDeleteCallback={onDeleteCallback} resource="patients" id={patient.id} />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete patient</p>
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
      <footer>
      <div className="h-16" />
      
      </footer>
    </>
  );
}
