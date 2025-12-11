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
  const [diagnoses, setdiagnoses] = useState([]);
  const navigate = useNavigate();
  const { token } = useAuth();

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

      <Table>
        <TableCaption>A list of your recent diagnoses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Patient ID</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Diagnosis date</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {diagnoses.map((diagnosis) => (
            <TableRow key={diagnosis.id}>
              <TableCell>{diagnosis.patient_id}</TableCell>
              <TableCell>{diagnosis.condition}</TableCell>
              <TableCell>{diagnosis.diagnosis_date}</TableCell>
              <TableCell>{diagnosis.createdAt}</TableCell>
              <TableCell>{diagnosis.updatedAt}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    className="cursor-pointer hover:border-blue-500"
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/diagnoses/${diagnosis.id}`)}
                  >
                    <Eye />
                  </Button>
                  <Button
                    className="cursor-pointer hover:border-blue-500"
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/diagnoses/${diagnosis.id}/edit`)}
                  >
                    <Pencil />
                  </Button>
                  <DeleteBtn onDeleteCallback={onDeleteCallback} resource="diagnoses" id={diagnosis.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
