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
import { useAuth } from "@/hooks/useAuth";

export default function Index() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [prescriptions, setPrescriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const COLORS = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6"];

  const formatDate = (value) => {
    if (!value) return "N/A";
    const date = new Date(value);
    return isNaN(date.getTime()) ? value : date.toLocaleDateString();
  };

  useEffect(() => {
    let cancelled = false;

    const fetchPrescriptions = async () => {
      if (!token) {
        toast.error("Not authorized — please log in.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.request({
          method: "GET",
          url: "/prescriptions",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!cancelled) setPrescriptions(response.data || []);
      } catch (err) {
        console.error("fetch prescriptions error:", err.response?.data || err);
        if (err.response?.status === 401) {
          toast.error("Unauthorized — please log in.");
          navigate("/login");
        } else {
          toast.error("Failed to load prescriptions");
        }
      }
    };

    fetchPrescriptions();
    return () => {
      cancelled = true;
    };
  }, [token, navigate]);

  const filteredPrescriptions = prescriptions.filter((p) => {
    const term = searchTerm.toLowerCase();

    return (
      String(p.id).includes(term) ||
      String(p.patient_id).includes(term) ||
      String(p.doctor_id).includes(term) ||
      p.medication?.toLowerCase().includes(term) ||
      p.dosage?.toLowerCase().includes(term)
    );
  });

  const onDeleteCallback = (id) => {
    toast.success("Prescription deleted successfully");
    setPrescriptions((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search prescriptions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <Button asChild variant="outline" className="mb-4 mr-auto block">
          <Link to="/prescriptions/create">Create New Prescription</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPrescriptions.length === 0 && (
          <p>No prescriptions available.</p>
        )}

        {filteredPrescriptions.map((p, index) => {
          const avatarColor = COLORS[p.id % COLORS.length];
          const initials = `P${p.patient_id}`;

          return (
            <AnimatedContent
              key={p.id}
              distance={150}
              direction="vertical"
              duration={1.2}
              ease="bounce.out"
              initialOpacity={0.2}
              animateOpacity
              scale={1.05}
              delay={0.1 * index}
            >
              <Card className="p-4 backdrop-blur supports-[backdrop-filter]:bg-background/70">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold"
                      style={{ backgroundColor: avatarColor, color: "#fff" }}
                    >
                      {initials}
                    </div>
                    <div>
                      <CardTitle>Prescription #{p.id}</CardTitle>
                      <CardDescription>
                        Medication: {p.medication || "N/A"}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Patient ID: {p.patient_id}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Doctor ID: {p.doctor_id}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Diagnosis ID: {p.diagnosis_id}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Dosage: {p.dosage}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Start Date: {formatDate(p.start_date)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      End Date: {formatDate(p.end_date)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Created At: {formatDate(p.createdAt)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Updated At: {formatDate(p.updatedAt)}
                    </p>
                  </div>
                </CardHeader>

                <CardFooter className="mt-4 flex justify-between gap-2">
                  <TooltipProvider>
                    <div className="flex gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate(`/prescriptions/${p.id}`)}
                          >
                            <Eye />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View details</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              navigate(`/prescriptions/${p.id}/edit`)
                            }
                          >
                            <Pencil />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit prescription</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DeleteBtn
                            resource="prescriptions"
                            id={p.id}
                            onDeleteCallback={onDeleteCallback}
                          />
                        </TooltipTrigger>
                        <TooltipContent>Delete prescription</TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </CardFooter>
              </Card>
            </AnimatedContent>
          );
        })}
      </div>

      <div className="h-16" />
    </>
  );
}
