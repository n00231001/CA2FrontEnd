import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";

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

// import {
//   Card,
//   CardAction,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

export default function Index() {
  const [diagnoses, setdiagnoses] = useState([]);

  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchdiagnoses = async () => {
      const options = {
        method: "GET",
        url: "/diagnoses",
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setdiagnoses(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchdiagnoses();
  }, []);

  const onDeleteCallback = (id) => {
    toast.success("diagnosis deleted successfully");
    setdiagnoses(diagnoses.filter(diagnosis => diagnosis.id !== id));
  
  };

  return (
    <>
    
      <Button
        asChild
        variant='outline'
        className='mb-4 mr-auto block'
      ><Link size='sm' to={`/diagnoses/create`}>Create New diagnosis</Link>
      </Button>


    <Table>
      <TableCaption>A list of your recent diagnoses.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Patient ID</TableHead>
          <TableHead>Condition</TableHead>
          <TableHead>diagnosed with</TableHead>
          <TableHead>created at</TableHead>
          <TableHead>updated at</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {diagnoses.map((diagnosis) => (
          <TableRow key={diagnosis.id}>
            <TableCell>{diagnosis.patient_id}</TableCell>
            <TableCell>{diagnosis.condition}</TableCell>
            <TableCell>{diagnosis.diagnosed_with}</TableCell>
            <TableCell>{diagnosis.created_at}</TableCell>
            <TableCell>{diagnosis.updated_at}</TableCell>
            <TableCell>
              <div className="flex gap-2">
              <Button 
                className="cursor-pointer hover:border-blue-500"
                variant="outline"
                size="icon"
                onClick={() => navigate(`/diagnoses/${diagnosis.id}`)}
              ><Eye /></Button>
              <Button 
                className="cursor-pointer hover:border-blue-500"
                variant="outline"
                size="icon"
                onClick={() => navigate(`/diagnoses/${diagnosis.id}/edit`)}
              ><Pencil /></Button>
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
