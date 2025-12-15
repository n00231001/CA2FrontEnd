import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";
import { useAuth } from "@/hooks/useAuth";

import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import AnimatedContent from "@/components/AnimatedContent";
import { toast } from "sonner";

export default function Index() {
  const [diagnoses, setdiagnoses] = useState([]);
  const navigate = useNavigate();
  const { token } = useAuth();
  const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

  const formatDate = (value) => {
    if (!value) return "N/A";
    const date = new Date(value);
    return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleDateString();
  };

  useEffect(() => {
    const fetchdiagnoses = async () => {
      const options = {
        method: "GET",
        url: "/diagnoses",
        headers: {},
      };

      if (token) {
        options.headers.Authorization = `Bearer ${token}`;
      }

      try {
        const response = await axios.request(options);
        console.log(response.data);
        setdiagnoses(response.data);
      } catch (err) {
        console.error("Fetch diagnoses error:", err);
        toast.error("Failed to load diagnoses");
      }
    };

    fetchdiagnoses();
  }, [token]);

  const onDeleteCallback = (id) => {
    toast.success("diagnosis deleted successfully");
    setdiagnoses(diagnoses.filter((diagnosis) => diagnosis.id !== id));
  };

  return (
    <>
      <Button asChild variant="outline" className="mb-4 mr-auto block">
        <Link to={`/diagnoses/create`}>Create New diagnosis</Link>
      </Button>

      <div className="relative w-full">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {diagnoses.length === 0 && <p>No diagnoses available.</p>}
          {diagnoses.map((diagnosis, index) => {
            const idx = Number(diagnosis.id) || 0;
            const avatarColor = COLORS[Math.abs(idx) % COLORS.length];
            const dateStr = formatDate(diagnosis.diagnosis_date);
            const createdStr = diagnosis.createdAt ? formatDate(diagnosis.createdAt) : "—";
            const updatedStr = diagnosis.updatedAt ? formatDate(diagnosis.updatedAt) : "—";

            return (
              <AnimatedContent
                key={diagnosis.id}
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
                        {String(diagnosis.patient_id || '?').slice(0, 3)}
                      </div>
                      <div>
                        <CardTitle>Diagnosis #{diagnosis.id}</CardTitle>
                        <CardDescription>{dateStr}</CardDescription>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      <p className="text-sm text-muted-foreground">Patient ID: {diagnosis.patient_id}</p>
                      <p className="text-sm text-muted-foreground">Condition: {diagnosis.condition}</p>
                      <p className="text-sm text-muted-foreground">Created: {createdStr}</p>
                      <p className="text-sm text-muted-foreground">Updated: {updatedStr}</p>
                    </div>
                  </CardHeader>
                  <CardFooter className="mt-4 flex justify-between gap-2">
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => navigate(`/diagnoses/${diagnosis.id}`)}>
                              <Eye />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Diagnosis</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => navigate(`/diagnoses/${diagnosis.id}/edit`)}>
                              <Pencil />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit Diagnosis</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DeleteBtn onDeleteCallback={onDeleteCallback} resource="diagnoses" id={diagnosis.id} />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete Diagnosis</p>
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
