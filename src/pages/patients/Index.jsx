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
  const [patients, setpatients] = useState([]);

  const navigate = useNavigate();
  

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

  const onDeleteCallback = (id) => {
    toast.success("patient deleted successfully");
    setpatients(patients.filter(patient => patient.id !== id));
  
  };

  return (
    <>
    
      <Button
        asChild
        variant='outline'
        className='mb-4 mr-auto block'
      ><Link size='sm' to={`/patients/create`}>Create New patient</Link>
      </Button>


    <Table>
      <TableCaption>A list of your recent patients.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient) => (
          <TableRow key={patient.id}>
            <TableCell>{patient.first_name} {patient.last_name}</TableCell>
            <TableCell>{patient.email}</TableCell>
            <TableCell>{patient.phone}</TableCell>
            <TableCell>{patient.date_of_birth}</TableCell>
            <TableCell>{patient.address}</TableCell>
            <TableCell>{patient.createdAt}</TableCell>
            <TableCell>{patient.updatedAt}</TableCell>
            <TableCell>
              <div className="flex gap-2">
              <Button 
                className="cursor-pointer hover:border-blue-500"
                variant="outline"
                size="icon"
                onClick={() => navigate(`/patients/${patient.id}`)}
              ><Eye /></Button>
              <Button 
                className="cursor-pointer hover:border-blue-500"
                variant="outline"
                size="icon"
                onClick={() => navigate(`/patients/${patient.id}/edit`)}
              ><Pencil /></Button>
              <DeleteBtn onDeleteCallback={onDeleteCallback} resource="patients" id={patient.id} />
              </div>

            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </>
  );
}
